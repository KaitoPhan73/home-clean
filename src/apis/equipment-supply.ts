/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { httpHomePlus } from "@/lib/http";
import { TEquipmentSupplyResponse, TEquipmentSupplyUpdateRequest } from "@/schema/equipment-supply.schema";

export const getEquipmentSupplyById = async (id: string) => {
  const response = await httpHomePlus.get<TEquipmentSupplyResponse>(`/equipment-supplies/${id}`);
  return response;
};


export const createEquipmentSupply = async (data: Partial<TEquipmentSupplyResponse>) => {
  const response = await httpHomePlus.post<TEquipmentSupplyResponse>(`/equipment-supplies`, data);
  return response;
};


export const updateEquipmentSupply = async (id: string, data: TEquipmentSupplyUpdateRequest) => {
  const response = await httpHomePlus.patch<TEquipmentSupplyResponse>(
    `/equipment-supplies/${id}`,
    data
  );
  return response;
};

