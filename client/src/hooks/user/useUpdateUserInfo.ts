import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/axios";

interface UpdateUserInfoPayload {
  height?: number;
  currentWeight?: number;
  targetWeight?: number;
  gender?: "male" | "female" | "other";
  dateOfBirth?: string;
  activityLevel?: "sedentary" | "lightly_active" | "moderately_active" | "very_active";
  goal?: "lose_weight" | "maintain" | "lean_bulk" | "bulk";
}

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
