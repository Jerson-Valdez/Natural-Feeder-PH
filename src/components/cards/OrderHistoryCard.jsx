import { Link } from "react-router-dom";
import Status from "../status/Status";

const labels = {
  awaiting_chat: "Awaiting Messenger chat",
  pending: "Awaiting Messenger chat",
  preparing: "Preparing your order",
  active: "Preparing your order",
  ready: "Ready for pickup / delivery",
  on_the_way: "On the way",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function OrderHistoryCard({
  orderId,
  createdAt,
  orderItems = [],
  orderTotal,
  status,
}) {
  const label =
    labels[status] || String(status || "awaiting_chat").replaceAll("_", " ");
  const color =
    status === "completed"
      ? "green"
      : status === "cancelled"
        ? "red"
        : ["preparing", "active", "ready", "on_the_way"].includes(status)
          ? "blue"
          : "yellow";
  return (
    <Link
      to={`/order-history/${encodeURIComponent(orderId)}`}
      className="block w-full rounded-2xl border border-white/40 bg-white/90 p-4 text-left shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-800"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-bold text-green-800">Order #{orderId}</h2>
          <p className="text-sm text-gray-600">{createdAt}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Status description={label} color={color} />
          <strong className="text-green-800">
            {Number(orderTotal).toLocaleString("en-PH", {
              style: "currency",
              currency: "PHP",
            })}
          </strong>
        </div>
      </div>
      <p className="mt-3 text-sm text-gray-700">
        {orderItems
          .map((item) => `${item.quantity} × ${item.name}`)
          .join(" · ")}
      </p>
      <p className="mt-1 text-xs text-gray-500">View full order details</p>
    </Link>
  );
}
