import { getAllClusters } from "@/apis/cluster";
import { useQuery } from "@tanstack/react-query";

export const useClusters = () => {
  return useQuery({
    queryKey: ["clusters"],
    queryFn: async () => {
      const params = { page: 1, size: 10000 };
      const response = await getAllClusters(params);
      return response.payload.items;
    },
  });
};
