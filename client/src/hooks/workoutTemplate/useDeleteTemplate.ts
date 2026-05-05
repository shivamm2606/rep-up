import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/axios";
import { toast } from "sonner";

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (templateId: string) =>
      api.delete(`/workout-templates/${templateId}`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast.success("Template deleted");
    },
    onError: () => {
      toast.error("Failed to delete template");
    },
  });
};
