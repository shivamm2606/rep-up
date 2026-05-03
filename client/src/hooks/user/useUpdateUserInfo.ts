import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/axios";
import type { UpdateUserInfoPayload } from "../../types/user.types.js";

export const useUpdateUserInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserInfoPayload) =>
      api.patch("/user/profile", data).then((r) => r.data),
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data.data);
    },
  });
};
