/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpVinLaundry } from "@/lib/http";
import { TServiceTypeResponse } from "@/schema/VinLaudry/service-type.schema";
import { TTableResponse } from "@/types/Table";

export const getAllServiceTypes = async (params?: any) => {
  const response = await httpVinLaundry.get<TTableResponse<TServiceTypeResponse>>("/service-types", {
    params,
  });
  return { payload: response.payload };
};