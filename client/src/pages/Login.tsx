import { useState } from "react";
import api from "../lib/axios.ts";
import useAuthStore from "../store/authStore.ts";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../utils/getErrorMessage.ts";

function Login() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit() {
    setError("");
    try {
      setLoading(true);
      const response = await api.post("/api/v1/auth/login", {
        email,
        password,
      });
      const { data } = response.data;
      setAuth(data);
      navigate("/dashboard");
      console.log("auth store:", useAuthStore.getState());
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}

export default Login;
