import { IconX, IconShoppingBagCheck } from "@tabler/icons-react";
import CartItemCard from "../cards/CartItemCard";
import PrimaryButton from "../buttons/PrimaryButton";
import { useState } from "react";

export default function CartDialog({ isOpen, onClose, data, removeFromCart }) {

  const [selectedItems, setSelectedItems] = useState([]);

  const toggleSelect = (id) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((itemId) => itemId !== id);
      }
      return [...prevSelected, id];
    });
  };

  const totalPrice = data
    .filter((item) => selectedItems.includes(item.id))
    .reduce((total, item) => total + item.price, 0);

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center lg:items-start lg:justify-end bg-transparent h-screen w-full backdrop-blur-lg transition-all duration-300 lg:backdrop-blur-none *:
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
                   lg:absolute lg:right-0 lg:top-18 lg:h-screen lg:w-[400px] lg:rounded-r-none lg:bg-white lg:border-green-800
                   ${isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-full"}`}
      >
        <div className="flex flex-row items-center justify-between border-b border-gray-300/50 pb-4 mb-4">
          <h2 className="text-xl font-bold text-green-900">Your Cart</h2>
          <button
            onClick={onClose}
            className="text-green-800 hover:text-white transition-colors font-bold rounded-full p-2 hover:bg-green-800 cursor-pointer active:scale-95"
          >
            <IconX size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col items-center justify-start text-center gap-3 pt-2">
          {data.length === 0 ? (
            <p className="text-gray-500 text-sm font-medium pt-10">
              Your cart is currently empty.
            </p>
          ) : (
            data.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                removeFromCart={removeFromCart}
                isSelected={selectedItems.includes(item.id)}
                toggleSelect={toggleSelect}
              />
            ))
          )}
        </div>

        <div className="flex flex-row items-center justify-between border-t border-gray-300/50 pt-4 mt-2">
          <div className="flex flex-col items-start">
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">
              Total Amount
            </p>
            <p className="text-green-800 text-xl font-black">
              {totalPrice.toLocaleString("en-PH", {
                style: "currency",
                currency: "PHP",
              })}
            </p>
          </div>

          <div
            className={
              selectedItems.length === 0 ? "opacity-50 pointer-events-none" : ""
            }
          >
            <PrimaryButton
              icon={<IconShoppingBagCheck size={20} />}
              text="Checkout"
              action={() => alert("Proceeding to checkout!")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
