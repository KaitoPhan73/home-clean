import { getAllGroups } from "@/apis/group";
import { useQuery } from "@tanstack/react-query";

export const useGroups = () => {
  return useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const params = { page: 1, size: 10000, limit: 1000 };
      const response = await getAllGroups(params);
      return response.payload.items;
    },
  });
};
