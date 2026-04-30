import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

function ProtectedRoute({ children }) {
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
