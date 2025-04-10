/* eslint-disable @typescript-eslint/no-explicit-any */
import { EmployeRealTimeStatus, getEmployeesRealTimeStatus } from "@/apis/laudry/employee";
import { TaskStatusEnum } from "./TaskEnums";
import { taskAssign } from "@/apis/laudry/task";

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
      return TaskStatusEnum.Completed;
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

/**
 * Fetches employees real-time status from the API
 * @param params Optional query parameters
 * @param token Authentication token
 * @returns Array of employees (EmployeRealTimeStatus)
 */
export const getEmployeesService = async (
  params?: any,
): Promise<EmployeRealTimeStatus[]> => {
  try {
    const responseData = await getEmployeesRealTimeStatus(params);

    if (Array.isArray(responseData)) {
      return responseData.map((employee: EmployeRealTimeStatus) => ({
        id: employee.id,
        staffCode: employee.staffCode || "",
        staffName: employee.staffName || "",
        status: employee.status || "Unknown",
        lastUpdated: employee.lastUpdated || "",
      }));
    }

    if (responseData && typeof responseData === "object") {
      const items = (responseData as any).payload?.items || (responseData as any).items || [];

      if (Array.isArray(items)) {
        return items.map((employee: EmployeRealTimeStatus) => ({
          id: employee.id,
          staffCode: employee.staffCode || "",
          staffName: employee.staffName || "",
          status: employee.status || "Unknown",
          lastUpdated: employee.lastUpdated || "",
        }));
      }
    }

    console.warn("Employee response structure unexpected:", responseData);
    return [];
  } catch (error) {
    console.error("Error fetching employees in service:", error);
    throw error;
  }
};
