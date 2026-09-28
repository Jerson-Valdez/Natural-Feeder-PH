import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("naturalFeederCart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [orderHistory, setOrderHistory] = useState(() => {
    const savedHistory = localStorage.getItem("naturalFeederHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  useEffect(() => {
    localStorage.setItem("naturalFeederCart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("naturalFeederHistory", JSON.stringify(orderHistory));
  }, [orderHistory]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      if (prevCart.some((item) => item.name === product.name && item.size === product.size)) {
        return prevCart.map((item) =>
          item.name === product.name && item.size === product.size
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      }
      return [...prevCart, { ...product, cartItemId: Date.now() }]; 
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartItemId !== cartItemId));
  };

  const reduceCartItemQuantity = (cartItemId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ).filter((item) => item.quantity > 0)
    );
  };

  const increaseCartItemQuantity = (cartItemId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ cart, orderHistory, addToCart, removeFromCart, setOrderHistory, setCart, reduceCartItemQuantity, increaseCartItemQuantity }}>
      {children}
    </CartContext.Provider>
  );
}