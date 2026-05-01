import { useMutation } from "@tanstack/react-query";
import api from "../../lib/axios";
import { useNavigate } from "react-router-dom";

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: {
      name: string;
      username: string;
      email: string;
      password: string;
    }) => api.post("/auth/register", data).then((r) => r.data),

    onSuccess: (_, variables) => {
      navigate("/verify-otp", { state: { email: variables.email } });
    },
  });
};
