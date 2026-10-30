import { IconPackageImport, IconX } from "@tabler/icons-react";

export default function AssetPurchaseDialog({ asset, values, onChange, onClose, onSubmit, saving }) {
  if (!asset) return null;
  const purchaseTotal = (Number(values.quantity) || 0) * (Number(values.unitPrice) || 0);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <form role="dialog" aria-modal="true" aria-labelledby="asset-purchase-title" onSubmit={onSubmit} className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div><h2 id="asset-purchase-title" className="text-lg font-bold text-green-900">Buy more</h2><p className="text-sm text-gray-500">{asset.name}</p></div>
          <button type="button" aria-label="Close purchase form" onClick={onClose} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><IconX size={20} /></button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-medium text-gray-700">Quantity<input required type="number" min="1" step="1" value={values.quantity} onChange={(event) => onChange("quantity", event.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20" /></label>
          <label className="text-sm font-medium text-gray-700">Unit price (₱)<input required type="number" min="0" step="0.01" value={values.unitPrice} onChange={(event) => onChange("unitPrice", event.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20" /></label>
          <label className="text-sm font-medium text-gray-700 sm:col-span-2">Purchase date<input required type="date" value={values.purchaseDate} onChange={(event) => onChange("purchaseDate", event.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20" /></label>
          <label className="text-sm font-medium text-gray-700 sm:col-span-2">Note (optional)<textarea rows={2} value={values.note} onChange={(event) => onChange("note", event.target.value)} placeholder="Receipt, supplier, or purchase note" className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20" /></label>
        </div>
        <div className="mt-4 flex items-center justify-between rounded-xl bg-green-50 p-3"><span className="text-sm font-medium text-gray-600">This purchase will be logged as an expense.</span><strong className="text-green-800">{purchaseTotal.toLocaleString("en-PH", { style: "currency", currency: "PHP" })}</strong></div>
        <div className="mt-4 flex justify-end gap-2"><button type="button" onClick={onClose} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button><button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-green-800 px-4 py-2 text-sm font-semibold text-white hover:bg-green-900 disabled:opacity-50"><IconPackageImport size={17} /> {saving ? "Saving…" : "Record purchase"}</button></div>
      </form>
    </div>
  );
}
