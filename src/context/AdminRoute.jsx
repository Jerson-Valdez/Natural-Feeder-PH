import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { OrbitProgress } from "react-loading-indicators";

export default function AdminRoute() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-row justify-center items-center">
        <OrbitProgress color="#166534" size="large" text="Checking" textColor="#166534" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
