/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpVinLaundry } from "@/lib/http";
import { TOrderLaundryResponse } from "@/schema/VinLaudry/laundry-order";
import { TTableResponse } from "@/types/Table";

export const getAllOrders = async (params?: any) => {
  const response = await httpVinLaundry.get<TTableResponse<TOrderLaundryResponse>>("/orders", {
    params,
  });
  return { payload: response.payload };
};

export const getOrderById = async (id: string): Promise<TOrderLaundryResponse> => {
  const response = await httpVinLaundry.get<TOrderLaundryResponse>(`/orders/${id}`);
  return response.payload;
};

export const cancelOrder = async (orderId: string, accessToken: string) => {
  try {
    // Truyền headers đúng cách - không trong object body
    const response = await httpVinLaundry.put(`/orders/${orderId}/cancel`, null, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    return { 
      success: true, 
      payload: response.payload 
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Không thể hủy đơn hàng. Vui lòng kiểm tra lại."
    };
  }
};