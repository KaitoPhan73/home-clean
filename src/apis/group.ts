/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpHomePlus } from "@/lib/http";
import { TGroupResponse, TUpdateGroupRequest } from "@/schema/group.schema";
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

export const getAllGroupsInCreateStaff = async (params?: any) => {
  const response = await httpHomePlus.get<TTableResponse<TGroupResponse>>(
    `/groups?page=1&size=1000`,
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
      `/groups/${groupId}/order-v2?page=1&size=10000`,
    );

    return response;
  } catch (error) {
    console.error("Lỗi khi lấy đơn hàng theo Group ID:", error);
    throw error;
  }
};



export const getGroupById = async (id: string) => {
  const response = await httpHomePlus.get<TGroupResponse>(`/groups/${id}`);
  return response;
};

export const createGroup = async (data: Partial<TGroupResponse>) => {
  const response = await httpHomePlus.post(`/v2/groups`, data);
  return response;
};

export const updateGroup = async (
  id: string,
  data: Partial<TUpdateGroupRequest>
) => {
  const response = await httpHomePlus.put(`/groups/${id}`, data);
  return response;
};
