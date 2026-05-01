import { useQuery } from "@tanstack/react-query";
import api from "../../lib/axios";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => api.get("/user/profile").then((r) => r.data),
  });
};
