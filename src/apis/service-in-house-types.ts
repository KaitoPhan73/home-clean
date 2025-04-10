/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpHomePlus } from "@/lib/http";
import { TServiceInHouseTypeCreateRequest, TServiceInHouseTypeResponse } from "@/schema/service-in-house-type.schema";
import { TTableResponse } from "@/types/Table";
import { cookies } from "next/headers";

// Helper function to get token from cookies for server components
const getServerToken = async () => {
  return (await cookies()).get("token")?.value;
};

// Add token to request headers
const addAuthHeader = (token?: string) => {
  if (!token) return {};
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAllServiceInHouseTypes = async (params?: any) => {
  const response = await httpHomePlus.get<TTableResponse<TServiceInHouseTypeResponse>>(
    `/service-in-house-types`,
    {
      params,
    }
  );
  return response;
};


export const createServiceInHouseTypes = async (data: TServiceInHouseTypeCreateRequest, token?: string) => {
  try {
    const authToken = token || await getServerToken();
    
    const response = await httpHomePlus.post(
      `/service-in-house-types`,
      data,
      {
        ...addAuthHeader(authToken),
      }
    );
    console.log("createServiceInHouseTypes Response:", response);
    return response;
  } catch (error: any) {
    console.error("Error in createServiceInHouseTypes:", error.message);
    throw error;
  }
};

