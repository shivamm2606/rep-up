import { useQuery } from "@tanstack/react-query";
import api from "../../lib/axios";
import type { ApiSuccessResponse } from "../../types/apiErrorResponse";
import type { WorkoutTemplate } from "../../types/workoutTemplate.types";

export const useGetTemplateById = (templateId: string | null) => {
  return useQuery({
    queryKey: ["template", templateId],
    queryFn: (): Promise<ApiSuccessResponse<WorkoutTemplate>> =>
      api
        .get(`/workout-templates/${templateId}`)
        .then((r) => r.data as ApiSuccessResponse<WorkoutTemplate>),
    select: (response) => response.data,
    enabled: !!templateId,
  });
};
