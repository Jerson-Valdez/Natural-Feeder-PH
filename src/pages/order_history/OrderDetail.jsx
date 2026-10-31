import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  IconArrowLeft,
  IconBrandMessengerFilled,
  IconCheck,
  IconClipboardCheck,
  IconPackage,
  IconTruckDelivery,
  IconCircleCheck,
  IconX,
  IconSend,
  IconClockCancel 
} from "@tabler/icons-react";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { toast } from "sonner";
import Status from "../../components/status/Status";
import { CartContext } from "../../context/CartContext";
import { db } from "../../config/firebase";

const statusLabels = {
  awaiting_chat: "Awaiting Messenger chat",
  pending: "Awaiting Messenger chat",
  preparing: "Preparing your order",
  active: "Preparing your order",
  ready: "Ready for pickup / delivery",
  on_the_way: "On the way",
  completed: "Completed",
  cancelled: "Cancelled",
};
const iconForStep = {
  awaiting_chat: IconClipboardCheck,
  preparing: IconPackage,
  ready: IconCheck,
  on_the_way: IconTruckDelivery,
  completed: IconCircleCheck,
  cancelled: IconClockCancel,
  submitted: IconSend,
};
const cancellable = (status) =>
  ["awaiting_chat", "pending", "preparing", "active"].includes(status);
function dateText(value) {
  const date = value?.toDate ? value.toDate() : value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime())
    ? date.toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" })
    : "Date unavailable";
}

