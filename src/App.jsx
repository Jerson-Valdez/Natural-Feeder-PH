import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import Home from "./pages/home/Home";
import Header from "./components/header/Header";
import Nav from "./components/nav/Nav";
import CartDialog from "./components/dialogs/CartDialog";
import AOS from "aos";
import "aos/dist/aos.css";
import OrderNow from "./pages/order_now/OrderNow";
import OrderHistory from "./pages/order_history/OrderHistory";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  useEffect(() => {
    AOS.init({
      once: true,
      duration: 600,
      offset: 50,

      // Optional: If animations lag on cheap phones, you can disable them entirely on mobile
      // disable: 'mobile'
    });
  }, []);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartData, setCartData] = useState([]);

  function removeFromCart(itemId) {
    const updatedCart = cartData.filter((item) => item.id !== itemId);
    setCartData(updatedCart);
  }

  return (
    <BrowserRouter>
      <Header setIsCartOpen={setIsCartOpen} isCartOpen={isCartOpen} />
      <Nav />
      <CartDialog isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} data={cartData} removeFromCart={removeFromCart} />
      <Routes>
        {/* public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/order-now" element={<OrderNow />} />
        <Route path="/order-history" element={<OrderHistory />} />

        {/* private routes */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* fallback route */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;