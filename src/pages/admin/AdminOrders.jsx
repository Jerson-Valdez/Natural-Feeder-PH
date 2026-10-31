import { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  doc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { IconRefresh, IconSearch, IconPlus } from "@tabler/icons-react";
import { toast } from "sonner";
import { db } from "../../config/firebase";
import AdminOrderCard from "../../components/cards/AdminOrderCard";
import AdminOrderCardSkeleton from "../../components/skeletons/AdminOrderCardSkeleton";
import EmptyState from "../../components/EmptyState";
import AdminCreateOrderDialog from "../../components/dialogs/AdminCreateOrderDialog";
import FeedbackDialog from "../../components/dialogs/FeedbackDialog";

function statusLabel(status) {
  if (status === "awaiting messenger chat") return "awaiting_chat";
  if (status === "pending") return "awaiting_chat";
  return status || "awaiting_chat";
}

function orderTab(status) {
  if (["pending", "awaiting messenger chat"].includes(status)) return "awaiting_chat";
  if (status === "active") return "preparing";
  return status || "awaiting_chat";
}

function orderDate(value) {
  const date = value?.toDate ? value.toDate() : value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [transportFilter, setTransportFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [products, setProducts] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [feedback, setFeedback] = useState(null);

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
    getDocs(collection(db, "products")).then((snapshot) => setProducts(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })))).catch((error) => { console.error(error); toast.error("Could not load products for order creation."); });
  }, []);

  const tabCounts = useMemo(
    () => ({
      all: orders.length,
      ...Object.fromEntries(["awaiting_chat", "preparing", "ready", "on_the_way", "completed", "cancelled"].map((status) => [status, orders.filter((order) => orderTab(order.status) === status).length])),
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
          const matchesTab = activeTab === "all" || orderTab(order.status) === activeTab;
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
      ["awaiting_chat", "pending"].includes(currentStatus)
        ? ["preparing", "cancelled"]
        : currentStatus === "preparing"
          ? ["ready", "cancelled"]
          : currentStatus === "ready"
            ? ["on_the_way", "completed"]
            : currentStatus === "on_the_way"
              ? ["completed"]
              : [];
    if (!allowedNextStatuses.includes(nextStatus)) return;
    setUpdatingId(order.id);
    try {
      await updateDoc(doc(db, "orders", order.id), {
        status: nextStatus,
        updatedAt: serverTimestamp(),
        statusHistory: [...(order.statusHistory || []), { status: nextStatus, at: new Date().toISOString() }],
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

  async function deleteOrder(order) {
    setFeedback({ variant: "confirm", title: "Delete this order?", message: `Order ${order.id} will be permanently deleted. This cannot be undone.`, confirmLabel: "Delete order", action: () => performDelete(order) });
  }

  async function performDelete(order) {
    setDeletingId(order.id);
    try {
      await deleteDoc(doc(db, "orders", order.id));
      setOrders((current) => current.filter((item) => item.id !== order.id));
      setFeedback({ variant: "info", title: "Order deleted", message: `Order ${order.id} was deleted.` });
    } catch (error) {
      console.error("Unable to delete order:", error);
      toast.error("Could not delete this order. Please try again.");
    } finally { setDeletingId(""); }
  }

  async function createOrder({ customer, location, transport, product, bundle, quantity }) {
    const price = Number(bundle.price);
    const totalPrice = price * quantity;
    setCreating(true);
    try {
      const orderData = {
        items: [{ id: product.id, name: product.productName, size: bundle.size, price, pieces: Number(bundle.pieces), freebies: product.productFreebies || "", quantity }],
        totalPrice, orderBy: customer, orderLocation: location, orderModeTransport: transport,
        status: "preparing", orderVia: "admin", createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
        statusHistory: [{ status: "preparing", at: new Date().toISOString(), note: "Order created and approved by admin" }],
      };
      const created = await addDoc(collection(db, "orders"), orderData);
      setOrders((current) => [{ id: created.id, ...orderData, createdAt: new Date() }, ...current]);
      setActiveTab("preparing"); setIsCreateOpen(false); setFeedback({ variant: "info", title: "Order created", message: `Order ${created.id} was created and is now preparing.` });
    } catch (error) { console.error("Unable to create admin order:", error); toast.error("Could not create this order."); }
    finally { setCreating(false); }
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
        <div className="flex gap-2">
        <button
          type="button"
          onClick={loadOrders}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-green-800 shadow-md disabled:opacity-50 hover:cursor-pointer hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300"
        >
          <IconRefresh size={18} /> Refresh
        </button>
        <button type="button" onClick={() => setIsCreateOpen(true)} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-green-800 px-3 py-2 text-sm font-semibold text-white shadow-md hover:bg-green-900 hover:shadow-xl hover:cursor-pointer hover:-translate-y-0.5 transition-all duration-300"><IconPlus size={18}/>Add order</button>
        </div>
      </div>
      <div className="mt-2 w-full">
        <div
          role="group"
          aria-label="Filter orders by status"
          className="flex w-full flex-wrap items-center gap-2 rounded-2xl bg-white p-2 shadow-lg"
        >
          {[
            { id: "all", label: "All orders" },
            { id: "awaiting_chat", label: "Awaiting chat" },
            { id: "preparing", label: "Preparing" },
            { id: "ready", label: "Ready" },
            { id: "on_the_way", label: "On the way" },
            { id: "completed", label: "Completed" },
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
          <EmptyState title="No orders in this tab" description="Orders with this status will appear here." />
        ) : (
          visibleOrders.map((order) => (
            <AdminOrderCard
              key={order.id}
              order={order}
              currentStatus={statusLabel(order.status)}
              isUpdating={updatingId === order.id}
              isDeleting={deletingId === order.id}
              onStatusChange={(nextStatus) => changeStatus(order, nextStatus)}
              onDelete={() => deleteOrder(order)}
            />
          ))
        )}
      </div>
      {isCreateOpen && <AdminCreateOrderDialog products={products} onClose={() => setIsCreateOpen(false)} onSubmit={createOrder} saving={creating}/>}
      <FeedbackDialog open={Boolean(feedback)} variant={feedback?.variant} title={feedback?.title} message={feedback?.message} confirmLabel={feedback?.confirmLabel} onConfirm={() => feedback?.action?.()} onClose={() => setFeedback(null)} busy={Boolean(deletingId)} />
    </main>
  );
}
