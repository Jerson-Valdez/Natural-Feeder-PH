import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "../components/header/Header";
import Nav from "../components/nav/Nav";
import CartDialog from "../components/dialogs/CartDialog";

export default function Layout() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <Header setIsCartOpen={setIsCartOpen} isCartOpen={isCartOpen}/>
      <Nav/>
      
      <Outlet />
      <CartDialog isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}