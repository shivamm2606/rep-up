import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/axios";
import type {
  StrengthSetPayload,
  CardioSetPayload,
  FlexibilitySetPayload,
} from "../../types/workoutSession.types";

export type LogSetPayload =
  | StrengthSetPayload
  | CardioSetPayload
  | FlexibilitySetPayload;

export const useLogSet = (sessionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LogSetPayload) =>
      api.post(`/workout-session/${sessionId}/set`, data).then((r) => r.data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session", sessionId] });
      queryClient.invalidateQueries({ queryKey: ["AllWorkoutSessions"] });
    },
  });
};
