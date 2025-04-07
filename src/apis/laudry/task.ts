/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpVinLaundry } from "@/lib/http";

export interface ApiTask {
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
  } catch (error) {
    console.error(`Error ${action}ing task:`, error);
    throw error;
  }
};

export const getEmployees = async (params?: any, token?: string) => {
  try {
    // Configure headers with token if provided
    const config: any = {};
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`
      };
    }
    
    const response = await httpVinLaundry.get('/employees', {
      params,
      ...config
    });
    
    return response.payload;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};