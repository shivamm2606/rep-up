import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/axios";
import useAuthStore from "../../store/authStore";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      api.post("/auth/login", data).then((r) => r.data),

    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data.data.user);
      useAuthStore.getState().setAuth(data.data.user);
      navigate("/dashboard");
    },
  });
};
