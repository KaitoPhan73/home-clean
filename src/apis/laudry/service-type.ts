/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpVinLaundry } from "@/lib/http";
import { ItemTypeResponsePayload } from "@/schema/VinLaudry/item-type.schema";
import { TServiceTypeResponse } from "@/schema/VinLaudry/service-type.schema";
import { TTableResponse } from "@/types/Table";

export const getAllServiceTypes = async (params?: any) => {
  const response = await httpVinLaundry.get<TTableResponse<TServiceTypeResponse>>("/service-types", {
    params,
  });
  return { payload: response.payload };
};

export const getServiceTypeById = async (serviceTypeId: string) => {
    const response = await httpVinLaundry.get<TServiceTypeResponse>(`/service-types/${serviceTypeId}`);
    return response;
};

// export const getItemTypesByServiceTypeId = async (serviceTypeId: string) => {
//   const response = await httpVinLaundry.get<{ payload: ItemTypeResponsePayload }>(
//     `/service-types/${serviceTypeId}/item-types`
//   );
//   return response;
// };

export const getItemTypesByServiceTypeId = async (serviceTypeId: string) => {
  const response = await httpVinLaundry.get<ItemTypeResponsePayload>(`/service-types/${serviceTypeId}/item-types`);
  return response;
};