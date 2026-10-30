import { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { IconRefresh, IconSearch } from "@tabler/icons-react";
import { toast } from "sonner";
import { db } from "../../config/firebase";
import AdminOrderCard from "../../components/cards/AdminOrderCard";
import AdminOrderCardSkeleton from "../../components/skeletons/AdminOrderCardSkeleton";

function statusLabel(status) {
  return status === "awaiting messenger chat" ? "pending" : status || "pending";
}

function orderTab(status) {
  if (status === "pending" || status === "awaiting messenger chat")
    return "pending";
  if (status === "cancelled") return "cancelled";
  if (["active", "completed"].includes(status)) return "approved";
  return "pending";
}

function orderDate(value) {
  const date = value?.toDate ? value.toDate() : value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [search, setSearch] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [transportFilter, setTransportFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");

  async function loadOrders() {
    setLoading(true);
    try {
      const snapshot = await getDocs(
        query(collection(db, "orders"), orderBy("createdAt", "desc")),
      );
      setOrders(
        snapshot.docs.map((orderDoc) => ({
          id: orderDoc.id,
          ...orderDoc.data(),
        })),
      );
    } catch (error) {
      console.error("Unable to load orders:", error);
      toast.error("Could not load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const tabCounts = useMemo(
    () => ({
      pending: orders.filter((order) => orderTab(order.status) === "pending")
        .length,
      approved: orders.filter((order) => orderTab(order.status) === "approved")
        .length,
      cancelled: orders.filter(
        (order) => orderTab(order.status) === "cancelled",
      ).length,
    }),
    [orders],
  );

  const productOptions = useMemo(
    () =>
      [
        ...new Set(
          orders.flatMap((order) =>
            (order.items || []).map((item) => item.name).filter(Boolean),
          ),
        ),
      ].sort((a, b) => a.localeCompare(b)),
    [orders],
  );

  const visibleOrders = useMemo(
    () =>
      orders
        .filter((order) => {
          const matchesTab = orderTab(order.status) === activeTab;
          const haystack =
            `${order.orderBy || ""} ${order.orderLocation || ""} ${order.id}`.toLowerCase();
          const matchesSearch = haystack.includes(search.trim().toLowerCase());
          const matchesProduct =
            !productFilter ||
            (order.items || []).some((item) => item.name === productFilter);
          const matchesTransport =
            !transportFilter || order.orderModeTransport === transportFilter;
          const date = orderDate(order.createdAt);
          const afterStart =
            !fromDate || (date && date >= new Date(`${fromDate}T00:00:00`));
          const beforeEnd =
            !toDate || (date && date <= new Date(`${toDate}T23:59:59.999`));
          return (
            matchesTab &&
            matchesSearch &&
            matchesProduct &&
            matchesTransport &&
            afterStart &&
            beforeEnd
          );
        })
        .sort((a, b) => {
          const aTime = orderDate(a.createdAt)?.getTime() || 0;
          const bTime = orderDate(b.createdAt)?.getTime() || 0;
          return sortOrder === "oldest" ? aTime - bTime : bTime - aTime;
        }),
    [
      orders,
      activeTab,
      search,
      productFilter,
      transportFilter,
      fromDate,
      toDate,
      sortOrder,
    ],
  );

  function clearFilters() {
    setSearch("");
    setProductFilter("");
    setTransportFilter("");
    setFromDate("");
    setToDate("");
    setSortOrder("newest");
  }

  async function changeStatus(order, nextStatus) {
    const currentStatus = statusLabel(order.status);
    const allowedNextStatuses =
      currentStatus === "pending"
        ? ["active", "cancelled"]
        : currentStatus === "active"
          ? ["completed", "cancelled"]
          : [];
    if (!allowedNextStatuses.includes(nextStatus)) return;
    setUpdatingId(order.id);
    try {
      await updateDoc(doc(db, "orders", order.id), {
        status: nextStatus,
        updatedAt: serverTimestamp(),
      });
      setOrders((current) =>
        current.map((item) =>
          item.id === order.id ? { ...item, status: nextStatus } : item,
        ),
      );
      toast.success(`Order marked ${nextStatus}.`);
    } catch (error) {
      console.error("Unable to update order status:", error);
      toast.error("Could not update this order. Please try again.");
    } finally {
      setUpdatingId("");
    }
  }

  return (
    <main className="page-container" aria-busy={loading}>
      <div className="flex w-full flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-green-800">Orders</h1>
          <p className="text-sm text-gray-600">
            Review incoming orders and keep their status up to date.
          </p>
        </div>
        <button
          type="button"
          onClick={loadOrders}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-green-800 shadow-md disabled:opacity-50 hover:cursor-pointer hover:-translate-y-0.5 hover:shadow-xl transition-all"
        >
          <IconRefresh size={18} /> Refresh
        </button>
      </div>
      <div className="mt-2 w-full">
        <div
          role="group"
          aria-label="Order groups"
          className="flex w-fit min-w-full items-center gap-2 rounded-2xl bg-white p-2 shadow-lg sm:min-w-0"
        >
          {[
            { id: "pending", label: "Pending / Messenger" },
            { id: "approved", label: "Approved / Final" },
            { id: "cancelled", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              aria-pressed={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-800 focus-visible:ring-offset-2 ${activeTab === tab.id ? "bg-green-800 text-white shadow-md" : "bg-white text-gray-600 hover:bg-green-50 hover:text-green-900"}`}
            >
              {tab.label}
              <span
                className={`min-w-6 rounded-full px-2 py-0.5 text-xs ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"}`}
              >
                {tabCounts[tab.id] || 0}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-2 grid w-full grid-cols-1 gap-2 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl sm:grid-cols-2 xl:grid-cols-4">
        <label className="flex min-h-11 min-w-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 transition-colors focus-within:border-green-700 focus-within:ring-2 focus-within:ring-green-700/20 sm:col-span-2">
          <IconSearch size={18} className="shrink-0 text-gray-400" />
          <span className="sr-only">Search orders</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, location, or order ID"
            className="w-full min-w-0 text-sm text-gray-800 outline-none placeholder:text-gray-400"
          />
        </label>
        <label className="flex min-h-11 flex-col justify-center gap-0.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 focus-within:border-green-700 focus-within:ring-2 focus-within:ring-green-700/20">
          Product
          <select
            value={productFilter}
            onChange={(event) => setProductFilter(event.target.value)}
            className="w-full cursor-pointer bg-transparent text-sm font-semibold text-green-900 outline-none"
          >
            <option value="">All products</option>
            {productOptions.map((product) => (
              <option key={product} value={product}>
                {product}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-h-11 flex-col justify-center gap-0.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 focus-within:border-green-700 focus-within:ring-2 focus-within:ring-green-700/20">
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
        <label className="flex min-h-11 flex-col justify-center gap-0.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 focus-within:border-green-700 focus-within:ring-2 focus-within:ring-green-700/20">
          From date
          <input
            type="date"
            value={fromDate}
            max={toDate || undefined}
            onChange={(event) => setFromDate(event.target.value)}
            className="w-full cursor-pointer bg-transparent text-sm font-semibold text-green-900 outline-none"
          />
        </label>
        <label className="flex min-h-11 flex-col justify-center gap-0.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 focus-within:border-green-700 focus-within:ring-2 focus-within:ring-green-700/20">
          To date
          <input
            type="date"
            value={toDate}
            min={fromDate || undefined}
            onChange={(event) => setToDate(event.target.value)}
            className="w-full cursor-pointer bg-transparent text-sm font-semibold text-green-900 outline-none"
          />
        </label>
        <label className="flex min-h-11 flex-col justify-center gap-0.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 focus-within:border-green-700 focus-within:ring-2 focus-within:ring-green-700/20">
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
          className="min-h-11 rounded-xl border border-green-800 px-4 py-2 text-sm font-semibold text-green-800 transition-colors hover:bg-green-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-800 focus-visible:ring-offset-2"
        >
          Clear filters
        </button>
      </div>
      <div className="mt-3 flex w-full flex-col gap-3">
        {loading ? (
          <div
            role="status"
            aria-label="Loading orders"
            className="flex w-full flex-col gap-3"
          >
            {[1, 2, 3].map((key) => (
              <AdminOrderCardSkeleton key={key} />
            ))}
          </div>
        ) : visibleOrders.length === 0 ? (
          <p className="w-full p-6 text-center text-sm text-gray-500">
            No orders in this tab.
          </p>
        ) : (
          visibleOrders.map((order) => (
            <AdminOrderCard
              key={order.id}
              order={order}
              currentStatus={statusLabel(order.status)}
              isUpdating={updatingId === order.id}
              onStatusChange={(nextStatus) => changeStatus(order, nextStatus)}
            />
          ))
        )}
      </div>
    </main>
  );
}
