import { useContext, useState } from "react";
import { IconArrowLeft, IconBrandMessengerFilled, IconShoppingBagCheck, IconX } from "@tabler/icons-react";
import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import CartItemCard from "../cards/CartItemCard";
import { CartContext } from "../../context/CartContext";
import { db } from "../../config/firebase";

const primaryButton = "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-green-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-800 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300";

export default function CartDialog({ isOpen, onClose }) {
  const { cart, addOrderIdToHistory, removeItemsFromCart } = useContext(CartContext);
  const [isCheckout, setIsCheckout] = useState(false);
  const [orderBy, setOrderBy] = useState("");
  const [orderLocation, setOrderLocation] = useState("");
  const [transport, setTransport] = useState("delivery");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalPrice = cart.reduce((total, item) => total + Number(item.price || 0) * Number(item.quantity || 0), 0);

  function closeDialog() {
    onClose();
    setIsCheckout(false);
  }

  async function placeOrder(event) {
    event.preventDefault();
    if (!cart.length || !orderBy.trim() || !orderLocation.trim()) return;
    setIsSubmitting(true);
    try {
      const items = cart.map(({ id, name, size, price, pieces, freebies, quantity }) => ({ id, name, size, price, pieces, freebies, quantity }));
      const orderRef = await addDoc(collection(db, "orders"), {
        items,
        totalPrice,
        orderBy: orderBy.trim(),
        orderLocation: orderLocation.trim(),
        orderModeTransport: transport,
        status: "awaiting_chat",
        statusHistory: [{ status: "awaiting_chat", at: new Date().toISOString(), note: "Order submitted" }],
        orderVia: "messenger",
        createdAt: serverTimestamp(),
      });
      addOrderIdToHistory(orderRef.id);
      removeItemsFromCart(cart.map((item) => item.cartItemId));

      const settingsSnapshot = await getDoc(doc(db, "settings", "store"));
      const savedMessengerLink = settingsSnapshot.exists() ? settingsSnapshot.data().messengerLink : "";
      const messengerUrl = new URL(savedMessengerLink || "https://m.me/valdez.jerson.5");
      messengerUrl.searchParams.set("ref", `natural_feeder_order_${orderRef.id}`);
      toast.success(`Order recorded: ${orderRef.id}. Open Messenger to continue.`, {
        action: { label: "Open Messenger", onClick: () => window.open(messengerUrl.toString(), "_blank", "noopener,noreferrer") },
      });
      setOrderBy("");
      setOrderLocation("");
      setTransport("delivery");
      closeDialog();
    } catch (error) {
      console.error("Unable to place order:", error);
      toast.error("Could not place your order. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className={`fixed inset-0 z-[60] flex h-screen w-full items-center justify-center bg-black/20 backdrop-blur-sm transition-all duration-200 lg:items-start lg:justify-end ${isOpen ? "visible opacity-100" : "invisible pointer-events-none opacity-0"}`}
      onClick={closeDialog}
      aria-hidden={!isOpen}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        onClick={(event) => event.stopPropagation()}
        className={`flex h-full max-h-[calc(100vh-5rem)] w-full flex-col rounded-3xl border border-white/50 bg-white p-5 shadow-2xl transition-transform duration-200 lg:absolute lg:right-0 lg:top-18 lg:h-[calc(100vh-5rem)] lg:w-[28rem] lg:rounded-r-none ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <header className="mb-4 flex items-center justify-between border-b border-gray-200 pb-4">
          <div className="flex items-center gap-2">
            {isCheckout && <button type="button" aria-label="Back to cart" onClick={() => setIsCheckout(false)} className="rounded-full p-2 text-green-800 hover:bg-green-50"><IconArrowLeft size={20} /></button>}
            <h2 id="cart-title" className="text-xl font-bold text-green-900">{isCheckout ? "Checkout" : "Your Cart"}</h2>
          </div>
          <button type="button" aria-label="Close cart" onClick={closeDialog} className="rounded-full p-2 text-green-800 transition-colors hover:bg-green-800 hover:text-white"><IconX size={22} /></button>
        </header>

        {!isCheckout ? (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto py-1">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <p className="text-sm font-medium text-gray-500">Your cart is currently empty.</p>
                  <button type="button" onClick={closeDialog} className="rounded-full border border-green-800 px-5 py-2 text-sm font-semibold text-green-800 hover:bg-green-50">Continue shopping</button>
                </div>
              ) : cart.map((item) => <CartItemCard key={item.cartItemId || item.id} item={item} />)}
            </div>
            <footer className="mt-3 border-t border-gray-200 pt-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wide text-gray-500">Total</span>
                <span className="text-xl font-black text-green-800">{totalPrice.toLocaleString("en-PH", { style: "currency", currency: "PHP" })}</span>
              </div>
              <button type="button" disabled={!cart.length} onClick={() => setIsCheckout(true)} className={`${primaryButton} w-full`}>
                <IconShoppingBagCheck size={19} /> Checkout
              </button>
            </footer>
          </>
        ) : (
          <form onSubmit={placeOrder} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto">
              <div className="rounded-2xl bg-green-50 p-4">
                <div className="mb-2 flex items-center justify-between text-sm font-semibold text-green-900"><span>{cart.length} item{cart.length === 1 ? "" : "s"}</span><span>{totalPrice.toLocaleString("en-PH", { style: "currency", currency: "PHP" })}</span></div>
                <ul className="space-y-1 text-xs text-gray-600">{cart.map((item) => <li key={item.cartItemId || item.id}>{item.quantity} × {item.name} ({item.size})</li>)}</ul>
              </div>
              <label className="block text-sm font-semibold text-gray-700">Your name
                <input required autoComplete="name" value={orderBy} onChange={(event) => setOrderBy(event.target.value)} placeholder="Enter your name" className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20" />
              </label>
              <label className="block text-sm font-semibold text-gray-700">Delivery or pickup location
                <input required autoComplete="street-address" value={orderLocation} onChange={(event) => setOrderLocation(event.target.value)} placeholder="Enter your location" className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20" />
              </label>
              <fieldset>
                <legend className="mb-2 text-sm font-semibold text-gray-700">Mode of transport</legend>
                <div className="grid grid-cols-2 gap-2">{["pickup", "delivery"].map((mode) => <label key={mode} className={`cursor-pointer rounded-xl border px-3 py-3 text-center text-sm font-semibold capitalize ${transport === mode ? "border-green-800 bg-green-50 text-green-900" : "border-gray-200 text-gray-600"}`}><input type="radio" name="transport" value={mode} checked={transport === mode} onChange={() => setTransport(mode)} className="sr-only" />{mode}</label>)}</div>
              </fieldset>
              <p className="text-xs text-gray-500">Your order is saved for approval first. You can open Messenger afterward to contact the store.</p>
            </div>
            <footer className="mt-4 border-t border-gray-200 pt-4">
              <div className="mb-3 flex items-center justify-between"><span className="font-semibold text-gray-600">Total due</span><span className="text-lg font-black text-green-800">{totalPrice.toLocaleString("en-PH", { style: "currency", currency: "PHP" })}</span></div>
              <button type="submit" disabled={isSubmitting || !cart.length} className={`${primaryButton} w-full`}>
                <IconBrandMessengerFilled size={19} /> {isSubmitting ? "Placing order…" : "Place order"}
              </button>
            </footer>
          </form>
        )}
      </section>
    </div>
  );
}
