/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpVinLaundry } from "@/lib/http";
import { TOrderLaundryResponse } from "@/schema/VinLaudry/laundry-order";
import { TTableResponse } from "@/types/Table";

export const getAllOrders = async (params?: any) => {
  const response = await httpVinLaundry.get<TTableResponse<TOrderLaundryResponse>>("/orders", {
    params,
  });
  return { payload: response.payload };
};

export const getOrderById = async (id: string): Promise<TOrderLaundryResponse> => {
  const response = await httpVinLaundry.get<TOrderLaundryResponse>(`/orders/${id}`);
  return response.payload;
};