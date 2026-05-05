import { useMutation } from "@tanstack/react-query";
import api from "../../lib/axios";
import { toast } from "sonner";

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordPayload) =>
      api.patch("/user/change-password", data).then((r) => r.data),
    onSuccess: () => {
      toast.success("Password changed");
    },
    onError: () => {
      toast.error("Failed to change password");
    },
  });
};
