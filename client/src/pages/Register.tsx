import { useState } from "react";
import api from "../lib/axios.ts";
import useAuthStore from "../store/authStore.ts";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../utils/getErrorMessage.ts";

function Register() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleSubmit() {
    setError("");
    try {
      setLoading(true);
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      const response = await api.post("/api/v1/auth/register", {
        name,
        email,
        username,
        password,
      });
      const { data } = response.data;
      setAuth(data);
      navigate("/verify-email", { state: { email } });
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
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
      />
      <input
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm Password"
        type="password"
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>
    </div>
  );
}

export default Register;
