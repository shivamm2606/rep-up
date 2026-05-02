import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";
import api from "./lib/axios";
import useAuthStore from "./store/authStore";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import MainLayout from "./layouts/MainLayout";

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
      .get("/user/profile")
      .then((response) => {
        const user = response.data.data;
        setAuth(user);
        setLoading(false);
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
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/register" element={<Register />} />

      {/* protected + layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/templates" element={<div>Templates</div>} />
          <Route path="/workout" element={<div>Workout</div>} />
          <Route path="/history" element={<div>History</div>} />
          <Route path="/profile" element={<div>Profile</div>} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
