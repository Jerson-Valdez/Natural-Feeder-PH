//components
import OrderHistoryCard from "../../components/cards/OrderHistoryCard";
import PrimaryButtonLink from "../../components/buttons/PrimaryButtonLink";
import OrderHistorySkeleton from "../../components/skeletons/OrderHistoryCardSkeleton";

//hooks
import { useEffect, useState } from "react";

//toast
import { toast } from "sonner";

//db
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

export default function OrderHistory() {
  const [orderHistory, setOrderHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "orderHistory"));

        const orderHistoryArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (orderHistoryArray.length === 0) {
          toast.info("No order history found.");
          setOrderHistory([{
        id: 1,
        date: "2023-01-01",
        orderBy: "John Doe",
        location: "Paombong, Bulacan",
        via: "Messenger",
        modeTransport: "Pickup",
        items: [
          {
            id: 1,
            name: "Superworm",
            size: "small-medium",
            quantity: 1,
            pieces: 1000,
            freebies: 100,
            price: 300,
          },
          {
            id: 2,
            name: "Superworm",
            size: "large-extra large",
            quantity: 1,
            pieces: 1000,
            freebies: 100,
            price: 200,
          },
        ],
        total: 300,
      },
      {
        id: 1,
        date: "2023-01-01",
        orderBy: "John Doe",
        location: "Paombong, Bulacan",
        via: "Messenger",
        modeTransport: "Pickup",
        items: [
          {
            id: 1,
            name: "Superworm",
            size: "small-medium",
            quantity: 1,
            pieces: 1000,
            freebies: 100,
            price: 300,
          },
          {
            id: 2,
            name: "Superworm",
            size: "large-extra large",
            quantity: 1,
            pieces: 1000,
            freebies: 100,
            price: 200,
          },
        ],
        total: 300,
      },]);
        } else {
          setOrderHistory(orderHistoryArray);
        }
      } catch (error) {
        console.error("Error fetching order history:", error);
        toast.error("Failed to fetch order history. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

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
              orderDate={order.date}
              orderBy={order.orderBy}
              orderLocation={order.location}
              orderVia={order.via}
              orderModeTransport={order.modeTransport}
              orderItems={order.items}
              orderTotal={order.total}
            />
          ))
        )}
      </div>
    </main>
  );
}
