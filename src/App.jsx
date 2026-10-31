import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";

//css
import "./App.css";

//aos
import AOS from "aos";
import "aos/dist/aos.css";

//pages
import Home from "./pages/home/Home";
import OrderNow from "./pages/order_now/OrderNow";
import OrderHistory from "./pages/order_history/OrderHistory";
import OrderDetail from "./pages/order_history/OrderDetail";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminInventory from "./pages/admin/AdminInventory";
import AdminAssets from "./pages/admin/AdminAssets";
import AdminSettings from "./pages/admin/AdminSettings";
import Layout from "./context/Layout";
import Login from "./pages/login/Login";
import NotFound from "./pages/NotFound";
import AdminRoute from "./context/AdminRoute";
import CustomerRoute from "./context/CustomerRoute";

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

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* layout */}
        <Route element={<Layout />}>
          {/* Customer pages are hidden from authenticated administrators. */}
          <Route element={<CustomerRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/order-now" element={<OrderNow />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="/order-history/:orderId" element={<OrderDetail />} />
          </Route>

          {/* private routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/products" element={<AdminInventory />} />
            <Route path="/admin/assets" element={<AdminAssets />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
        </Route>

        {/* fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
