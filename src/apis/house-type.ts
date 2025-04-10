/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { httpHomePlus } from "@/lib/http";
import {
  THouseTypeResponse,
  TCreateHouseTypeRequest,
} from "@/schema/house-type.schema";
import { TTableResponse } from "@/types/Table";
import { THouseResponse } from "@/schema/house.schema";

export const getAllHouseTypes = async (params?: any) => {
  const response = await httpHomePlus.get<TTableResponse<THouseTypeResponse>>(
    `/house-types`,
    {
      params,
    }
  );
  return response;
};

export const getHousesInHouseType = async (id: string, params?: any) => {
  const response = await httpHomePlus.get<TTableResponse<THouseResponse>>(
    `/house-types/${id}/house`,
    {
      params,
    }
  );
  return response;
};

export const getHouseTypeById = async (id: string) => {
  const response = await httpHomePlus.get<THouseTypeResponse>(
    `/house-types/${id}`
  );
  console.log("getHouseTypeById Response:", response);
  return response;
};

export const createHouseType = async (data: Partial<THouseTypeResponse>) => {
  const response = await httpHomePlus.post<THouseTypeResponse>(
    `/house-types`,
    data
  );
  console.log("createHouseType Response:", response);
  return response;
};

export const updateHouseType = async (
  id: string,
  data: TCreateHouseTypeRequest
) => {
  const response = await httpHomePlus.patch<THouseTypeResponse>(
    `/house-types/${id}`,
    data
  );
  console.log("updateHouseType Response:", response);
  return response;
};

export const deleteHouseType = async (id: string) => {
  const response = await httpHomePlus.delete(`/house-types/${id}`);
  console.log("deleteHouseType Response:", response);
  return response;
};
