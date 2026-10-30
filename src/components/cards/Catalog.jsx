import { useContext, useState } from "react";
import { IconShoppingBag } from "@tabler/icons-react";
import { toast } from "sonner";
import { CartContext } from "../../context/CartContext";

const outlineButton = "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-amber-900 px-4 py-2 text-sm font-semibold text-amber-900 transition-colors hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400";

function getFreebiesInfo(value) {
  const text = String(value ?? "").trim();
  const normalized = text.replaceAll(",", "");
  const quantity = Number.parseFloat(normalized);
  if (!text || (Number.isFinite(quantity) && quantity <= 0) || /^(?:none|no(?:\s+freebies)?|n\/a|not applicable)$/i.test(text)) {
    return { label: "", quantity: 0 };
  }
  const label = Number.isFinite(Number(normalized))
    ? `${text} per 1000 pcs`
    : text;
  return { label, quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 0 };
}

export default function Catalog({ productImage, productName, productDescription, productBundleInfo = [], productFreebies }) {
  const { addToCart } = useContext(CartContext);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const totalPrice = selectedBundle ? Number(selectedBundle.price) * quantity : 0;
  const freebiesInfo = getFreebiesInfo(productFreebies);

  function addSelectedBundle() {
    if (!selectedBundle) return;
    const quantityToAdd = quantity;
    addToCart({
      id: `${productName}-${selectedBundle.size}`,
      name: productName,
      image: productImage,
      size: selectedBundle.size,
      price: Number(selectedBundle.price),
      pieces: Number(selectedBundle.pieces),
      freebies: freebiesInfo.quantity,
      quantity: quantityToAdd,
    });
    toast.success(`${quantityToAdd} × ${productName} (${selectedBundle.size}) added to cart.`);
    setQuantity(1);
    setSelectedBundle(null);
  }

  return (
    <article className="flex w-full max-w-sm flex-col items-center justify-start overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow hover:shadow-xl">
      <img className="h-62 w-full object-cover" src={productImage} alt={productName} loading="lazy" />
      <div className="flex w-full flex-col gap-2 px-5 py-4">
        <div>
          <h2 className="text-xl font-bold text-green-900">{productName}</h2>
          <p className="mt-1 text-sm leading-snug text-gray-600">{productDescription}</p>
          {freebiesInfo.label && <span className="mt-2 inline-block rounded-md bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">Freebies: {freebiesInfo.label}</span>}
        </div>
        <fieldset className="mt-2 flex gap-2">
          <legend className="sr-only">Choose a {productName} bundle</legend>
          {productBundleInfo.map((bundle) => {
            const isSelected = selectedBundle?.size === bundle.size;
            return <label key={bundle.size} className={`flex flex-1 cursor-pointer items-center justify-between rounded-xl border p-2 transition-colors ${isSelected ? "border-green-800 bg-green-50 ring-1 ring-green-800" : "border-gray-200 hover:border-green-800/50 hover:bg-gray-50"}`}>
              <input type="radio" name={`${productName}-bundle`} value={bundle.size} checked={isSelected} onChange={() => setSelectedBundle(bundle)} className="sr-only" />
              <span className="flex flex-col"><span className="text-xs font-bold text-green-900">{bundle.size}</span><span className="text-xs font-black text-green-800">₱{Number(bundle.price).toLocaleString("en-PH")} <span className="font-normal text-gray-500">/{bundle.pieces} pcs</span></span></span>
            </label>;
          })}
        </fieldset>
      </div>
      <div className="flex w-full flex-col gap-3 border-t border-gray-100 bg-gray-50 px-5 py-4">
        <div className="flex items-center justify-between"><span className="text-xs font-bold uppercase text-gray-500">Total</span><span className="text-xl font-black text-green-800">{totalPrice.toLocaleString("en-PH", { style: "currency", currency: "PHP" })}</span></div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 items-center overflow-hidden rounded-lg border border-gray-300 bg-white">
            <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="h-full w-10 font-bold text-gray-600 hover:bg-gray-100">−</button>
            <input aria-label="Quantity" type="number" min="1" step="1" value={quantity} onChange={(event) => setQuantity(Math.max(1, Number.parseInt(event.target.value, 10) || 1))} className="w-12 text-center font-bold text-gray-800 outline-none" />
            <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((value) => value + 1)} className="h-full w-10 font-bold text-gray-600 hover:bg-gray-100">+</button>
          </div>
          <button type="button" onClick={addSelectedBundle} disabled={!selectedBundle} className={`${outlineButton} flex-1`}><IconShoppingBag size={18} /> Add to cart</button>
        </div>
      </div>
    </article>
  );
}
