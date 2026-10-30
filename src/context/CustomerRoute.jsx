import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function CustomerRoute() {
  const { isAdmin, loading } = useAuth();

  if (loading) return <div className="flex min-h-screen items-center justify-center text-sm text-green-800">Loading…</div>;
  if (isAdmin) return <Navigate to="/admin/dashboard" replace />;
  return <Outlet />;
}
