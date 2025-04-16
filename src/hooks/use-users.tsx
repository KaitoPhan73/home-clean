import { getAllUsers } from "@/apis/vinwallet/user";
import { useQuery } from "@tanstack/react-query";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const params = { page: 1, limit: 100 };
      const response = await getAllUsers(params);
      return response.payload.items; // API trả về `data`
    },
  });
};
