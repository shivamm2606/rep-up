import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";
import api from "./lib/axios";
import useAuthStore from "./store/authStore";

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
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
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
