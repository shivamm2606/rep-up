import { useQuery } from "@tanstack/react-query";
import api from "../../lib/axios";

export interface Exercise {
  _id: string;
  name: string;
  category: string;
  muscleGroup: string;
  isCustom: boolean;
}

interface Filters {
  search?: string;
  muscleGroup?: string;
  category?: string;
}

export function useGetExercises(filters: Filters = {}) {
  return useQuery({
    queryKey: ["exercises", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.muscleGroup) params.set("muscleGroup", filters.muscleGroup);
      if (filters.category) params.set("category", filters.category);
      params.set("limit", "100");

      const res = await api.get(`/exercises?${params}`);
      return res.data.data.exercises as Exercise[];
    },
  });
}
