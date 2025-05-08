/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { httpHomePlus } from "@/lib/http";
import { TFeedbackResponse } from "@/schema/feedback.schema";
import { TOrderResponse } from "@/schema/order.schema";
import {
  TStaffResponse,
  TStaffStatusReadyResponse,
  TStaffUpdateRequest,
} from "@/schema/staff.schema";
import { TTableResponse } from "@/types/Table";

export const getAllStaffs = async (params?: any) => {
  const response = await httpHomePlus.get<TTableResponse<TStaffResponse>>(
    `/staffs`,
    {
      params,
    }
  );
  return response;
};

export const getStaffById = async (id: string) => {
  const response = await httpHomePlus.get<TStaffResponse>(`/staffs/${id}`);
  return response;
};

export const getAllStaffStatus = async (groupId: string) => {
  const response = await httpHomePlus.get(
    `/staffs/get-all-staff-status/${groupId}`
  );
  return response.payload ?? [];
};

export const updateStaff = async (
  id: string,
  data: Partial<TStaffUpdateRequest>
) => {
  const response = await httpHomePlus.put<TStaffResponse>(
    `/staffs/${id}`,
    data
  );
  return response;
};

export const getAllStaffStatusReady = async (groupId?: string) => {
  try {
    let effectiveGroupId = groupId;
    if (!effectiveGroupId) {
      try {
        const userCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("user="));

        if (userCookie) {
          const userValue = userCookie.split("=")[1];
          const user = JSON.parse(decodeURIComponent(userValue));
          effectiveGroupId = user.groupId;
        }
      } catch (error) {
        console.error("Error getting user from cookie:", error);
      }
    }

    if (!effectiveGroupId) {
      throw new Error("GroupId is missing");
    }

    const response = await httpHomePlus.get(
      `/staffs/get-all-staff-status-ready/${effectiveGroupId}`
    );
    console.log("Full API response:", response);

    if (response.payload) {
      if (!Array.isArray(response.payload)) {
        return [response.payload];
      }
      return response.payload;
    }

    return [];
  } catch (error) {
    console.error("Error fetching staff status ready:", error);
    throw error;
  }
};

export const getOrderByStaffId = async (id: string) => {
  const response = await httpHomePlus.get<TOrderResponse>(
    `/staffs/${id}/order`
  );
  return response;
};

export const getFeedBackByStaffId = async (id: string) => {
  const response = await httpHomePlus.get<TTableResponse<TFeedbackResponse>>(
    `/staffs/${id}/feedback`
  );
  return response;
};

export const createStaff = async (data: Partial<TStaffResponse>) => {
  const response = await httpHomePlus.post<TStaffResponse>(
    `/auth/register-staff`,
    data
  );
  return response;
};

export const reloadAllStaffStatus = async (groupId: string) => {
  if (!groupId) {
    throw new Error("Group ID is required");
  }

  try {
    const response = await httpHomePlus.post(
      `/staffs/reload-all-staff-status/${groupId}`,
      {}
    );
    return response;
  } catch (error) {
    console.error("Error reloading staff status:", error);
    throw error;
  }
};