export default function OrderDetail() {
  const { orderId } = useParams();
  const { orderHistoryIds } = useContext(CartContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const belongsToHistory = useMemo(
    () => orderHistoryIds.includes(orderId),
    [orderHistoryIds, orderId],
  );

  useEffect(() => {
    let current = true;
    async function load() {
      if (!belongsToHistory) {
        setLoading(false);
        return;
      }
      try {
        const snapshot = await getDoc(doc(db, "orders", orderId));
        if (current && snapshot.exists())
          setOrder({ id: snapshot.id, ...snapshot.data() });
      } catch (error) {
        console.error("Unable to load order details:", error);
        toast.error("Could not load this order.");
      } finally {
        if (current) setLoading(false);
      }
    }
    load();
    return () => {
      current = false;
    };
  }, [belongsToHistory, orderId]);

  async function continueToMessenger() {
    const message = `Hello! I placed order #${order.id}.\nName: ${order.orderBy}\nLocation: ${order.orderLocation}\n${(order.items || []).map((item) => `${item.quantity} × ${item.name} (${item.size || "standard"})`).join("\n")}\nTotal: ${Number(order.totalPrice || 0).toLocaleString("en-PH", { style: "currency", currency: "PHP" })}`;
    try {
      await navigator.clipboard.writeText(message);
      toast.success("Order details copied. Paste them in Messenger.");
    } catch {
      toast.error(
        "Could not copy the details automatically. You can still open Messenger.",
      );
    }
    try {
      const settingsSnapshot = await getDoc(doc(db, "settings", "store"));
      const messengerLink = settingsSnapshot.exists() && settingsSnapshot.data().messengerLink
        ? settingsSnapshot.data().messengerLink
        : "https://m.me/valdez.jerson.5";
      window.open(messengerLink, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Could not load Messenger link:", error);
      window.open("https://m.me/valdez.jerson.5", "_blank", "noopener,noreferrer");
    }
  }

  async function cancelOrder() {
    setBusy(true);
    try {
      const nextHistory = [
        ...(order.statusHistory || []),
        {
          status: "cancelled",
          at: new Date().toISOString(),
          note: "Cancelled by customer",
        },
      ];
      await updateDoc(doc(db, "orders", order.id), {
        status: "cancelled",
        updatedAt: serverTimestamp(),
        statusHistory: nextHistory,
      });
      setOrder((current) => ({
        ...current,
        status: "cancelled",
        statusHistory: nextHistory,
      }));
      toast.success("Order cancelled.");
    } catch (error) {
      console.error("Unable to cancel order:", error);
      toast.error("Unable to cancel this order. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (loading)
    return (
      <main className="page-container min-h-[70vh] items-stretch">
        <div
          role="status"
          className="min-h-[60vh] w-full animate-pulse rounded-2xl bg-gray-100"
          aria-label="Loading order details"
        />
      </main>
    );
  if (!belongsToHistory || !order)
    return (
      <main className="page-container min-h-[70vh] items-start">
        <p className="text-gray-600">
          This order could not be found in this device’s order history.
        </p>
        <Link
          to="/order-history"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-green-800"
        >
          <IconArrowLeft size={18} />
          Back to order history
        </Link>
      </main>
    );

  const rawStatus = String(order.status || "awaiting_chat").toLowerCase();
  const status =
    rawStatus === "awaiting messenger chat"
      ? "awaiting_chat"
      : rawStatus.replaceAll(" ", "_");
  const color =
    status === "completed"
      ? "green"
      : status === "cancelled"
        ? "red"
        : ["preparing", "active", "ready", "on_the_way"].includes(status)
          ? "blue"
          : "yellow";
  const timeline = order.statusHistory?.length
    ? order.statusHistory
    : [{ status, at: order.createdAt, note: "Order submitted" }];
  const deliverySteps = [
    { id: "awaiting_chat", label: "Submitted" },
    { id: "preparing", label: "Preparing" },
    { id: "ready", label: "Ready" },
    ...(order.orderModeTransport === "delivery"
      ? [{ id: "on_the_way", label: "On the way" }]
      : []),
    {
      id: "completed",
      label:
        order.orderModeTransport === "delivery" ? "Delivered" : "Picked up",
    },
  ];
  const stepIndex =
    status === "cancelled"
      ? -1
      : Math.max(
          0,
          deliverySteps.findIndex(
            (step) =>
              step.id === status ||
              (status === "active" && step.id === "preparing"),
          ),
        );
  return (
    <main className="page-container min-h-[calc(100vh-5rem)] items-stretch gap-2">
      <div className="flex flex-row w-full items-start justify-start gap-2 text-start mb-2">
        <Link
          to="/order-history"
          className="flex min-h-10 w-fit items-center gap-2 rounded-full px-3 text-sm font-semibold text-green-800 hover:bg-green-50"
        >
          <IconArrowLeft size={18} />
          Order history
        </Link>
      </div>
      <header className="flex w-full flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">
            Order placed {dateText(order.createdAt)}
          </p>
          <h1 className="mt-1 break-all text-xl font-bold text-green-900 sm:text-3xl">
            Order #{order.id}
          </h1>
        </div>
        <Status
          description={statusLabels[status] || status.replaceAll("_", " ")}
          color={color}
        />
      </header>
      <section className="w-full rounded-2xl border border-gray-100 bg-white p-5 shadow-lg sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-gray-900">Order progress</h2>
          <p className="text-sm font-semibold text-green-700">
            {statusLabels[status] || status.replaceAll("_", " ")}
          </p>
        </div>
        {status === "cancelled" ? (
          <p className="mt-4 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-800">
            This order was cancelled.
          </p>
        ) : (
          <ol
            className="grid gap-1 sm:gap-3"
            style={{
              gridTemplateColumns: `repeat(${deliverySteps.length}, minmax(0, 1fr))`,
            }}
          >
            {deliverySteps.map((step, index) => {
              const reached = index <= stepIndex;
              const StepIcon = iconForStep[step.id] || IconCheck;
              return (
                <li key={step.id} className="relative text-center">
                  <div
                    className={`relative z-10 mx-auto flex h-11 w-11 items-center justify-center rounded-full border-2 transition-colors ${index < stepIndex ? "border-green-700 bg-green-700 text-white" : index === stepIndex ? "border-green-700 bg-green-50 text-green-800 ring-4 ring-green-100" : "border-gray-200 bg-white text-gray-400"}`}
                  >
                    {stepIndex > index ? (
                      <StepIcon size={22} stroke={2} className="text-white" />
                    ) : (
                      <StepIcon size={22} stroke={2} className={index <= stepIndex ? "text-green-800" : "text-gray-400"} />
                    )}
                  </div>
                  {index < deliverySteps.length - 1 && (
                    <span
                      aria-hidden="true"
                      className={`absolute left-1/2 right-[-50%] top-[1.35rem] z-0 h-0.5 ${index < stepIndex ? "bg-green-700" : "bg-gray-300"}`}
                    />
                  )}
                  <p
                    className={`mt-2 text-[10px] leading-tight sm:text-xs ${reached ? "font-semibold text-green-800" : "text-gray-400"}`}
                  >
                    {step.label}
                  </p>
                </li>
              );
            })}
          </ol>
        )}
      </section>
      <div className="grid w-full flex-1 content-start gap-2 lg:grid-cols-[minmax(0,1.7fr)_minmax(18rem,1fr)]">
        <div className="flex flex-col gap-2">
          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-lg sm:p-7">
            <h2 className="text-lg font-bold text-gray-900">
              Items in this order
            </h2>
            <div className="mt-4 divide-y divide-gray-100">
              {(order.items || []).map((item, index) => (
                <div
                  key={`${item.id || item.name}-${index}`}
                  className="flex flex-wrap justify-between gap-3 py-4"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      Qty {item.quantity}
                      {item.size ? ` · ${item.size}` : ""}
                      {item.pieces ? ` · ${item.pieces} pcs` : ""}
                    </p>
                  </div>
                  <span className="font-semibold text-gray-800">
                    {(
                      Number(item.price || 0) * Number(item.quantity || 0)
                    ).toLocaleString("en-PH", {
                      style: "currency",
                      currency: "PHP",
                    })}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-4 text-lg font-black">
              <span>Total</span>
              <span className="text-green-800">
                {Number(order.totalPrice || 0).toLocaleString("en-PH", {
                  style: "currency",
                  currency: "PHP",
                })}
              </span>
            </div>
          </section>
          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-lg sm:p-7">
            <h2 className="text-lg font-bold text-gray-900">
              Fulfilment details
            </h2>
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Customer
                </p>
                <p className="text-sm text-gray-800">{order.orderBy}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Method
                </p>
                <p className="text-sm capitalize text-gray-800">
                  {order.orderModeTransport}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Location
                </p>
                <p className="mt-1 text-sm text-gray-800">
                  {order.orderLocation}
                </p>
              </div>
            </div>
          </section>
        </div>
        <aside className="flex flex-col gap-5">
          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-lg sm:p-6">
            <h2 className="text-lg font-bold text-gray-900">Order actions</h2>
            <div className="mt-4 flex flex-col gap-3">
              {["awaiting_chat", "pending"].includes(status) && (
                <button
                  onClick={continueToMessenger}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-green-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-900 hover:cursor-pointer"
                >
                  <IconBrandMessengerFilled size={18} />
                  Continue to Messenger
                </button>
              )}
              {cancellable(status) && (
                <button
                  disabled={busy}
                  onClick={cancelOrder}
                  className="min-h-11 rounded-full border border-red-700 px-5 py-2.5 text-sm font-semibold text-red-700 disabled:opacity-50 hover:cursor-pointer"
                >
                  {busy ? "Cancelling…" : "Cancel order"}
                </button>
              )}
              {status === "on_the_way" && (
                <p className="text-sm text-gray-500">
                  This order can no longer be cancelled because it is on the
                  way.
                </p>
              )}
              {!cancellable(status) &&
                !["awaiting_chat", "pending"].includes(status) &&
                status !== "on_the_way" && (
                  <p className="text-sm text-gray-600">
                    No further actions are available for this order.
                  </p>
                )}
            </div>
          </section>
          <section className="flex-1 rounded-2xl border border-gray-100 bg-white p-5 shadow-lg sm:p-6">
            <h2 className="text-lg font-bold text-gray-900">Status history</h2>
            <ol className="mt-5 space-y-5 border-l-2 border-green-100 pl-4">
              {timeline.map((entry, index) => (
                <li key={index}>
                  <p className="font-semibold text-green-900">
                    {statusLabels[entry.status] || entry.status}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {dateText(entry.at)}
                  </p>
                  {entry.note && (
                    <p className="mt-1 text-sm text-gray-600">{entry.note}</p>
                  )}
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 p-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-xl gap-3">
          {["awaiting_chat", "pending"].includes(status) && (
            <button
              onClick={continueToMessenger}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-green-800 px-4 py-2 text-sm font-semibold text-white hover:cursor-pointer"
            >
              <IconBrandMessengerFilled size={18} />
              Continue to Messenger
            </button>
          )}
          {cancellable(status) && (
            <button
              disabled={busy}
              onClick={cancelOrder}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-red-700 px-4 py-2 text-sm font-semibold text-red-700 disabled:opacity-50 hover:cursor-pointer"
            >
              <IconX size={18} />
              {busy ? "Cancelling…" : "Cancel order"}
            </button>
          )}
          {!cancellable(status) &&
            !["awaiting_chat", "pending"].includes(status) && (
              <Link
                to="/order-history"
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-green-800 px-4 py-2 text-sm font-semibold text-green-800 hover:cursor-pointer"
              >
                <IconArrowLeft size={18} />
                Back to order history
              </Link>
            )}
        </div>
      </div>
      <div className="h-16 w-full lg:hidden" />
    </main>
  );
}
