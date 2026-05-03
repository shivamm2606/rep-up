import { useQuery } from "@tanstack/react-query";
import api from "../../lib/axios";
import type { ApiSuccessResponse } from "../../types/apiErrorResponse";
import type { PaginatedSessions } from "../../types/workoutSession.types";

export const useWorkoutSessions = () => {
  return useQuery({
    queryKey: ["AllWorkoutSessions"],
    queryFn: (): Promise<ApiSuccessResponse<PaginatedSessions>> =>
      api
        .get("/workout-session/")
        .then((r) => r.data as ApiSuccessResponse<PaginatedSessions>),
    select: (response) => response.data,
  });
};
