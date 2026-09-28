import { IconTrash, IconSquareRoundedCheckFilled, IconSquareRounded } from "@tabler/icons-react";
import Superworm from "../../assets/catalogs/superworm.webp";
import { useNavigate } from "react-router-dom";

//context
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";

//toast
import { toast } from "sonner";

export default function CartItemCard({ item, removeFromCart, isSelected, toggleSelect }) {
  const image = item.name === "superworm" ? Superworm : null;
  const cost = item.quantity * item.price;
  const navigate = useNavigate();

  const { reduceCartItemQuantity, increaseCartItemQuantity } = useContext(CartContext);

  return (
    <div
      className={`flex items-center justify-between w-full rounded-2xl p-3 shadow-md border cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 ${
        isSelected ? "bg-green-50 border-green-800" : "bg-white/80 border-white/40"
      }`}
      onClick={() => navigate("/order-now")}
    >
      <div className="flex items-center gap-3">
        <button 
          className={`transition-colors cursor-pointer active:scale-95 ${
            isSelected ? "text-green-800" : "text-gray-300 hover:text-green-800"
          }`} 
          onClick={(e) => { 
            e.stopPropagation(); 
            toggleSelect(item.id); 
          }}
        >
          {isSelected ? <IconSquareRoundedCheckFilled size={26} /> : <IconSquareRounded size={26} />}
        </button>
        <img
          src={image}
          alt={item.name}
          className="w-14 h-14 object-cover rounded-xl shadow-sm"
        />

        <div className="flex flex-col items-start text-left">
          <h3 className="font-bold text-green-900 text-sm">{item.name}</h3>
          <div className="flex flex-row items-center bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm flex-1 max-w-3xs">
            <button
              className="w-10 h-full text-gray-600 hover:bg-gray-100 font-bold transition-colors cursor-pointer"
              onClick={() => reduceCartItemQuantity(item.cartItemId)}
            >
              -
            </button>
            <span className="flex-1 text-center text-gray-800">
              {item.quantity}
            </span>
            <button
              className="w-10 h-full text-gray-600 hover:bg-gray-100 font-bold transition-colors cursor-pointer"
              onClick={() => increaseCartItemQuantity(item.cartItemId)}
            >
              +
            </button>
          </div>
          <p className="text-gray-500 text-[11px] font-medium mt-0.5">
            {item.pieces * item.quantity} {item.freebies > 0 ? `+ ${item.freebies * item.quantity}` : ""} pcs • {item.size}
          </p>
          <p className="text-green-800 text-sm font-black mt-0.5">
            {cost.toLocaleString("en-PH", {
              style: "currency",
              currency: "PHP",
            })}
          </p>
        </div>
      </div>

      <button
        onClick={(e) => {
            e.stopPropagation();
            removeFromCart(item.cartItemId);
            toast.success("Item removed from cart.");
        }}
        className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors cursor-pointer"
      >
        <IconTrash size={20} />
      </button>
    </div>
  );
}