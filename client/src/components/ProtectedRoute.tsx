import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore";

function ProtectedRoute() {
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
