"use server";

import { httpVinLaundry } from "@/lib/http";
import { TOrderLaundryResponse } from "@/schema/VinLaudry/laundry-order";

interface WeightSubmissionItem {
  itemTypeId: string;
  weight: number;
}

/**
 * Gets items eligible for weight submission from an order
 * @param orderId The ID of the order
 * @returns The order details with items that can have weight submitted
 */
export const getOrderItemsForWeightSubmission = async (orderId: string) => {
  try {
    const response = await httpVinLaundry.get<TOrderLaundryResponse>(`/orders/${orderId}`);
    
    return {
      orderDetails: response.payload
    };
  } catch (error) {
    console.error("Error fetching order items for weight submission:", error);
    throw error;
  }
};

/**
 * Submits actual weight for items in a laundry order
 * @param orderId The ID of the order
 * @param items Array of items with their weights
 * @returns The API response
 */
export const submitOrderWeight = async (orderId: string, items: WeightSubmissionItem[]) => {
  try {
    // Even if items array is empty, we'll still call the API
    // This handles cases where an order might not have any weight-based items
    const response = await httpVinLaundry.put(`/orders/${orderId}/submit-weight`, items);
    return response;
  } catch (error) {
    console.error("Error submitting order weight:", error);
    throw error;
  }
};