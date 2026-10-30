import { useEffect, useMemo, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  Timestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { IconPlus, IconRefresh, IconSearch } from "@tabler/icons-react";
import { toast } from "sonner";
import AssetCard from "../../components/cards/AssetCard";
import AssetPurchaseDialog from "../../components/dialogs/AssetPurchaseDialog";
import AssetCardSkeleton from "../../components/skeletons/AssetCardSkeleton";
import { db } from "../../config/firebase";

const categories = ["Equipment", "Breeding equipment", "Supplies", "Other"];

function localDateString(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function firestoreDate(dateString) {
  return Timestamp.fromDate(new Date(`${dateString}T12:00:00`));
}

function toDate(value) {
  const date = value?.toDate ? value.toDate() : value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
}

function formatDate(value) {
  const date = toDate(value);
  return date
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

function emptyAssetForm() {
  return {
    name: "",
    category: "Equipment",
    quantity: "1",
    unitPrice: "",
    acquiredDate: localDateString(),
    description: "",
  };
}

function emptyPurchaseForm(asset) {
  return {
    quantity: "1",
    unitPrice: String(asset?.unitPrice ?? ""),
    purchaseDate: localDateString(),
    note: "",
  };
}

export default function AdminAssets() {
  const [assets, setAssets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [assetForm, setAssetForm] = useState(emptyAssetForm);
  const [purchaseAsset, setPurchaseAsset] = useState(null);
  const [purchaseForm, setPurchaseForm] = useState(() =>
    emptyPurchaseForm(null),
  );

  async function loadAssets() {
    setLoading(true);
    try {
      const [assetsSnapshot, expensesSnapshot] = await Promise.all([
        getDocs(collection(db, "assets")),
        getDocs(collection(db, "expenses")),
      ]);
      setAssets(
        assetsSnapshot.docs.map((assetDoc) => ({
          id: assetDoc.id,
          ...assetDoc.data(),
        })),
      );
      setExpenses(
        expensesSnapshot.docs.map((expenseDoc) => ({
          id: expenseDoc.id,
          ...expenseDoc.data(),
        })),
      );
    } catch (error) {
      console.error("Unable to load assets:", error);
      toast.error("Could not load assets. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAssets();
  }, []);

  const categoryOptions = useMemo(
    () =>
      [
        ...new Set([
          ...categories,
          ...assets.map((asset) => asset.category).filter(Boolean),
        ]),
      ].sort((a, b) => a.localeCompare(b)),
    [assets],
  );
  const categoryCounts = useMemo(
    () => ({
      all: assets.length,
      ...Object.fromEntries(
        categoryOptions.map((category) => [
          category,
          assets.filter((asset) => asset.category === category).length,
        ]),
      ),
    }),
    [assets, categoryOptions],
  );
  const visibleAssets = useMemo(
    () =>
      assets
        .filter((asset) => {
          const matchesCategory =
            categoryFilter === "all" || asset.category === categoryFilter;
          const text =
            `${asset.name || ""} ${asset.description || ""}`.toLowerCase();
          return matchesCategory && text.includes(search.trim().toLowerCase());
        })
        .sort(
          (a, b) =>
            (toDate(b.acquiredAt)?.getTime() || 0) -
            (toDate(a.acquiredAt)?.getTime() || 0),
        ),
    [assets, categoryFilter, search],
  );
  const totalAssetValue = assets.reduce(
    (sum, asset) => sum + Number(asset.totalValue || 0),
    0,
  );
  const assetPurchases = expenses
    .filter((expense) => expense.source === "assets" || expense.assetId)
    .sort(
      (a, b) =>
        (toDate(b.expenseDate)?.getTime() || 0) -
        (toDate(a.expenseDate)?.getTime() || 0),
    )
    .slice(0, 5);

  function resetAssetForm() {
    setAssetForm(emptyAssetForm());
    setEditingId("");
  }

  function openNewAsset() {
    resetAssetForm();
    setIsFormOpen(true);
  }

  function editAsset(asset) {
    setAssetForm({
      name: asset.name || "",
      category: asset.category || "Other",
      description: asset.description || "",
      quantity: String(asset.quantity ?? 0),
      unitPrice: String(asset.unitPrice ?? 0),
      acquiredDate: localDateString(toDate(asset.acquiredAt) || new Date()),
    });
    setEditingId(asset.id);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveAsset(event) {
    event.preventDefault();
    if (!assetForm.name.trim()) {
      toast.error("Enter an asset name.");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        const assetRef = doc(db, "assets", editingId);
        const updates = {
          name: assetForm.name.trim(),
          category: assetForm.category,
          description: assetForm.description.trim(),
          updatedAt: serverTimestamp(),
        };
        await updateDoc(assetRef, updates);
        setAssets((current) =>
          current.map((asset) =>
            asset.id === editingId ? { ...asset, ...updates } : asset,
          ),
        );
        toast.success("Asset details updated.");
      } else {
        const quantity = Number(assetForm.quantity);
        const unitPrice = Number(assetForm.unitPrice);
        if (
          !Number.isInteger(quantity) ||
          quantity < 1 ||
          !Number.isFinite(unitPrice) ||
          unitPrice < 0
        ) {
          toast.error("Enter a valid quantity and unit price.");
          return;
        }
        const totalValue = Math.round(quantity * unitPrice * 100) / 100;
        const acquiredAt = firestoreDate(assetForm.acquiredDate);
        const batch = writeBatch(db);
        const assetRef = doc(collection(db, "assets"));
        const expenseRef = doc(collection(db, "expenses"));
        batch.set(assetRef, {
          name: assetForm.name.trim(),
          category: assetForm.category,
          quantity,
          unitPrice,
          totalValue,
          acquiredAt,
          description: assetForm.description.trim(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        batch.set(expenseRef, {
          amount: totalValue,
          expenseDate: acquiredAt,
          category: "Asset purchase",
          source: "assets",
          assetId: assetRef.id,
          assetName: assetForm.name.trim(),
          quantity,
          unitPrice,
          description: `Initial purchase: ${assetForm.name.trim()}`,
          createdAt: serverTimestamp(),
        });
        await batch.commit();
        setAssets((current) => [
          {
            id: assetRef.id,
            name: assetForm.name.trim(),
            category: assetForm.category,
            quantity,
            unitPrice,
            totalValue,
            acquiredAt,
            description: assetForm.description.trim(),
          },
          ...current,
        ]);
        setExpenses((current) => [
          {
            id: expenseRef.id,
            amount: totalValue,
            expenseDate: acquiredAt,
            source: "assets",
            assetId: assetRef.id,
            assetName: assetForm.name.trim(),
            description: `Initial purchase: ${assetForm.name.trim()}`,
          },
          ...current,
        ]);
        toast.success("Asset added and purchase recorded as an expense.");
      }
      resetAssetForm();
      setIsFormOpen(false);
    } catch (error) {
      console.error("Unable to save asset:", error);
      toast.error("Could not save this asset. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function openPurchase(asset) {
    setPurchaseAsset(asset);
    setPurchaseForm(emptyPurchaseForm(asset));
  }

  async function buyMore(event) {
    event.preventDefault();
    if (!purchaseAsset) return;
    const quantity = Number(purchaseForm.quantity);
    const unitPrice = Number(purchaseForm.unitPrice);
    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      !Number.isFinite(unitPrice) ||
      unitPrice < 0
    ) {
      toast.error("Enter a valid quantity and unit price.");
      return;
    }
    setSaving(true);
    try {
      const amount = Math.round(quantity * unitPrice * 100) / 100;
      const purchaseDate = firestoreDate(purchaseForm.purchaseDate);
      const previousQuantity = Number(purchaseAsset.quantity || 0);
      const previousValue = Number(purchaseAsset.totalValue || 0);
      const nextQuantity = previousQuantity + quantity;
      const nextTotalValue = Math.round((previousValue + amount) * 100) / 100;
      const averageUnitPrice =
        nextQuantity > 0 ? nextTotalValue / nextQuantity : unitPrice;
      const batch = writeBatch(db);
      const assetRef = doc(db, "assets", purchaseAsset.id);
      const expenseRef = doc(collection(db, "expenses"));
      batch.update(assetRef, {
        quantity: nextQuantity,
        unitPrice: Math.round(averageUnitPrice * 100) / 100,
        totalValue: nextTotalValue,
        updatedAt: serverTimestamp(),
      });
      batch.set(expenseRef, {
        amount,
        expenseDate: purchaseDate,
        category: "Asset purchase",
        source: "assets",
        assetId: purchaseAsset.id,
        assetName: purchaseAsset.name,
        quantity,
        unitPrice,
        description:
          purchaseForm.note.trim() ||
          `Additional purchase: ${purchaseAsset.name}`,
        createdAt: serverTimestamp(),
      });
      await batch.commit();
      setAssets((current) =>
        current.map((asset) =>
          asset.id === purchaseAsset.id
            ? {
                ...asset,
                quantity: nextQuantity,
                unitPrice: Math.round(averageUnitPrice * 100) / 100,
                totalValue: nextTotalValue,
                updatedAt: new Date(),
              }
            : asset,
        ),
      );
      setExpenses((current) => [
        {
          id: expenseRef.id,
          amount,
          expenseDate: purchaseDate,
          source: "assets",
          assetId: purchaseAsset.id,
          assetName: purchaseAsset.name,
          description:
            purchaseForm.note.trim() ||
            `Additional purchase: ${purchaseAsset.name}`,
        },
        ...current,
      ]);
      toast.success("Purchase added to the asset and expense records.");
      setPurchaseAsset(null);
    } catch (error) {
      console.error("Unable to record asset purchase:", error);
      toast.error("Could not record this purchase. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteAsset(asset) {
    if (
      !window.confirm(
        `Remove ${asset.name} from your asset register? Its expense history will be kept.`,
      )
    )
      return;
    try {
      await deleteDoc(doc(db, "assets", asset.id));
      setAssets((current) => current.filter((item) => item.id !== asset.id));
      toast.success("Asset removed. Related expense history was kept.");
    } catch (error) {
      console.error("Unable to delete asset:", error);
      toast.error("Could not remove this asset. Please try again.");
    }
  }

  function updatePurchaseField(key, value) {
    setPurchaseForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <main className="page-container" aria-busy={loading}>
      <div className="flex w-full flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-green-800">Assets</h1>
          <p className="text-sm text-gray-600">
            Track equipment and purchases. Each acquisition is added to expenses
            for your revenue reports.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={loadAssets}
            disabled={loading}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-green-800 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 hover:cursor-pointer"
          >
            <IconRefresh size={17} /> Refresh
          </button>
          <button
            type="button"
            onClick={openNewAsset}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-green-800 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-green-900 hover:shadow-xl hover:cursor-pointer"
          >
            <IconPlus size={17} /> Add asset
          </button>
        </div>
      </div>

      <div className="mt-4 grid w-full gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Registered assets
          </p>
          <p className="mt-1 text-2xl font-black text-green-900">
            {loading ? "—" : assets.length}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Current asset value
          </p>
          <p className="mt-1 text-2xl font-black text-green-900">
            {loading ? "—" : peso(totalAssetValue)}
          </p>
        </div>
      </div>

      {isFormOpen && (
        <form
          onSubmit={saveAsset}
          className="mt-4 w-full rounded-2xl border border-gray-100 bg-white p-5 shadow-xl"
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="font-bold text-green-900">
                {editingId ? "Edit asset details" : "Add asset"}
              </h2>
              <p className="text-xs text-gray-500">
                {editingId
                  ? "Use Buy More to add quantities and record a new purchase expense."
                  : "The initial purchase will be recorded in expenses."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                resetAssetForm();
                setIsFormOpen(false);
              }}
              className="text-sm font-semibold text-gray-500 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-medium text-gray-700">
              Asset name
              <input
                required
                value={assetForm.name}
                onChange={(event) =>
                  setAssetForm({ ...assetForm, name: event.target.value })
                }
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-green-700"
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Category
              <select
                value={assetForm.category}
                onChange={(event) =>
                  setAssetForm({ ...assetForm, category: event.target.value })
                }
                className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-green-700"
              >
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            {!editingId && (
              <>
                <label className="text-sm font-medium text-gray-700">
                  Quantity
                  <input
                    required
                    type="number"
                    min="1"
                    step="1"
                    value={assetForm.quantity}
                    onChange={(event) =>
                      setAssetForm({
                        ...assetForm,
                        quantity: event.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-green-700"
                  />
                </label>
                <label className="text-sm font-medium text-gray-700">
                  Unit price (₱)
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={assetForm.unitPrice}
                    onChange={(event) =>
                      setAssetForm({
                        ...assetForm,
                        unitPrice: event.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-green-700"
                  />
                </label>
                <label className="text-sm font-medium text-gray-700">
                  Acquired date
                  <input
                    required
                    type="date"
                    value={assetForm.acquiredDate}
                    onChange={(event) =>
                      setAssetForm({
                        ...assetForm,
                        acquiredDate: event.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-green-700"
                  />
                </label>
                <div className="flex items-end text-sm font-semibold text-green-800">
                  Purchase value:{" "}
                  {peso(
                    (Number(assetForm.quantity) || 0) *
                      (Number(assetForm.unitPrice) || 0),
                  )}
                </div>
              </>
            )}
            <label className="text-sm font-medium text-gray-700 sm:col-span-2">
              Description
              <input
                value={assetForm.description}
                onChange={(event) =>
                  setAssetForm({
                    ...assetForm,
                    description: event.target.value,
                  })
                }
                placeholder="Purpose, supplier, or other notes"
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-green-700"
              />
            </label>
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
                : "Add asset and log expense"}
          </button>
        </form>
      )}

      <section className="mt-5 w-full">
        <div className="mb-3">
          <h2 className="text-lg font-bold text-green-900">Asset register</h2>
          <p className="text-xs text-gray-500">
            Showing {visibleAssets.length} of {assets.length} assets
          </p>
        </div>
        <div className="mb-4 flex w-full flex-col gap-3 rounded-2xl bg-white p-4 shadow-xl lg:flex-row lg:items-center lg:justify-between">
          <label className="flex min-w-56 flex-1 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2">
            <IconSearch size={18} className="text-gray-400" />
            <span className="sr-only">Search assets</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search asset name or description"
              className="w-full text-sm outline-none"
            />
          </label>
          <div
            role="group"
            aria-label="Filter assets by category"
            className="flex flex-wrap gap-2"
          >
            {[
              { id: "all", label: "All" },
              ...categoryOptions.map((category) => ({
                id: category,
                label: category,
              })),
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                aria-pressed={categoryFilter === tab.id}
                onClick={() => setCategoryFilter(tab.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${categoryFilter === tab.id ? "bg-green-800 text-white shadow-md" : "bg-white text-gray-600 hover:bg-green-50 hover:text-green-900"}`}
              >
                {tab.label} ({categoryCounts[tab.id] || 0})
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <div
            role="status"
            aria-label="Loading assets"
            className="grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            {[1, 2, 3].map((key) => (
              <AssetCardSkeleton key={key} />
            ))}
          </div>
        ) : visibleAssets.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-lg">
            <p className="font-semibold text-gray-700">
              {assets.length
                ? "No assets match these filters."
                : "No assets have been added yet."}
            </p>
            {!assets.length && (
              <button
                type="button"
                onClick={openNewAsset}
                className="mt-3 rounded-full bg-green-800 px-4 py-2 text-sm font-semibold text-white hover:bg-green-900"
              >
                Add your first asset
              </button>
            )}
          </div>
        ) : (
          <div className="grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibleAssets.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                onBuyMore={openPurchase}
                onEdit={editAsset}
                onDelete={deleteAsset}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mt-7 w-full rounded-2xl border border-gray-100 bg-white p-5 shadow-xl">
        <div className="mb-3">
          <h2 className="text-lg font-bold text-green-900">
            Recent asset purchases
          </h2>
          <p className="text-xs text-gray-500">
            These purchase entries also appear in Dashboard expenses.
          </p>
        </div>
        {loading ? (
          <div
            role="status"
            aria-label="Loading asset purchase history"
            className="animate-pulse space-y-3"
          >
            {[1, 2, 3].map((key) => (
              <div key={key} className="h-10 rounded-xl bg-gray-100" />
            ))}
          </div>
        ) : assetPurchases.length === 0 ? (
          <p className="text-sm text-gray-500">
            No asset purchases recorded yet.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {assetPurchases.map((expense) => (
              <li
                key={expense.id}
                className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {expense.assetName || "Asset purchase"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {expense.description || "Asset acquisition"} ·{" "}
                    {formatDate(expense.expenseDate)}
                  </p>
                </div>
                <span className="font-bold text-green-800">
                  {peso(expense.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
      <AssetPurchaseDialog
        asset={purchaseAsset}
        values={purchaseForm}
        onChange={updatePurchaseField}
        onClose={() => setPurchaseAsset(null)}
        onSubmit={buyMore}
        saving={saving}
      />
    </main>
  );
}
