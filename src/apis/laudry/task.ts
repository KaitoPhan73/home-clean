/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpVinLaundry } from "@/lib/http";
import { handleErrorApi } from "@/lib/utils";
import { TTaskResponse } from "@/schema/VinLaudry/task.schema";
import { TTableResponse } from "@/types/Table";

export interface ApiTask {
  id: string;
  taskCode: string;
  orderId: string;
  employeeId: string | null;
  taskName: string;
  description: string | null;
  priority: number;
  startDate: string | null;
  dueDate: string | null;
  completedDate: string | null;
  assignedBy: string | null;
  notes: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  managerName: string | null;
  employeeName: string | null;
}

export interface TasksResponse {
  size: number;
  page: number;
  total: number;
  totalPages: number;
  items: ApiTask[];
}

export const getOrderTasks = async (orderId: string, params?: any) => {
  try {
    const response = await httpVinLaundry.get<TasksResponse>(
      `/orders/${orderId}/tasks`,
      {
        params,
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching order tasks:", error);
    throw error;
  }
};

export const taskAssign = async (taskId: string, employeeId: string, action: "start" | "complete") => {
  try {
    const endpoint = action === "start"
      ? `/tasks/assign`
      : `/tasks/${taskId}/check-out`;

    const requestBody = {
      taskId: taskId,
      employeeId: employeeId
    };

    const response = await httpVinLaundry.put(endpoint, requestBody);
    return response;
  } catch (error: any) {
    console.error(`Error ${action}ing task:`, error);
    const apiError = error.response?.data;
    if (apiError?.description) {
      handleErrorApi({
        error: new Error(apiError.description), 
      });
    } else {
      handleErrorApi({ error });
    }
    throw error; 
  }
};

export const getEmployeesRealTimeStatus = async (params?: any, token?: string) => {
  try {
    const config: any = {};
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`
      };
    }

    const response = await httpVinLaundry.get('/employees/real-time-status', {
      params,
      ...config
    });

    return response.payload;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

export const getAllTasks = async (params?: any) => {
  const response = await httpVinLaundry.get<TTableResponse<TTaskResponse>>("/tasks", {
    params,
  });
  return { payload: response.payload };
};

export const getTaskById = async (id: string) => {
  const response = await httpVinLaundry.get<TTaskResponse>(`/tasks/${id}`);
  return response;
};