import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import Home from "./pages/home/Home";
import Header from "./components/header/Header";
import Nav from "./components/nav/Nav";
import HomeFooter from "./sections/home footer/HomeFooter";
import CartDialog from "./components/dialogs/CartDialog";
import AOS from "aos";
import "aos/dist/aos.css";

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
  const [cartData, setCartData] = useState([
    {
      id: 1,
      name: "Superworm",
      size: "small-medium",
      pieces: 1000,
      freebies: 100,
      price: 300,
      image: "/path/to/image1.jpg"
    },
    {
      id: 2,
      name: "Superworm",
      price: 200,
      size: "large-extra large",
      pieces: 1000,
      freebies: 100,
      image: "/path/to/image2.jpg"
    }
  ]);

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
        <Route path="/" element={<Home />} />
      </Routes>
      <HomeFooter />
    </BrowserRouter>
  );
}

export default App;
