import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "../components/header/Header";
import Nav from "../components/nav/Nav";
import CartDialog from "../components/dialogs/CartDialog";
import FloatingMessenger from "../components/FloatingMessenger";
import { useAuth } from "./AuthContext";

export default function Layout() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { isAdmin } = useAuth();

  return (
    <>
      <Header setIsCartOpen={setIsCartOpen} isCartOpen={isCartOpen}/>
      <Nav/>
      
      <Outlet />
      {!isAdmin && <FloatingMessenger />}
      <CartDialog isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
