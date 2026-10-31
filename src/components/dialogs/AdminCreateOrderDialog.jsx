import { useMemo, useState } from "react";
import { IconX, IconPlus } from "@tabler/icons-react";

export default function AdminCreateOrderDialog({
  products,
  onClose,
  onSubmit,
  saving,
}) {
  const [customer, setCustomer] = useState("");
  const [location, setLocation] = useState("");
  const [transport, setTransport] = useState("delivery");
  const [productId, setProductId] = useState("");
  const product = products.find((item) => item.id === productId);
  const bundles = product?.productBundleInfo || [];
  const [bundleIndex, setBundleIndex] = useState("0");
  const [quantity, setQuantity] = useState("1");
  const bundle = bundles[Number(bundleIndex)];
  const total = useMemo(
    () => Number(bundle?.price || 0) * Number(quantity || 0),
    [bundle, quantity],
  );
  async function submit(event) {
    event.preventDefault();
    if (!product || !bundle || Number(quantity) < 1) return;
    await onSubmit({
      customer: customer.trim(),
      location: location.trim(),
      transport,
      product,
      bundle,
      quantity: Number(quantity),
    });
  }
  const field =
    "mt-1 min-h-11 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20";
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-3 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-create-order-title"
        onSubmit={submit}
        className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
      >
        <header className="flex items-start justify-between">
          <div>
            <h2
              id="admin-create-order-title"
              className="text-lg font-bold text-green-900"
            >
              Create an order
            </h2>
            <p className="text-sm text-gray-500">
              Admin-created orders start as preparing.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 hover:bg-gray-100 hover:cursor-pointer"
          >
            <IconX size={20} />
          </button>
        </header>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-medium text-gray-700">
            Customer name
            <input
              required
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className={field}
            />
          </label>
          <label className="text-sm font-medium text-gray-700">
            Phone or contact (optional)
            <input
              value=""
              onChange={() => {}}
              disabled
              placeholder="Add in order notes later"
              className={`${field} bg-gray-50`}
            />
          </label>
          <label className="text-sm font-medium text-gray-700 sm:col-span-2">
            Pickup / delivery location
            <input
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={field}
            />
          </label>
          <label className="text-sm font-medium text-gray-700">
            Transport
            <select
              value={transport}
              onChange={(e) => setTransport(e.target.value)}
              className={field}
            >
              <option value="delivery">Delivery</option>
              <option value="pickup">Pickup</option>
            </select>
          </label>
          <label className="text-sm font-medium text-gray-700">
            Product
            <select
              required
              value={productId}
              onChange={(e) => {
                setProductId(e.target.value);
                setBundleIndex("0");
              }}
              className={field}
            >
              <option value="">Select product</option>
              {products.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.productName}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-gray-700">
            Bundle
            <select
              required
              value={bundleIndex}
              onChange={(e) => setBundleIndex(e.target.value)}
              disabled={!bundles.length}
              className={field}
            >
              {bundles.map((item, index) => (
                <option key={`${item.size}-${index}`} value={index}>
                  {item.size} · ₱{Number(item.price).toLocaleString("en-PH")} ·{" "}
                  {item.pieces} pcs
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-gray-700">
            Quantity
            <input
              required
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className={field}
            />
          </label>
        </div>
        <div className="mt-4 flex items-center justify-between rounded-xl bg-green-50 p-3">
          <span className="text-sm font-medium text-gray-600">Order total</span>
          <strong className="text-green-800">
            {total.toLocaleString("en-PH", {
              style: "currency",
              currency: "PHP",
            })}
          </strong>
        </div>
        <footer className="mt-5 flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:cursor-pointer hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !products.length}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-green-800 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50 hover:cursor-pointer hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300"
          >
            <IconPlus size={17} />
            {saving ? "Creating…" : "Create order"}
          </button>
        </footer>
      </form>
    </div>
  );
}
