/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpVinLaundry } from "@/lib/http";
import { TAdditionalServiceCreateRequest, TAdditionalServiceResponse } from "@/schema/VinLaudry/additional-service.schema";
import { TTableResponse } from "@/types/Table";
import { cookies } from "next/headers";

export const getAllAdditionalServices = async (params?: any) => {
  const response = await httpVinLaundry.get<TTableResponse<TAdditionalServiceResponse>>("/additional-services", {
    params,
  });
  return { payload: response.payload };
};

export const getAdditionalServicesById = async (id: string): Promise<TAdditionalServiceResponse> => {
  const response = await httpVinLaundry.get<TAdditionalServiceResponse>(`/additional-services/${id}`);
  return response.payload;
};

export const createAdditionalServiceAction = async (data: any) => {
  const cookieStore =  await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    throw new Response(JSON.stringify({ message: "Không tìm thấy accessToken" }), {
      status: 401,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_VINLAUNDRY_API_ENDPOINT}/additional-service`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Response(JSON.stringify({
        message: errorData.message || "Lỗi tạo dịch vụ bổ sung",
      }), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    return await res.json();
  } catch (error) {
    throw new Response(JSON.stringify({ message: "Lỗi kết nối server" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
