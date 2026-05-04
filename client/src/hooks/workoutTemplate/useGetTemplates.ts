import { useQuery } from "@tanstack/react-query";
import api from "../../lib/axios";
import type { ApiSuccessResponse } from "../../types/apiErrorResponse";
import type { WorkoutTemplate } from "../../types/workoutTemplate.types";

export const useGetTemplates = () => {
  return useQuery({
    queryKey: ["templates"],
    queryFn: (): Promise<ApiSuccessResponse<WorkoutTemplate[]>> =>
      api
        .get("/workout-templates")
        .then((r) => r.data as ApiSuccessResponse<WorkoutTemplate[]>),
    select: (response) => response.data,
  });
};
