import { useState } from "react";
import { useRegister } from "../hooks/auth/useRegister.ts";
import { getErrorMessage } from "../utils/getErrorMessage.ts";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: register, error, isPending } = useRegister();

  const handleSubmit = () => {
    register({ name, email, username, password });
  };

  return (
    <div>
      {error && <div className="error">{getErrorMessage(error)}</div>}

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
      <button onClick={handleSubmit} disabled={isPending}>
        {isPending ? "Registering..." : "Register"}
      </button>
    </div>
  );
}

export default Register;
