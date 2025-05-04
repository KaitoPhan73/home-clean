import { getAllRoomTypes } from "@/apis/room-type";
import { useQuery } from "@tanstack/react-query";

export const useRoomTypes = () => {
  return useQuery({
    queryKey: ["room-types"],
    queryFn: async () => {
      const params = { page: 1, size: 10000 };
      const response = await getAllRoomTypes(params);
      return response.payload.items; // API trả về `data`
    },
  });
};
