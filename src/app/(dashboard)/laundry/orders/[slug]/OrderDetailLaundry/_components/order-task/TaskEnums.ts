export enum OrderStatusEnum {
    Draft = 0,
    PendingPayment = 1,
    Processing = 2,
    Completed = 3,
    Cancelled = 4,
    Paid = 5,
  } 
  
  export enum TaskStatusEnum {
    Pending = "Pending",
    InProgress = "InProgress",
    Completed = "Completed",
    Canceled = "Canceled"
  }
  
  export interface Task {
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
    status: TaskStatusEnum;
    createdAt: string;
    updatedAt: string;
    employeeName: string | null;
    managerName: string | null;
  }