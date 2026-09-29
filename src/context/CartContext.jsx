import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("naturalFeederCart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [orderHistoryIds, setOrderHistoryIds] = useState(() => {
    const saved = localStorage.getItem("naturalFeederHistoryIds");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("naturalFeederCart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(
      "naturalFeederHistoryIds",
      JSON.stringify(orderHistoryIds),
    );
  }, [orderHistoryIds]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      if (prevCart.some((item) => item.id === product.id)) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item,
        );
      }
      return [...prevCart, { ...product, cartItemId: Date.now() }];
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.cartItemId !== cartItemId),
    );
  };

  const reduceCartItemQuantity = (cartItemId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const increaseCartItemQuantity = (cartItemId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };

  const addOrderIdToHistory = (firebaseId) => {
    setOrderHistoryIds((prev) => [...prev, firebaseId]);
  };

  const removeItemsFromCart = (cartItemIds) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !cartItemIds.includes(item.cartItemId)),
    );
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        orderHistoryIds,
        addToCart,
        removeFromCart,
        setCart,
        reduceCartItemQuantity,
        increaseCartItemQuantity,
        addOrderIdToHistory,
        removeItemsFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
