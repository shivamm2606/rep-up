import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/axios";
import type { CreateSessionPayload } from "../../types/workoutSession.types";

export const useCreateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSessionPayload) =>
      api.post("/workout-session", data).then((r) => r.data),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["AllWorkoutSessions"] });
      return response.data;
    },
  });
};
