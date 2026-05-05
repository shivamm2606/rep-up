import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/axios";
import { toast } from "sonner";

interface UpdateAccountPayload {
  name?: string;
  username?: string;
  email?: string;
}

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateAccountPayload) =>
      api.patch("/user/account", data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success("Account updated");
    },
    onError: () => {
      toast.error("Failed to update account");
    },
  });
};
