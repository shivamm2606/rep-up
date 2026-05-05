import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/axios";
import { toast } from "sonner";

interface UpdateTemplatePayload {
  templateId: string;
  data: {
    name?: string;
    exercises?: {
      exerciseId: string;
      targetSets?: number;
      notes?: string;
    }[];
  };
}

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ templateId, data }: UpdateTemplatePayload) =>
      api.patch(`/workout-templates/${templateId}`, data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast.success("Template updated");
    },
    onError: () => {
      toast.error("Failed to update template");
    },
  });
};
