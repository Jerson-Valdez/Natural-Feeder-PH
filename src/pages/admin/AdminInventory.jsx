import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  IconPlus,
  IconRefresh,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { db } from "../../config/firebase";
import InventoryProductCard from "../../components/cards/InventoryProductCard";
import InventoryProductCardSkeleton from "../../components/skeletons/InventoryProductCardSkeleton";

const emptyProduct = () => ({
  productName: "",
  productDescription: "",
  productImage: "superworm",
  productFreebies: "",
  productBundleInfo: [{ size: "", price: "", pieces: "" }],
  stock: "",
});

export default function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadProducts() {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "products"));
      setProducts(
        snapshot.docs.map((productDoc) => ({
          id: productDoc.id,
          ...productDoc.data(),
        })),
      );
    } catch (error) {
      console.error("Unable to load inventory:", error);
      toast.error("Could not load inventory. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function resetForm() {
    setForm(emptyProduct());
    setEditingId("");
  }

  function startEdit(product) {
    setEditingId(product.id);
    setIsFormOpen(true);
    setForm({
      productName: product.productName || "",
      productDescription: product.productDescription || "",
      productImage: product.productImage || "superworm",
      productFreebies: product.productFreebies ?? "",
      productBundleInfo: (product.productBundleInfo || []).length
        ? product.productBundleInfo.map((bundle) => ({
            size: bundle.size ?? "",
            price: bundle.price ?? "",
            pieces: bundle.pieces ?? "",
          }))
        : [{ size: "", price: "", pieces: "" }],
      stock: product.stock ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const stockCounts = useMemo(
    () => ({
      all: products.length,
      tracked: products.filter(
        (product) =>
          product.stock !== null &&
          product.stock !== undefined &&
          product.stock !== "",
      ).length,
      untracked: products.filter(
        (product) =>
          product.stock === null ||
          product.stock === undefined ||
          product.stock === "",
      ).length,
    }),
    [products],
  );

  const visibleProducts = useMemo(
    () =>
      products
        .filter((product) => {
          const hasStockTracking =
            product.stock !== null &&
            product.stock !== undefined &&
            product.stock !== "";
          const matchesTracking =
            stockFilter === "all" ||
            (stockFilter === "tracked" ? hasStockTracking : !hasStockTracking);
          const searchableText =
            `${product.productName || ""} ${product.productDescription || ""}`.toLowerCase();
          return (
            matchesTracking &&
            searchableText.includes(search.trim().toLowerCase())
          );
        })
        .sort((a, b) =>
          (a.productName || "").localeCompare(b.productName || ""),
        ),
    [products, search, stockFilter],
  );

  function updateBundle(index, key, value) {
    setForm((current) => ({
      ...current,
      productBundleInfo: current.productBundleInfo.map((bundle, bundleIndex) =>
        bundleIndex === index ? { ...bundle, [key]: value } : bundle,
      ),
    }));
  }

  async function saveProduct(event) {
    event.preventDefault();
    const bundles = form.productBundleInfo.map((bundle) => ({
      size: bundle.size.trim(),
      price: Number(bundle.price),
      pieces: Number(bundle.pieces),
    }));
    if (
      !form.productName.trim() ||
      !form.productDescription.trim() ||
      bundles.some(
        (bundle) =>
          !bundle.size ||
          !Number.isFinite(bundle.price) ||
          bundle.price < 0 ||
          !Number.isFinite(bundle.pieces) ||
          bundle.pieces <= 0,
      )
    ) {
      toast.error(
        "Enter product details and valid size, price, and piece count for each bundle.",
      );
      return;
    }
    const payload = {
      productName: form.productName.trim(),
      productDescription: form.productDescription.trim(),
      productImage: form.productImage.trim() || "superworm",
      productFreebies: form.productFreebies.trim(),
      productBundleInfo: bundles,
      stock: form.stock === "" ? null : Math.max(0, Number(form.stock)),
      updatedAt: serverTimestamp(),
    };
    setSaving(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, "products", editingId), payload);
        setProducts((current) =>
          current.map((product) =>
            product.id === editingId
              ? { ...product, ...payload, updatedAt: new Date() }
              : product,
          ),
        );
        toast.success("Product updated.");
      } else {
        const created = await addDoc(collection(db, "products"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        setProducts((current) => [
          ...current,
          { id: created.id, ...payload, createdAt: new Date() },
        ]);
        toast.success("Product added to inventory.");
      }
      resetForm();
      setIsFormOpen(false);
    } catch (error) {
      console.error("Unable to save product:", error);
      toast.error("Could not save this product. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function removeProduct(product) {
    if (
      !window.confirm(
        `Delete ${product.productName || "this product"} from inventory?`,
      )
    )
      return;
    try {
      await deleteDoc(doc(db, "products", product.id));
      setProducts((current) =>
        current.filter((item) => item.id !== product.id),
      );
      if (editingId === product.id) resetForm();
      toast.success("Product deleted.");
    } catch (error) {
      console.error("Unable to delete product:", error);
      toast.error("Could not delete this product. Please try again.");
    }
  }

  return (
    <main className="page-container" aria-busy={loading}>
      <div className="flex w-full flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-green-800">Inventory</h1>
          <p className="text-sm text-gray-600">
            Manage products, bundle pricing, and stock information.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={loadProducts}
            disabled={loading}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-green-800 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 hover:cursor-pointer"
          >
            <IconRefresh size={17} /> Refresh
          </button>
          <button
            type="button"
            onClick={() => {
              setIsFormOpen((open) => !open);
              if (isFormOpen && editingId) resetForm();
            }}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-green-800 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-green-900 hover:shadow-xl hover:cursor-pointer"
          >
            <IconPlus size={17} className={`${isFormOpen && "rotate-45"}`} />{" "}
            {isFormOpen ? "Close form" : "Add product"}
          </button>
        </div>
      </div>
      {isFormOpen && (
        <form
          onSubmit={saveProduct}
          className="mt-4 w-full rounded-2xl border border-gray-100 bg-white p-5 shadow-xl"
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="font-bold text-green-900">
              {editingId ? "Edit product" : "Add product"}
            </h2>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setIsFormOpen(false);
              }}
              className="text-sm font-semibold text-gray-500 hover:text-gray-800 hover:cursor-pointer"
            >
              Cancel
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-medium text-gray-700">
              Product name
              <input
                required
                value={form.productName}
                onChange={(event) =>
                  setForm({ ...form, productName: event.target.value })
                }
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-green-700"
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Image key
              <input
                value={form.productImage}
                onChange={(event) =>
                  setForm({ ...form, productImage: event.target.value })
                }
                placeholder="superworm"
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-green-700"
              />
              <span className="text-xs font-normal text-gray-500">
                Use a key available in the storefront image map, such as
                “superworm”.
              </span>
            </label>
            <label className="text-sm font-medium text-gray-700 sm:col-span-2">
              Description
              <textarea
                required
                rows={2}
                value={form.productDescription}
                onChange={(event) =>
                  setForm({ ...form, productDescription: event.target.value })
                }
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-green-700"
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Freebies description
              <input
                value={form.productFreebies}
                onChange={(event) =>
                  setForm({ ...form, productFreebies: event.target.value })
                }
                placeholder="e.g. 100 pcs"
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-green-700"
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Stock (optional)
              <input
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={(event) =>
                  setForm({ ...form, stock: event.target.value })
                }
                placeholder="Leave blank if not tracked"
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-green-700"
              />
            </label>
          </div>
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-700">Bundles</h3>
              <button
                type="button"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    productBundleInfo: [
                      ...current.productBundleInfo,
                      { size: "", price: "", pieces: "" },
                    ],
                  }))
                }
                className="inline-flex items-center gap-1 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-800"
              >
                <IconPlus size={16} /> Add bundle
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {form.productBundleInfo.map((bundle, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 gap-2 rounded-xl bg-gray-50 p-3 sm:grid-cols-[1fr_1fr_1fr_auto]"
                >
                  <label className="text-xs font-medium text-gray-600">
                    Size
                    <input
                      required
                      value={bundle.size}
                      onChange={(event) =>
                        updateBundle(index, "size", event.target.value)
                      }
                      placeholder="e.g. Small"
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="text-xs font-medium text-gray-600">
                    Price (₱)
                    <input
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      value={bundle.price}
                      onChange={(event) =>
                        updateBundle(index, "price", event.target.value)
                      }
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="text-xs font-medium text-gray-600">
                    Pieces
                    <input
                      required
                      type="number"
                      min="1"
                      step="1"
                      value={bundle.pieces}
                      onChange={(event) =>
                        updateBundle(index, "pieces", event.target.value)
                      }
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                    />
                  </label>
                  <button
                    type="button"
                    aria-label="Remove bundle"
                    disabled={form.productBundleInfo.length === 1}
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        productBundleInfo: current.productBundleInfo.filter(
                          (_, bundleIndex) => bundleIndex !== index,
                        ),
                      }))
                    }
                    className="self-end rounded-lg p-2 text-red-700 hover:bg-red-50 disabled:opacity-30"
                  >
                    <IconTrash size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-900 disabled:opacity-60"
          >
            <IconPlus size={18} />{" "}
            {saving
              ? "Saving…"
              : editingId
                ? "Save changes"
                : "Add to inventory"}
          </button>
        </form>
      )}
      <section className="mt-5 w-full">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-green-900">Products</h2>
            <p className="text-xs text-gray-500">
              {visibleProducts.length} of {products.length} products
            </p>
          </div>
        </div>
        <div className="mb-4 flex w-full flex-col gap-3 rounded-2xl bg-white p-4 shadow-xl sm:flex-row sm:items-center sm:justify-between">
          <label className="flex min-w-56 flex-1 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2">
            <IconSearch size={18} className="text-gray-400" />
            <span className="sr-only">Search inventory</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search product name or description"
              className="w-full text-sm outline-none"
            />
          </label>
          <div
            role="group"
            aria-label="Filter products by stock tracking"
            className="flex flex-wrap gap-2"
          >
            {[
              { id: "all", label: "All products" },
              { id: "tracked", label: "Stock tracked" },
              { id: "untracked", label: "Not tracked" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                aria-pressed={stockFilter === tab.id}
                onClick={() => setStockFilter(tab.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:cursor-pointer ${stockFilter === tab.id ? "bg-green-800 text-white shadow-md" : "bg-white text-gray-600 hover:bg-green-50 hover:text-green-900"}`}
              >
                {tab.label} ({stockCounts[tab.id]})
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <div
            role="status"
            aria-label="Loading inventory"
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {[1, 2, 3].map((key) => (
              <InventoryProductCardSkeleton key={key} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="w-full text-center text-sm text-gray-500">
            No products yet. Add one above.
          </p>
        ) : visibleProducts.length === 0 ? (
          <p className="w-full text-center text-sm text-gray-500">
            No products match these filters.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {visibleProducts.map((product) => (
              <InventoryProductCard
                key={product.id}
                product={product}
                onEdit={startEdit}
                onDelete={removeProduct}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
