/* eslint-disable @typescript-eslint/no-explicit-any */ 
"use server";

import { httpHomePlus } from "@/lib/http";
import { TGroupResponse } from "@/schema/group.schema";
import { TOrderResponse } from "@/schema/order.schema";
import { TTableResponse } from "@/types/Table";
// import { getCookie } from "cookies-next";

export const getAllGroups = async (params?: any) => {
  const response = await httpHomePlus.get<TTableResponse<TGroupResponse>>(
    `/groups`,
    {
      params,
    }
  );
  return response;
};

export const getAllOrdersByGroupId = async (groupId: string) => {
  try {
    if (!groupId) {
      throw new Error("Group ID không tồn tại");
    }

    const response = await httpHomePlus.get<TTableResponse<TOrderResponse>>(
      `/groups/${groupId}/order-v2`
    );

    return response;
  } catch (error) {
    console.error("Lỗi khi lấy đơn hàng theo Group ID:", error);
    throw error;
  }
};

export const getGroupById = async (id: string) => {
  const response = await httpHomePlus.get<{ payload: TGroupResponse; status: number; message: string }>(`/groups/${id}`);
  return response;
};

export const createGroup = async (data: Partial<TGroupResponse>) => {
  const response = await httpHomePlus.post(`/v2/groups`, data);
  return response;
};