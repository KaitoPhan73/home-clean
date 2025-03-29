/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { httpHomePlus } from "@/lib/http";
import { TStaffResponse, TStaffStatusReadyResponse } from "@/schema/staff.schema";
import { TTableResponse } from "@/types/Table";


export const getAllStaffs = async (params?: any) => {
  const response = await httpHomePlus.get<TTableResponse<TStaffResponse>>(
    `/staffs`,
    {
      params,
    }
  );
  // console.log("getAllserrr Response:", response);
  return response;
};

export const getAllStaffStatus = async (groupId: string) => {
  const response = await httpHomePlus.get(`/staffs/get-all-staff-status/${groupId}`);
  return response.payload ?? [];
};


export const getAllStaffStatusReady = async (groupId?: string) => {
  try {
    // If no groupId was provided, try to get it from the user cookie
    let effectiveGroupId = groupId;
    if (!effectiveGroupId) {
      try {
        const userCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('user='));
        
        if (userCookie) {
          const userValue = userCookie.split('=')[1];
          const user = JSON.parse(decodeURIComponent(userValue));
          effectiveGroupId = user.groupId;
        }
      } catch (error) {
        console.error('Error getting user from cookie:', error);
      }
    }
    
    if (!effectiveGroupId) {
      throw new Error("GroupId is missing");
    }
    
    const response = await httpHomePlus.get(
      `/staffs/get-all-staff-status-ready/${effectiveGroupId}`,
    );
    console.log("Full API response:", response);
    
    // Check if response.payload exists and convert to array if it's an object
    if (response.payload) {
      if (!Array.isArray(response.payload)) {
        // If it's a single object, wrap it in an array
        return [response.payload];
      }
      return response.payload;
    }
    
    // Return empty array as fallback
    return [];
  } catch (error) {
    console.error("Error fetching staff status ready:", error);
    throw error;
  }
};


