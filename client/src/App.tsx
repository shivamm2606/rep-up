import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";
import api from "./lib/axios";
import useAuthStore from "./store/authStore";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";

function RootRedirect() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) return null;
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />;
}

function App() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    api
      .get("/api/v1/user/profile")
      .then((response) => {
        const user = response.data.data;
        setAuth(user);
        setLoading(false);
        console.log("auth store:", useAuthStore.getState());
      })
      .catch((err) => {
        console.log("not logged in:", err);
        setLoading(false);
      });
  }, [setAuth, setLoading]);

  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
