/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { httpHomePlus } from "@/lib/http";
import {
  TTimesSlotCreateRequest,
  TTimesSlotResponse,
  TTimesSlotUpdateRequest,
} from "@/schema/time-slot.schema";
import { TTableResponse } from "@/types/Table";

export const getAllTimeSlots = async (params?: any) => {
  const response = await httpHomePlus.get<TTableResponse<TTimesSlotResponse>>(
    `/time-slots`,
    {
      params,
    }
  );
  return response;
};

export const getTimeSlotById = async (id: string) => {
  const response = await httpHomePlus.get<TTimesSlotResponse>(
    `/time-slots/${id}`
  );
  return response;
};

export const deleteTimeSlot = async (id: string) => {
  const response = await httpHomePlus.delete<TTimesSlotResponse>(
    `/time-slots/${id}`
  );
  return response;
};
export const createTimeSlot = async (data: TTimesSlotCreateRequest) => {
  const response = await httpHomePlus.post<TTimesSlotResponse>(
    `/time-slots`,
    data
  );
  return response;
};
export const updateTimeSlot = async (
  id: string,
  data: TTimesSlotUpdateRequest
) => {
  const response = await httpHomePlus.patch<TTimesSlotResponse>(
    `/time-slots/${id}`,
    data
  );
  return response;
};
