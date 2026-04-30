import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../lib/axios.ts";
import { getErrorMessage } from "../utils/getErrorMessage.ts";

function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  async function handleSubmit() {
    setError("");
    try {
      setLoading(true);
      await api.post("/api/v1/auth/verify-otp", { email, otp });
      navigate("/login");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <input
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="OTP"
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Verifying..." : "Verify"}
      </button>
    </div>
  );
}

export default VerifyEmail;
