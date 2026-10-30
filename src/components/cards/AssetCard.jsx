import { IconEdit, IconPackageImport, IconTrash } from "@tabler/icons-react";
import Status from "../status/Status";

function formatDate(value) {
  const date = value?.toDate ? value.toDate() : value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime())
    ? date.toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";
}

function peso(value) {
  return Number(value || 0).toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP",
  });
}

export default function AssetCard({ asset, onBuyMore, onEdit, onDelete }) {
  return (
    <article className="flex min-h-72 flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-lg transition-shadow hover:shadow-xl">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-base font-bold text-gray-900">{asset.name}</h2>
        <Status description={asset.category || "Other"} color="blue" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <div>
          <p className="text-gray-500">Quantity</p>
          <p className="font-semibold text-gray-900">
            {Number(asset.quantity || 0).toLocaleString("en-PH")}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Unit Price</p>
          <p className="font-semibold text-gray-900">{peso(asset.unitPrice)}</p>
        </div>
        <div>
          <p className="text-gray-500">Total Value</p>
          <p className="font-bold text-green-700">{peso(asset.totalValue)}</p>
        </div>
        <div>
          <p className="text-gray-500">Acquired</p>
          <p className="font-semibold text-gray-900">
            {formatDate(asset.acquiredAt)}
          </p>
        </div>
      </div>
      <p className="mt-4 min-h-10 flex-1 text-sm text-gray-500">
        {asset.description || "No description"}
      </p>
      <div className="mt-3 flex items-center gap-2 border-t border-gray-200 pt-3">
        <button
          type="button"
          onClick={() => onBuyMore(asset)}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 hover:cursor-pointer"
        >
          <IconPackageImport size={17} /> Buy More
        </button>
        <button
          type="button"
          onClick={() => onEdit(asset)}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-200 hover:cursor-pointer"
        >
          <IconEdit size={17} /> Edit
        </button>
        <button
          type="button"
          aria-label={`Delete ${asset.name}`}
          title="Delete asset"
          onClick={() => onDelete(asset)}
          className="ml-auto rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-700 hover:cursor-pointer"
        >
          <IconTrash size={18} />
        </button>
      </div>
    </article>
  );
}
