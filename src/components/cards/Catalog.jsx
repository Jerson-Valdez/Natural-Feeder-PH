import PrimaryButton from "../buttons/PrimaryButton";
import { useState } from "react";
import { IconArchiveFilled } from '@tabler/icons-react';

export default function Catalog({
  productImage,
  productName,
  productDescription,
  productBundleInfo,
  productFreebies,
}) {
  const [selectedBundle, setSelectedBundle] = useState(null);
  
  const [counter, setCounter] = useState(1);

  const totalPrice = selectedBundle ? selectedBundle.price * counter : 0;

  return (
    <div className="w-full max-w-sm flex flex-col items-center justify-start shadow-lg rounded-2xl bg-white overflow-hidden transition-all hover:shadow-xl">
      
      {/* Product Image */}
      <img className="w-full h-52 object-cover" src={productImage} alt={productName} />
      
      {/* Top Content */}
      <div className="flex flex-col w-full gap-2 px-5 py-4">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-green-900">{productName}</h2>
          <p className="text-sm text-gray-600 leading-snug mt-1">
            {productDescription}
          </p>
          <span className="text-green-700 font-semibold text-xs mt-2 bg-green-50 w-fit px-2 py-1 rounded-md">
            Freebies: {productFreebies}
          </span>
        </div>

        {/* CUSTOM STYLED RADIO BUTTONS */}
        <div className="flex flex-row gap-2 mt-2">
          {productBundleInfo.map((bundle, index) => {

            const isSelected = selectedBundle?.size === bundle.size;
            
            return (
              <label 
                key={index} 
                className={`relative flex flex-1 flex-row items-center justify-between p-2 rounded-xl border cursor-pointer transition-all ${
                  isSelected 
                    ? "border-green-800 bg-green-50 ring-1 ring-green-800" 
                    : "border-gray-200 bg-white hover:border-green-800/40 hover:bg-gray-50"
                }`}
              >
                <input 
                  type="radio" 
                  name={productName} 
                  value={bundle.size}
                  className="hidden"
                  onChange={() => setSelectedBundle(bundle)}
                />
                
                <div className="flex flex-col">
                  <span className={`font-bold text-[10px] md:text-xs ${isSelected ? "text-green-900" : "text-gray-700"}`}>
                    {bundle.size}
                  </span>
                  <p className={`font-black text-xs ${isSelected ? "text-green-800" : "text-gray-600"}`}>
                  ₱{bundle.price}<span className="text-gray-500 font-normal text-[10px] md:text-xs"> /{bundle.pieces} pcs </span>
                </p>
                </div>
                
              </label>
            );
          })}
        </div>
      </div>

      {/* BOTTOM CONTROLS & PRICE */}
      <div className="w-full bg-gray-50 flex flex-col px-5 py-4 border-t border-gray-100">
        
        {/* Dynamic Total Display */}
        <div className="flex flex-row items-center justify-between">
          <span className="text-sm font-bold text-gray-500 uppercase">Total</span>
          <span className="text-2xl font-black text-green-800">
            ₱{totalPrice.toLocaleString("en-PH")}
          </span>
        </div>

        <div className="flex flex-row items-center justify-between gap-3">
          <div className="flex flex-row items-center bg-white border border-gray-300 rounded-lg h-12 overflow-hidden shadow-sm flex-1 max-w-3xs">
            <button
              className="w-16 h-full text-gray-600 hover:bg-gray-100 font-bold transition-colors cursor-pointer"
              // Prevent counter from dropping below 1
              onClick={() => setCounter(counter > 1 ? counter - 1 : 1)}
            >
              -
            </button>
            <input 
              type="number" 
              value={counter} 
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setCounter(val > 0 ? val : 1);
              }} 
              className="w-full text-center font-bold text-gray-800 outline-none focus:bg-green-50" 
            />
            <button
              className="w-16 h-full text-gray-600 hover:bg-gray-100 font-bold transition-colors cursor-pointer"
              onClick={() => setCounter(counter + 1)}
            >
              +
            </button>
          </div>
          {totalPrice > 0 ? (
            <PrimaryButton
              icon={<IconArchiveFilled size={18} />}
              text="Add to Cart" 
              action={() => {
                if (!selectedBundle) alert("Please select a size first!");
                else alert(`Added ${counter} lot(s) of ${selectedBundle.size} to cart!`);
              }}
            />
          ) : (
            <PrimaryButton
              icon={<IconArchiveFilled size={18} />}
              text="Add to Cart"
              isDisabled={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}