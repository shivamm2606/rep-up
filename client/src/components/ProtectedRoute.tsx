import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";

function ProtectedRoute() {
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const needsOnboarding = useAuthStore((state) => state.needsOnboarding);
  const location = useLocation();

  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (needsOnboarding() && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
