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

export const updateTask = async (taskId: string, taskData: any) => {
  const response = await httpVinLaundry.put(`/tasks/${taskId}`, taskData);
  return response;
};