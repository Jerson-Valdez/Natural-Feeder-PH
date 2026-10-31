import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { IconSearch } from "@tabler/icons-react";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "sonner";
import OrderHistoryCard from "../../components/cards/OrderHistoryCard";
import OrderHistorySkeleton from "../../components/skeletons/OrderHistoryCardSkeleton";
import { CartContext } from "../../context/CartContext";
import { db } from "../../config/firebase";

const statusTabs = [
  { id: "all", label: "All" },
  { id: "awaiting_chat", label: "Awaiting chat" },
  { id: "preparing", label: "Preparing" },
  { id: "ready", label: "Ready" },
  { id: "on_the_way", label: "On the way" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

function normalizedStatus(status) {
  if (["awaiting messenger chat", "pending"].includes(status))
    return "awaiting_chat";
  if (status === "active") return "preparing";
  return status || "awaiting_chat";
}

function getOrderDate(order) {
  const value = order.createdAt;
  const date = value?.toDate ? value.toDate() : value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
}

export default function OrderHistory() {
  const { orderHistoryIds } = useContext(CartContext);
  const [orderHistory, setOrderHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [transportFilter, setTransportFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let isCurrent = true;
    async function fetchLiveOrders() {
      setIsLoading(true);
      if (orderHistoryIds.length === 0) {
        setOrderHistory([]);
        setIsLoading(false);
        return;
      }
      try {
        const snapshots = await Promise.all(
          orderHistoryIds.map((id) => getDoc(doc(db, "orders", id))),
        );
        if (!isCurrent) return;
        const orders = snapshots
          .filter((snapshot) => snapshot.exists())
          .map((snapshot) => ({ id: snapshot.id, ...snapshot.data() }));
        setOrderHistory(orders);
      } catch (error) {
        console.error("Error fetching order history:", error);
        if (isCurrent)
          toast.error("Could not load your order history. Please try again.");
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }
    fetchLiveOrders();
    return () => {
      isCurrent = false;
    };
  }, [orderHistoryIds]);

  const statusCounts = useMemo(
    () =>
      statusTabs.reduce((counts, tab) => {
        counts[tab.id] =
          tab.id === "all"
            ? orderHistory.length
            : orderHistory.filter(
                (order) => normalizedStatus(order.status) === tab.id,
              ).length;
        return counts;
      }, {}),
    [orderHistory],
  );

  const visibleOrders = useMemo(
    () =>
      orderHistory
        .filter((order) => {
          const matchesStatus =
            statusFilter === "all" ||
            normalizedStatus(order.status) === statusFilter;
          const matchesTransport =
            !transportFilter || order.orderModeTransport === transportFilter;
          const searchableText =
            `${order.id} ${order.orderBy || ""} ${order.orderLocation || ""} ${(order.items || []).map((item) => `${item.name || ""} ${item.size || ""}`).join(" ")}`.toLowerCase();
          return (
            matchesStatus &&
            matchesTransport &&
            searchableText.includes(search.trim().toLowerCase())
          );
        })
        .sort((a, b) => {
          const aTime = getOrderDate(a)?.getTime() || 0;
          const bTime = getOrderDate(b)?.getTime() || 0;
          return sortOrder === "oldest" ? aTime - bTime : bTime - aTime;
        }),
    [orderHistory, statusFilter, transportFilter, search, sortOrder],
  );

  function clearFilters() {
    setStatusFilter("all");
    setTransportFilter("");
    setSortOrder("newest");
    setSearch("");
  }

  return (
    <main className="page-container" aria-busy={isLoading}>
      <div className="flex flex-col w-full items-start justify-start gap-2 text-start">
        <h1 className="text-2xl font-bold text-green-800">
          Your Order History
        </h1>
        <p className="text-sm text-gray-600">
          Review your past orders and track their status.
        </p>
      </div>

      {!isLoading && orderHistory.length > 0 && (
        <>
          <div className="mt-4 w-full sm:hidden">
            <label className="flex min-h-11 w-full flex-col justify-center gap-0.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 shadow-lg focus-within:border-green-700 focus-within:ring-2 focus-within:ring-green-700/20">
              Filter by status
              <select
                aria-label="Filter orders by status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full cursor-pointer bg-transparent text-sm font-semibold text-green-900 outline-none"
              >
                {statusTabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {tab.label} ({statusCounts[tab.id] || 0})
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div
            role="group"
            aria-label="Filter orders by status"
            className="mt-4 hidden w-full flex-wrap items-center gap-2 rounded-2xl bg-white p-2 shadow-lg sm:flex"
          >
            {statusTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                aria-pressed={statusFilter === tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`inline-flex min-h-10 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-800 focus-visible:ring-offset-2 ${statusFilter === tab.id ? "bg-green-800 text-white shadow-md" : "text-gray-600 hover:bg-green-50 hover:text-green-900"}`}
              >
                {tab.label}
                <span
                  className={`min-w-6 rounded-full px-2 py-0.5 text-xs ${statusFilter === tab.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"}`}
                >
                  {statusCounts[tab.id] || 0}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-3 flex w-full flex-wrap items-center gap-2 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl">
            <label className="flex min-h-11 min-w-0 flex-[2_1_220px] items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 transition-colors focus-within:border-green-700 focus-within:ring-2 focus-within:ring-green-700/20">
              <IconSearch size={18} className="shrink-0 text-gray-400" />
              <span className="sr-only">Search order history</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search order ID or product"
                className="w-full min-w-0 text-sm outline-none placeholder:text-gray-400"
              />
            </label>
            <label className="flex min-h-11 flex-[1_1_130px] flex-col justify-center gap-0.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 focus-within:border-green-700 focus-within:ring-2 focus-within:ring-green-700/20">
              Transport
              <select
                value={transportFilter}
                onChange={(event) => setTransportFilter(event.target.value)}
                className="w-full cursor-pointer bg-transparent text-sm font-semibold capitalize text-green-900 outline-none"
              >
                <option value="">All methods</option>
                <option value="pickup">Pickup</option>
                <option value="delivery">Delivery</option>
              </select>
            </label>
            <label className="flex min-h-11 flex-[1_1_130px] flex-col justify-center gap-0.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 focus-within:border-green-700 focus-within:ring-2 focus-within:ring-green-700/20">
              Sort by date
              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
                className="w-full cursor-pointer bg-transparent text-sm font-semibold text-green-900 outline-none"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </label>
            <button
              type="button"
              onClick={clearFilters}
              className="min-h-11 flex-[0_0_auto] rounded-xl border border-green-800 px-4 py-2 text-sm font-semibold text-green-800 transition-colors hover:bg-green-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-800 focus-visible:ring-offset-2"
            >
              Clear filters
            </button>
          </div>
        </>
      )}

      <div className="mt-4 flex w-full flex-col items-center justify-center gap-4">
        {isLoading ? (
          <div
            role="status"
            aria-label="Loading your orders"
            className="flex w-full flex-col items-center gap-4"
          >
            {[1, 2, 3].map((key) => (
              <OrderHistorySkeleton key={key} />
            ))}
          </div>
        ) : orderHistory.length === 0 ? (
          <div className="flex w-full flex-col items-center gap-4 pt-8 text-center">
            <p className="text-sm font-medium text-gray-500">
              You have no order history yet. Start exploring our catalog and
              place your first order!
            </p>
            <Link
              to="/order-now"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-green-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-800 focus-visible:ring-offset-2"
            >
              Order Now
            </Link>
          </div>
        ) : visibleOrders.length === 0 ? (
          <div className="flex w-full flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-lg">
            <p className="text-sm text-gray-600">
              No orders match these filters.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-full border border-green-800 px-4 py-2 text-sm font-semibold text-green-800 hover:bg-green-50"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            {visibleOrders.map((order) => (
              <OrderHistoryCard
                key={order.id}
                orderId={order.id}
                createdAt={
                  getOrderDate(order)
                    ? getOrderDate(order).toLocaleString("en-PH", {
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
                orderItems={order.items || []}
                orderTotal={Number(order.totalPrice || 0)}
                status={order.status}
                statusHistory={order.statusHistory || []}
              />
            ))}
          </>
        )}
      </div>
    </main>
  );
}
