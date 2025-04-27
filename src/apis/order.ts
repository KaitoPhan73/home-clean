/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { httpHomePlus } from "@/lib/http";
import { TApproveReOrderUpdateRequest, TAssignStaffToOrderRequest, TOrderResponse, TTrackingOrderResponse } from "@/schema/order.schema";
import { TTableResponse } from "@/types/Table";
import { cookies } from "next/headers";


export const getAllOrders = async (params?: any) => {
  const response = await httpHomePlus.get<TTableResponse<TOrderResponse>>(
    `/orders`,
    {
      params,
    }
  );
  return response;
};

export const getOrderById = async (id: string) => {
  const response = await httpHomePlus.get<TOrderResponse>(`/orders/${id}`);
  return response;
};

export const getTrackingOrderById = async (id: string) => {
  const response = await httpHomePlus.get<TTrackingOrderResponse>(`/orders/${id}/tracking`);
  return response;
};

export const assignStaffToOrder = async (id: string, data: TAssignStaffToOrderRequest) => {
  const response = await httpHomePlus.put<TOrderResponse>(
    `/orders/assign-staff`,
    data
  );
  return response;
};

export const cancelOrder = async (
  id: string,
  data: { cancellationReason: string; refundMethod: string }
) => {
  const cookieStore = await cookies();
  const userRaw = cookieStore.get("user")?.value ?? "{}";
  let user;

  try {
    user = JSON.parse(userRaw);
  } catch (error) {
    console.error("Error parsing user cookie:", error);
    throw new Error("Invalid user data");
  }

  const cancelledBy = user?.userId;
  if (!cancelledBy) {
    throw new Error("User not authenticated");
  }

  const response = await httpHomePlus.post<TOrderResponse>(
    `/orders/${id}/cancel`,
    {
      cancellationReason: data.cancellationReason,
      refundMethod: data.refundMethod,
      cancelledBy,
    }
  );
  return response;
};

export const updateApproveReOrder = async (id: string, data: TApproveReOrderUpdateRequest) => {
  const response = await httpHomePlus.put<TOrderResponse>(
    `/orders/${id}/approve-re-order`,
    data
  );
  return response;
};
