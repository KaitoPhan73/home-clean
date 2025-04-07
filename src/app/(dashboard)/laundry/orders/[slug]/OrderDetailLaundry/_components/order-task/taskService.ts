/* eslint-disable @typescript-eslint/no-explicit-any */
import { TaskStatusEnum } from "./TaskEnums";
import { taskAssign, getEmployees } from "@/apis/laudry/task";

/**
 * Converts a string status to TaskStatusEnum
 * @param status The string status to convert
 * @returns The corresponding TaskStatusEnum value
 */
export const convertToTaskStatusEnum = (status: string): TaskStatusEnum => {
  switch (status.toLowerCase()) {
    case "pending":
      return TaskStatusEnum.Pending;
    case "in_progress":
    case "inprogress":
      return TaskStatusEnum.InProgress;
    case "completed":
      return TaskStatusEnum.Completed;
    default:
      return TaskStatusEnum.Pending;
  }
};

/**
 * Gets the next task status based on the current status
 * @param currentStatus The current task status
 * @returns The next status in the workflow
 */
export const getNextTaskStatus = (currentStatus: TaskStatusEnum): TaskStatusEnum => {
  switch (currentStatus) {
    case TaskStatusEnum.Pending:
      return TaskStatusEnum.InProgress;
    case TaskStatusEnum.InProgress:
      return TaskStatusEnum.Completed;
    case TaskStatusEnum.Completed:
      return TaskStatusEnum.Completed; // No further status after completed
    default:
      return TaskStatusEnum.Pending;
  }
};

/**
 * Assigns or completes a task
 * @param taskId The ID of the task to update
 * @param employeeId The ID of the employee to assign
 * @param action Either "start" to assign or "complete" to finish the task
 * @returns The API response
 */
export const assignTask = async (
  taskId: string,
  employeeId: string,
  action: "start" | "complete"
): Promise<any> => {
  try {
    if (!taskId) {
      throw new Error("Task ID is required");
    }
    
    if (!employeeId && action === "start") {
      throw new Error("Employee ID is required to start a task");
    }
    
    return await taskAssign(taskId, employeeId, action);
  } catch (error: any) {
    console.error(`Error ${action === "start" ? "starting" : "completing"} task:`, error);
    throw error;
  }
};

// Define the interface for employee data
interface Employee {
  id: string;
  employeeCode: string;
  fullName: string;
  role: string;
  // Add any other fields your employee objects have
}

/**
 * Fetches employees from the API
 * @param params Optional query parameters
 * @param token Authentication token
 * @returns Array of employees
 */
export const getEmployeesService = async (params?: any, token?: string): Promise<Employee[]> => {
  try {
    const responseData = await getEmployees(params, token);
    
    // Type guard to check if responseData is an array
    if (Array.isArray(responseData)) {
      return responseData as Employee[];
    }
    
    // If responseData is an object with a payload property that is an array
    if (responseData && typeof responseData === 'object' && 'payload' in responseData && Array.isArray(responseData.payload)) {
      return responseData.payload as Employee[];
    }
    
    // If responseData is an object with an items property that is an array
    if (responseData && typeof responseData === 'object' && 'items' in responseData && Array.isArray(responseData.items)) {
      return responseData.items as Employee[];
    }
    
    // If we can't find an array in the response, return empty array
    console.warn("Employee response structure unexpected:", responseData);
    return [];
  } catch (error) {
    console.error("Error fetching employees in service:", error);
    throw error;
  }
};