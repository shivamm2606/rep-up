import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/axios";
import { useNavigate } from "react-router-dom";

export const useVerifyOtp = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: { email: string; otp: string }) =>
      api.post("/auth/verify-otp", data).then((r) => r.data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });

      navigate("/verified");
    },
  });
};
