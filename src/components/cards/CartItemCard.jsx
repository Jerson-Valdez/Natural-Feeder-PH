import { IconMinus, IconPlus, IconTrash } from "@tabler/icons-react";
import { useContext } from "react";
import { toast } from "sonner";
import { CartContext } from "../../context/CartContext";
import Superworm from "../../assets/catalogs/superworm.jpg";

export default function CartItemCard({ item }) {
  const { removeFromCart, reduceCartItemQuantity, increaseCartItemQuantity } = useContext(CartContext);
  const image = item.image || (item.name?.toLowerCase().includes("superworm") ? Superworm : null);
  const cost = Number(item.price || 0) * Number(item.quantity || 0);

  return (
    <article className="flex w-full items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
      {image ? <img src={image} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" /> : <div aria-hidden="true" className="h-16 w-16 shrink-0 rounded-xl bg-green-50" />}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-bold text-green-900">{item.name}</h3>
        <p className="text-xs text-gray-500">{item.size} · {item.pieces} pcs{Number(item.freebies) > 0 ? ` + ${item.freebies} freebies` : ""}</p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="inline-flex h-8 items-center overflow-hidden rounded-lg border border-gray-200">
            <button type="button" aria-label={`Decrease quantity of ${item.name}`} onClick={() => reduceCartItemQuantity(item.cartItemId)} className="h-full px-2 text-gray-600 hover:bg-gray-100"><IconMinus size={14} /></button>
            <span className="min-w-7 text-center text-sm font-semibold text-gray-800">{item.quantity}</span>
            <button type="button" aria-label={`Increase quantity of ${item.name}`} onClick={() => increaseCartItemQuantity(item.cartItemId)} className="h-full px-2 text-gray-600 hover:bg-gray-100"><IconPlus size={14} /></button>
          </div>
          <span className="text-sm font-bold text-green-800">{cost.toLocaleString("en-PH", { style: "currency", currency: "PHP" })}</span>
        </div>
      </div>
      <button type="button" aria-label={`Remove ${item.name} from cart`} onClick={() => { removeFromCart(item.cartItemId); toast.success("Item removed from cart."); }} className="rounded-full p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"><IconTrash size={18} /></button>
    </article>
  );
}
