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
import AdminDashboard from "./pages/admin/AdminDashboard";
import Layout from "./context/Layout";
import Login from "./pages/login/Login";
import NotFound from "./pages/NotFound";
import AdminRoute from "./context/AdminRoute";

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
          {/* public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/order-now" element={<OrderNow />} />
          <Route path="/order-history" element={<OrderHistory />} />

          {/* private routes */}
          <Route element={<AdminRoute />}>
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
