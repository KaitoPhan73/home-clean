import { getAllManagers } from "@/apis/manager";
import { useQuery } from "@tanstack/react-query";

export const useManagers = () => {
  return useQuery({
    queryKey: ["managers"],
    queryFn: async () => {
      const params = { page: 1, size: 10000 };
      const response = await getAllManagers(params);
      return response.payload.items; // API trả về `data`
    },
  });
};
