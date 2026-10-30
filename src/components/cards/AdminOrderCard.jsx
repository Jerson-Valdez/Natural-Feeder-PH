import { IconCheck, IconClock, IconX } from "@tabler/icons-react";
import Status from "../status/Status";

function formatDate(value) {
  const date = value?.toDate ? value.toDate() : value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime())
    ? date.toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" })
    : "Date unavailable";
}

export default function AdminOrderCard({
  order,
  currentStatus,
  isUpdating,
  onStatusChange,
}) {
  const statusColor =
    currentStatus === "completed"
      ? "green"
      : currentStatus === "cancelled"
        ? "red"
        : currentStatus === "active"
          ? "blue"
          : "yellow";

  return (
    <article className="w-full rounded-2xl border border-gray-100 bg-white p-4 shadow-lg transition-shadow hover:shadow-xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-bold text-green-900">
            {order.orderBy || "Guest order"}
          </p>
          <p className="break-all text-xs text-gray-500">ID: {order.id}</p>
          <p className="mt-1 text-sm text-gray-600">
            {order.orderLocation || "Location not provided"} ·{" "}
            {order.orderModeTransport || "Transport not specified"}
          </p>
          <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
        </div>
        <Status
          description={
            currentStatus === "pending" ? "Pending approval" : currentStatus
          }
          color={statusColor}
          icon={
            currentStatus === "pending" ? (
              <IconClock size={16} />
            ) : currentStatus === "completed" ? (
              <IconCheck size={16} />
            ) : currentStatus === "cancelled" ? (
              <IconX size={16} />
            ) : undefined
          }
        />
      </div>
      {currentStatus === "pending" && (
        <div className="mt-3 flex flex-wrap justify-end gap-2 border-t border-gray-100 pt-3">
          <p className="mr-auto flex items-center text-xs font-medium text-amber-800">
            This order is not approved or included in approved order totals yet.
          </p>
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => onStatusChange("cancelled")}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-red-800 px-4 py-2 text-sm font-semibold text-red-800 hover:bg-red-50 disabled:opacity-50 hover:cursor-pointer"
          >
            <IconX size={17} /> Reject
          </button>
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => onStatusChange("active")}
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-green-800 px-4 py-2 text-sm font-semibold text-white hover:bg-green-900 disabled:opacity-50 hover:cursor-pointer"
          >
            <IconCheck size={17} /> Approve order
          </button>
        </div>
      )}
      {currentStatus === "active" && (
        <div className="mt-3 flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
          <label
            className="text-xs font-semibold text-gray-600"
            htmlFor={`status-${order.id}`}
          >
            Next step
          </label>
          <select
            id={`status-${order.id}`}
            disabled={isUpdating}
            defaultValue=""
            onChange={(event) => {
              if (event.target.value) onStatusChange(event.target.value);
            }}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 disabled:opacity-50"
          >
            <option value="" disabled>
              Update status…
            </option>
            <option value="completed">Mark completed</option>
            <option value="cancelled">Cancel order</option>
          </select>
        </div>
      )}
      <div className="mt-3 border-t border-gray-100 pt-3">
        <p className="mb-1 text-xs font-semibold uppercase text-gray-500">
          Items
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
          {(order.items || []).map((item, index) => (
            <span key={`${item.id || item.name}-${index}`}>
              {item.quantity} × {item.name} ({item.size})
            </span>
          ))}
        </div>
        <p className="mt-2 text-right font-bold text-green-800">
          {Number(order.totalPrice || 0).toLocaleString("en-PH", {
            style: "currency",
            currency: "PHP",
          })}
        </p>
      </div>
    </article>
  );
}
