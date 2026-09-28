import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

//context
import { CartProvider } from "./context/CartContext.jsx";

//toast
import { Toaster } from "sonner";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CartProvider>
      <App />
      <Toaster richColors position="bottom-right" />
    </CartProvider>
  </StrictMode>,
);
