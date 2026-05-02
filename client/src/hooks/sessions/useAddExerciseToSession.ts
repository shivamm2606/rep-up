import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/axios";
import type { AddExercisePayload } from "../../types/workoutSession.types";

export const useAddExerciseToSession = (sessionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddExercisePayload) =>
      api
        .post(`/workout-session/${sessionId}/exercise`, data)
        .then((r) => r.data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session", sessionId] });
      queryClient.invalidateQueries({ queryKey: ["AllWorkoutSessions"] });
    },
  });
};
