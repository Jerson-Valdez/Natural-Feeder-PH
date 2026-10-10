import { Navigate, Outlet } from "react-router-dom";

export default function Admin({ user, userRole }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}