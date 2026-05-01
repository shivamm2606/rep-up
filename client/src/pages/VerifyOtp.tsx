import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getErrorMessage } from "../utils/getErrorMessage.ts";
import { useVerifyOtp } from "../hooks/auth/useVerifyOtp.ts";
import { useNavigate } from "react-router-dom";

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const email = location.state?.email;

  const navigate = useNavigate();
  useEffect(() => {
    if (!email) navigate("/register");
  }, [email, navigate]);

  const { mutate: verifyOtp, error, isPending } = useVerifyOtp();

  const handleSubmit = () => {
    verifyOtp({ email, otp });
  };

  return (
    <div>
      {error && <div className="error">{getErrorMessage(error)}</div>}
      <input
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="OTP"
      />
      <button onClick={handleSubmit} disabled={isPending}>
        {isPending ? "Verifying..." : "Verify"}
      </button>
    </div>
  );
}

export default VerifyOtp;
