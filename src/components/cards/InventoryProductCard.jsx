import { IconEdit, IconPhoto, IconTrash } from "@tabler/icons-react";
import Status from "../status/Status";
import superwormImage from "../../assets/catalogs/superworm.jpg";

function stockStatus(product) {
  const hasTrackedStock =
    product.stock !== null &&
    product.stock !== undefined &&
    product.stock !== "";
  if (!hasTrackedStock)
    return { description: "Stock not tracked", color: "blue" };
  if (Number(product.stock) === 0)
    return { description: "Out of stock", color: "red" };
  return { description: `${product.stock} in stock`, color: "green" };
}

export default function InventoryProductCard({ product, onEdit, onDelete }) {
  const status = stockStatus(product);
  const image = product.productImage === "superworm" ? superwormImage : null;

  return (
    <article className="flex h-full min-h-80 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
      <div className="relative h-40 w-full overflow-hidden bg-green-50">
        {image ? (
          <img
            src={image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-green-800/40">
            <IconPhoto size={42} stroke={1.5} />
          </div>
        )}
        <div className="absolute right-3 top-3">
          <Status description={status.description} color={status.color} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div>
          <h3 className="text-base font-bold text-green-900">
            {product.productName}
          </h3>
          <p className="mt-1 line-clamp-2 min-h-10 text-sm text-gray-600">
            {product.productDescription}
          </p>
          {product.productFreebies && (
            <p className="mt-2 w-fit rounded-md bg-green-50 px-2 py-1 text-xs font-semibold text-green-800">
              Freebies: {product.productFreebies}
            </p>
          )}
        </div>

        <div className="mt-4 flex-1">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Bundles
          </p>
          <div className="flex flex-wrap gap-2">
            {(product.productBundleInfo || []).map((bundle, index) => (
              <span
                key={`${bundle.size}-${index}`}
                className="rounded-lg bg-green-50 px-2.5 py-1.5 text-xs font-semibold text-green-900"
              >
                {bundle.size} · ₱{Number(bundle.price).toLocaleString("en-PH")}{" "}
                / {bundle.pieces} pcs
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-gray-200 pt-3">
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-800 hover:cursor-pointer"
          >
            <IconEdit size={17} /> Edit
          </button>
          <button
            type="button"
            aria-label={`Delete ${product.productName}`}
            title="Delete product"
            onClick={() => onDelete(product)}
            className="ml-auto rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 hover:cursor-pointer"
          >
            <IconTrash size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
