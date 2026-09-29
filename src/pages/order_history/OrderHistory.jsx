//components
import OrderHistoryCard from "../../components/cards/OrderHistoryCard";
import PrimaryButtonLink from "../../components/buttons/PrimaryButtonLink";
import OrderHistorySkeleton from "../../components/skeletons/OrderHistoryCardSkeleton";

//hooks
import { useEffect, useState } from "react";

//toast
import { toast } from "sonner";

//db
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

//context
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";

export default function OrderHistory() {
  const { orderHistoryIds } = useContext(CartContext);
  const [orderHistory, setOrderHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLiveOrders = async () => {
      if (orderHistoryIds.length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        const fetchPromises = orderHistoryIds.map((id) =>
          getDoc(doc(db, "orders", id)),
        );

        const documentSnapshots = await Promise.all(fetchPromises);

        const ordersData = documentSnapshots
          .filter((docSnap) => docSnap.exists())
          .map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }));

        ordersData.sort(
          (a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis(),
        );

        setOrderHistory(ordersData);
      } catch (error) {
        console.error("Error fetching order history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLiveOrders();
  }, [orderHistoryIds]);

  if (isLoading) {
    return (
      <main className="page-container">
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <h1 className="text-2xl font-bold text-green-800">
            Your Order History
          </h1>
          <p className="text-sm text-gray-600">
            Review your past orders and track their status. Stay informed about
            your purchases and manage your order history with ease.
          </p>
        </div>
        <div className="flex flex-col w-full items-center justify-start gap-4 mt-4">
          <p className="text-gray-600 w-full">{orderHistory.length} orders</p>
          {[1, 2, 3].map((skeletonId) => (
            <OrderHistorySkeleton key={skeletonId} />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="page-container">
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-green-800">
          Your Order History
        </h1>
        <p className="text-sm text-gray-600">
          Review your past orders and track their status. Stay informed about
          your purchases and manage your order history with ease.
        </p>
      </div>
      <div className="flex flex-col w-full items-center justify-center gap-4 mt-4">
        <p className="text-gray-600 w-full ">{orderHistory.length} orders</p>
        {orderHistory?.length === 0 && !isLoading ? (
          <>
            <p className="text-gray-500 text-sm font-medium pt-10">
              You have no order history yet. Start exploring our catalog and
              place your first order!
            </p>
            <PrimaryButtonLink text="Order Now" to="/order-now" />
          </>
        ) : (
          orderHistory.map((order) => (
            <OrderHistoryCard
              key={order.id}
              orderId={order.id}
              createdAt={
                order.createdAt
                  ? order.createdAt.toDate().toLocaleString("en-PH", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Just now"
              }
              orderBy={order.orderBy}
              orderLocation={order.orderLocation}
              orderVia={order.orderVia}
              orderModeTransport={order.orderModeTransport}
              orderItems={order.items}
              orderTotal={order.totalPrice}
              status={order.status}
            />
          ))
        )}
      </div>
    </main>
  );
}
