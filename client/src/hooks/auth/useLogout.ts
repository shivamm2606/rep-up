import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios";
import useAuthStore from "../../store/authStore";
import { toast } from "sonner";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => api.post("/auth/logout").then((r) => r.data),
    onSuccess: () => {
      useAuthStore.getState().clearAuth();
      queryClient.clear();
      navigate("/login", { replace: true });
      toast.success("Logged out");
    },
    onError: () => {
      toast.error("Failed to logout");
    },
  });
};
