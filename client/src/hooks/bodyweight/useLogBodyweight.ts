import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/axios";
import type { LogBodyweightPayload } from "../../types/bodyweight.types";

export const useLogBodyweight = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LogBodyweightPayload) =>
      api.post("/bodyweight", data).then((r) => r.data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["AllBodyweightLogs"] });
    },
  });
};
