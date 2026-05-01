import { useQuery } from "@tanstack/react-query";
import api from "../../lib/axios";
import type { ApiSuccessResponse } from "../../types/apiErrorResponse";
import type { PaginatedBodyweights } from "../../types/bodyweight.types";

export const useBodyweightLog = () => {
  return useQuery({
    queryKey: ["AllBodyweightLogs"],
    queryFn: (): Promise<ApiSuccessResponse<PaginatedBodyweights>> =>
      api
        .get("/bodyweight/")
        .then((r) => r.data as ApiSuccessResponse<PaginatedBodyweights>),
    select: (response) => response.data,
  });
};
