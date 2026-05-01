import { useState } from "react";
import { useLogin } from "../hooks/auth/useLogin.ts";
import { getErrorMessage } from "../utils/getErrorMessage.ts";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: login, error, isPending } = useLogin();

  const handleSubmit = () => {
    login({ email, password });
  };

  return (
    <div>
      {error && <div className="error">{getErrorMessage(error)}</div>}

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
      <button onClick={handleSubmit} disabled={isPending}>
        {isPending ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}

export default Login;
