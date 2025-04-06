/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { httpVinLaundry } from "@/lib/http";
import { TOrderLaundryResponse } from "@/schema/laundry-order";
import { TTableResponse } from "@/types/Table";

interface Task {
  id: string;
  taskCode: string;
  orderId: string;
  employeeId: string | null;
  taskName: string;
  description: string | null;
  priority: string;
  startDate: string | null;
  dueDate: string | null;
  completedDate: string | null;
  assignedBy: string | null;
  notes: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface TasksResponse {
  size: number;
  page: number;
  total: number;
  totalPages: number;
  items: Task[];
}

export const getAllOrders = async (params?: any) => {
  const response = await httpVinLaundry.get<TTableResponse<TOrderLaundryResponse>>(
    `/orders`,
    {
      params,
    }
  );
  return response;
};

export const getOrderTasks = async (orderId: string, params?: any) => {
  const response = await httpVinLaundry.get<TasksResponse>(
    `/orders/${orderId}/tasks`,
    {
      params,
    }
  );
  return response;
};

export const taskAssign = async (taskId: string) => {
  const response = await httpVinLaundry.put(`/tasks/${taskId}/check-out`, {});
  return response;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
// "use server";

// import { httpVinLaundry } from "@/lib/http";
// import { TOrderLaundryResponse } from "@/schema/laundry-order";
// import { TTableResponse } from "@/types/Table";

// // Interfaces
// export interface Task {
//   id: string;
//   taskCode: string;
//   orderId: string;
//   employeeId: string | null;
//   taskName: string;
//   description: string | null;
//   priority: string;
//   startDate: string | null;
//   dueDate: string | null;
//   completedDate: string | null;
//   assignedBy: string | null;
//   notes: string | null;
//   status: string;
//   createdAt: string;
//   updatedAt: string;
//   stepOrder?: number;
// }

// export interface TasksResponse {
//   size: number;
//   page: number;
//   total: number;
//   totalPages: number;
//   items: Task[];
// }

// export interface AssignTaskPayload {
//   taskId: string;
//   employeeId: string;
// }

// // API functions (Server Actions)
// export async function getAllOrders(params?: any) {
//   const response = await httpVinLaundry.get<TTableResponse<TOrderLaundryResponse>>(
//     "/orders",
//     { params }
//   );
//   return response;
// }

// export async function getOrderTasks(orderId: string, params?: any) {
//   const response = await httpVinLaundry.get<TasksResponse>(
//     `/orders/${orderId}/tasks`,
//     { params }
//   );
//   return response;
// }

// export async function updateTask(taskId: string, taskData: any) {
//   const response = await httpVinLaundry.put(`/tasks/${taskId}`, taskData);
//   return response;
// }

// export async function assignTask(payload: AssignTaskPayload) {
//   const response = await httpVinLaundry.put("/tasks/assign", payload);
//   return response;
// }

// // Enum for order status
// export enum OrderStatusEnum {
//   Draft = 0,
//   PendingPayment = 1,
//   Processing = 2,
//   Completed = 3,
//   Cancelled = 4,
//   Paid = 5,
// }