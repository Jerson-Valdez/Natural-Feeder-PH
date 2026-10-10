import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";

//css
import "./App.css";

//aos
import AOS from "aos";
import "aos/dist/aos.css";

//pages
import Home from "./pages/home/Home";
import OrderNow from "./pages/order_now/OrderNow";
import OrderHistory from "./pages/order_history/OrderHistory";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Layout from "./components/layout/Layout";
import Login from "./pages/login/Login";
import NotFound from "./pages/NotFound";
import Admin from "./components/layout/Admin";

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

  const [userRole, setUserRole] = useState("user");
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login setUserRole={setUserRole} setUser={setUser} />} />

        {/* layout */}
        <Route element={<Layout userRole={userRole} setUserRole={setUserRole} user={user} setUser={setUser} />}>
          {/* public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/order-now" element={<OrderNow />} />
          <Route path="/order-history" element={<OrderHistory />} />

          {/* private routes */}
          <Route element={<Admin user={user} userRole={userRole} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
        </Route>

        {/* fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
