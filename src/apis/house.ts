/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { httpHomePlus } from "@/lib/http";
import { THouseResponse, TCreateHouseRequest } from "@/schema/house.schema";
import { TRoomResponse } from "@/schema/room.schema";
import { TTableResponse } from "@/types/Table";

export const getAllHouses = async (params?: any) => {
  const response = await httpHomePlus.get<TTableResponse<THouseResponse>>(
    `/houses`,
    {
      params,
    }
  );
  console.log("getAllHouses Response:", response);
  return response;
};
export const getRoomsInHouse = async (id: string, params?: any) => {
  const response = await httpHomePlus.get<TTableResponse<TRoomResponse>>(
    `/houses/${id}/room`,
    {
      params,
    }
  );
  return response;
};

export const getHouseById = async (id: string) => {
  const response = await httpHomePlus.get<THouseResponse>(`/houses/${id}`);
  return response;
};

export const createHouse = async (data: Partial<THouseResponse>) => {
  const response = await httpHomePlus.post<THouseResponse>(`/houses`, data);
  console.log("createHouse Response:", response);
  return response;
};

export const updateHouse = async (id: string, data: TCreateHouseRequest) => {
  const response = await httpHomePlus.patch<THouseResponse>(
    `/houses/${id}`,
    data
  );
  console.log("updateHouse Response:", response);
  return response;
};

export const deleteHouse = async (id: string) => {
  const response = await httpHomePlus.delete(`/houses/${id}`);
  console.log("deleteHouse Response:", response);
  return response;
};
