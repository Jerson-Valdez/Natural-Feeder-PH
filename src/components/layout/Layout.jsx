import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "../header/Header";
import Nav from "../nav/Nav";
import CartDialog from "../dialogs/CartDialog";

export default function Layout({ userRole, setUserRole, user, setUser }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <Header setIsCartOpen={setIsCartOpen} isCartOpen={isCartOpen} userRole={userRole} email={user?.email} />
      <Nav userRole={userRole} setUserRole={setUserRole} setUser={setUser} />
      
      <CartDialog isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      <Outlet context={{ userRole, setUserRole, user, setUser }} />
    </>
  );
}