/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpHomePlus } from "@/lib/http";
import { TManagerResponse } from "@/schema/manager.schema";
import { TTableResponse } from "@/types/Table";

export const getAllManagers = async (params?: any) => {
  const response = await httpHomePlus.get<TTableResponse<TManagerResponse>>(
    `/managers`,
    {
      params,
    }
  );
  return response;
};

export const getAllManagerInGroup = async (params?: any) => {
  const response = await httpHomePlus.get<TManagerResponse[]>(
    `/managers/no-group`,
    {
      params,
    }
  );
  return response;
}
export const getManagerById = async (id: string) => {
  const response = await httpHomePlus.get<TManagerResponse>(`/managers/${id}`);
  return response;
};

export const createManager = async (data: Partial<TManagerResponse>) => {
  const response = await httpHomePlus.post<TManagerResponse>(`/auth/register-manager`, data);
  return response;
};