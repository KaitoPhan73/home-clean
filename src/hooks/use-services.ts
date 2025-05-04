"use client";
import { getAllServices } from "@/apis/service";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useServices = () => {
  return useSuspenseQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const params = { page: 1, size: 10000, limit: 1000 };
      const response = await getAllServices(params);
      return response.payload.items;
    },
    staleTime: Infinity,
  });
};
