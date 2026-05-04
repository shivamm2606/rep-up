import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/axios";

interface CreateTemplatePayload {
  name: string;
  exercises: {
    exerciseId: string;
    targetSets?: number;
    notes?: string;
  }[];
}

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTemplatePayload) =>
      api.post("/workout-templates", data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });
};
