import { getAllAreas } from "@/apis/area";
import { useQuery } from "@tanstack/react-query";

export const useAreas = () => {
  return useQuery({
    queryKey: ["areas"],
    queryFn: async () => {
      const params = { page: 1, limit: 100 };
      const response = await getAllAreas(params);
      return response.payload.items; // API trả về `data`
    },
  });
};
