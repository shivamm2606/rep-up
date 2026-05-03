import { useMutation } from "@tanstack/react-query";
import api from "../../lib/axios";

export const useResendOtp = () => {
  return useMutation({
    mutationFn: (data: { email: string }) =>
      api.post("/auth/resend-otp", data).then((r) => r.data),
  });
};
