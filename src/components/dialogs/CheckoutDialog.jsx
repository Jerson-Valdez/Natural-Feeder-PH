import { IconX, IconBrandMessengerFilled } from "@tabler/icons-react";

//components
import PrimaryButton from "../buttons/PrimaryButton";
import InputField from "../../components/input/InputField";

//hooks
import { useState } from "react";
import RadioField from "../input/RadioField";

//context
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";

//toast
import { toast } from "sonner";

//db
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebase";

export default function CheckoutDialog({ items, isOpen, onClose, from }) {
  const { addOrderIdToHistory, removeItemsFromCart } = useContext(CartContext);
  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  //inputs
  const [orderBy, setOrderBy] = useState("");
  const [orderLocation, setOrderLocation] = useState("");
  const [orderModeTransport, setOrderModeTransport] = useState("delivery"); //default value

  //error messages
  const [orderByErrorMessage, setOrderByErrorMessage] = useState("");
  const [orderLocationErrorMessage, setOrderLocationErrorMessage] =
    useState("");

  //handlers
  const handleOrderByChange = (e) => {
    if (e.target.value.trim() !== "") {
      setOrderBy(e.target.value);
      setOrderByErrorMessage("");
    } else {
      setOrderBy("");
      setOrderByErrorMessage("Name is required to place an order.");
    }
  };

  const handleOrderLocationChange = (e) => {
    if (e.target.value.trim() !== "") {
      setOrderLocation(e.target.value);
      setOrderLocationErrorMessage("");
    } else {
      setOrderLocation("");
      setOrderLocationErrorMessage("Location is required to place an order.");
    }
  };

  //checkout handler
  const handleCheckout = async () => {
    try {
      const toastId = toast.loading("Processing your order...");

      const newOrder = {
        items: items,
        totalPrice: totalPrice,
        orderBy: orderBy,
        orderLocation: orderLocation,
        orderModeTransport: orderModeTransport,
        status: "awaiting messenger chat",
        orderVia: "messenger",
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "orders"), newOrder);
      const realFirebaseId = docRef.id;

      addOrderIdToHistory(realFirebaseId);

      if (from === "cart") {
        removeItemsFromCart(items.map((item) => item.cartItemId));
      }

      toast.success("Order recorded successfully!", { id: toastId });
      onClose();

      const message = `Hello Natural Feeder PH! I placed an order.\n\nOrder ID: ${realFirebaseId}\nName: ${orderBy}\nTotal: ₱${totalPrice}\nTransport: ${orderModeTransport}`;

      const messengerUrl = `https://m.me/valdez.jerson.5`;
      try {
        await navigator.clipboard.writeText(message);

        toast.info(
          "Order details copied to clipboard! Please PASTE it in the chat.",
          {
            duration: 6000,
          },
        );

        window.open(messengerUrl, "_blank");
      } catch (err) {
        toast.error(
          "Could not copy automatically. Please screenshot your Order ID!",
        );
        window.open(messengerUrl, "_blank");
      }

      window.open(messengerUrl, "_blank");
    } catch (error) {
      toast.error("Failed to place order. Please check your connection.");
      console.error(error);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center bg-transparent h-screen w-full backdrop-blur-md transition-all duration-300 lg:backdrop-blur-none *:
      ${
        isOpen
          ? "opacity-100 visible"
          : "opacity-0 invisible pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative flex flex-col justify-start w-full h-screen max-h-[calc(100vh-6rem)] p-5 shadow-2xl transition-all duration-300 
                   bg-white/80 backdrop-blur-md border border-white/50 rounded-4xl
                   lg:absolute lg:top-18 lg:h-screen lg:w-[400px] lg:bg-white lg:border-green-800
                   ${isOpen ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="flex flex-row items-center justify-between border-b border-gray-300/50 pb-4 mb-4">
          <h2 className="text-xl font-bold text-green-900">Checkout</h2>
          <button
            onClick={onClose}
            className="text-green-800 hover:text-white transition-colors font-bold rounded-full p-2 hover:bg-green-800 cursor-pointer active:scale-95"
          >
            <IconX size={24} />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-start text-center gap-3 pt-2 overflow-y-auto">
          <h3 className="w-full text-start text-sm font-semibold text-gray-400">
            Order Summary
          </h3>
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-row w-full items-center justify-between"
            >
              <p className="text-sm">
                {item.quantity} ● {item.name}({item.size})
              </p>
              <p className="text-sm font-black text-green-800">
                {((item.price * item.quantity)).toLocaleString("en-PH", { style: "currency", currency: "PHP" })}
              </p>
            </div>
          ))}
          <div className="flex flex-row w-full items-center justify-between border-t border-gray-300/50 pt-2 mt-2">
            <p className="w-full text-start text-lg font-black text-green-800">
              Total:
            </p>
            <span className="w-full text-end text-lg font-black text-green-800">
              {totalPrice.toLocaleString("en-PH", { style: "currency", currency: "PHP" })}
            </span>
          </div>
          <InputField
            label="Order By *"
            placeholder="Enter your name"
            type="text"
            value={orderBy}
            onChange={handleOrderByChange}
            errorMessage={orderByErrorMessage}
          />
          <InputField
            label="Order Location *"
            placeholder="Enter your location"
            type="text"
            value={orderLocation}
            onChange={handleOrderLocationChange}
            errorMessage={orderLocationErrorMessage}
          />
          <RadioField
            label="Mode of Transport"
            radios={[
              { label: "Pickup", value: "pickup" },
              { label: "Delivery", value: "delivery" },
            ]}
            selectedValue={orderModeTransport}
            setSelectedValue={(value) => setOrderModeTransport(value)}
          />
          <p className="text-xs text-gray-500">
            Complete your order by sending the details via messenger and wait
            for confirmation.
          </p>
          {orderBy && orderLocation ? (
            <PrimaryButton
              icon={<IconBrandMessengerFilled size={20} />}
              text="Place Order via Messenger"
              action={handleCheckout}
            />
          ) : (
            <PrimaryButton
              icon={<IconBrandMessengerFilled size={20} />}
              text="Place Order via Messenger"
              isDisabled={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}
