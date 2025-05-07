/* eslint-disable @typescript-eslint/no-explicit-any */
import { EmployeRealTimeStatus, getEmployeesRealTimeStatus } from "@/apis/laudry/employee";
import { TaskStatusEnum, OrderStatusEnum } from "./TaskEnums";
import { httpVinLaundry } from "@/lib/http";
import { handleErrorApi } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

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
 * Checks if task can be processed based on order status
 * @param orderStatus Current order status
 * @param taskIndex Task index in the workflow
 * @returns Object containing validation result and error message if applicable
 */
export const validateTaskAction = (
  orderStatus: OrderStatusEnum, 
  taskIndex: number,
  taskStatus: TaskStatusEnum
): { valid: boolean; message?: string } => {
  // Order is cancelled - all tasks are locked
  if (orderStatus === OrderStatusEnum.Cancelled) {
    return { 
      valid: false, 
      message: "Không thể thực hiện hành động này. Đơn hàng đã bị hủy."
    };
  }
  
  // Task is not first and order is not paid
  if (taskIndex > 0 && orderStatus !== OrderStatusEnum.Paid && orderStatus !== OrderStatusEnum.Completed) {
    return { 
      valid: false, 
      message: "Đơn hàng chưa thanh toán. Vui lòng thanh toán trước khi tiếp tục."
    };
  }

  // Task is already completed
  if (taskStatus === TaskStatusEnum.Completed) {
    return {
      valid: false,
      message: "Công việc này đã hoàn thành."
    };
  }

  // Task is cancelled
  if (taskStatus === TaskStatusEnum.Canceled) {
    return {
      valid: false,
      message: "Công việc này đã bị hủy."
    };
  }

  return { valid: true };
};

/**
 * Assigns or completes a task
 * @param taskId The ID of the task to update
 * @param employeeId The ID of the employee to assign
 * @param action Either "start" to assign or "complete" to finish the task
 * @param orderStatus Current order status for validation
 * @param taskIndex Task index in the workflow
 * @returns The API response
 */
export const assignTask = async (
  taskId: string,
  employeeId: string,
  action: "start" | "complete",
  orderStatus?: OrderStatusEnum,
  taskIndex?: number,
  taskStatus?: TaskStatusEnum
): Promise<any> => {
  try {
    if (!taskId) {
      throw new Error("Task ID is required");
    }

    if (!employeeId && action === "start") {
      throw new Error("Employee ID is required to start a task");
    }

    // Validate task action if orderStatus and taskIndex are provided
    if (orderStatus !== undefined && taskIndex !== undefined && taskStatus !== undefined) {
      const validation = validateTaskAction(orderStatus, taskIndex, taskStatus);
      if (!validation.valid) {
        throw new Error(validation.message);
      }
    }

    return await taskAssign(taskId, employeeId, action);
  } catch (error: any) {
    console.error(`Error ${action === "start" ? "starting" : "completing"} task:`, error);
    if (error.message) {
      // Show error message directly if we have a custom message
      toast({
        title: "Không thể thực hiện",
        description: error.message,
        variant: "destructive",
      });
    } else {
      // Let handleErrorApi handle API errors
      handleErrorApi({
        error,
      });
    }
    throw error;
  }
};

/**
 * Makes API call to assign or complete a task
 * @param taskId Task ID
 * @param employeeId Employee ID
 * @param action Action to perform (start or complete)
 * @returns API response
 */
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
    
    // Handle specific error message for unpaid orders
    if (error.response?.data?.description === "Đơn hàng chưa thanh toán") {
      throw new Error("Đơn hàng chưa thanh toán. Vui lòng thanh toán trước khi tiếp tục.");
    }
    
    // Handle other API errors
    const apiError = error.response?.data;
    if (apiError?.description) {
      throw new Error(apiError.description);
    } else {
      throw error;
    }
  }
};

/**
 * Fetches employees real-time status from the API
 * @param params Optional query parameters
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