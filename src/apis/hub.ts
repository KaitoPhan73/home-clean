/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpHomePlus } from "@/lib/http";
import { TServiceResponse } from "@/schema/service.schema";
import { TTableResponse } from "@/types/Table";

export const getAllHubs = async (params?: any) => {
  const response = await httpHomePlus.get<TTableResponse<TServiceResponse>>(
    `/hubs`,
    {
      params,
    }
  );

  return response;
};
