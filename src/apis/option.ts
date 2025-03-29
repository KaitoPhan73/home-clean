/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { httpHomePlus } from "@/lib/http";
import { TOptionResponse, TOptionUpdateRequest } from "@/schema/option.schema";

export const getOptionById = async (id: string) => {
  const response = await httpHomePlus.get<TOptionResponse>(`/options/${id}`);
  return response;
};

export const createOption = async (data: Partial<TOptionResponse>) => {
  const response = await httpHomePlus.post<TOptionResponse>(`/options`, data);
  // console.log("create Services Response:", response);
  return response;
};

export const updateOption = async (id: string, data: TOptionUpdateRequest) => {
  const response = await httpHomePlus.patch<TOptionResponse>(
    `/options/${id}`,
    data
  );
  return response;
};

