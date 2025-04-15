import { BaseSchema } from "@/schema/base-schema";
import z from "zod";

export const TaskSchema = BaseSchema.extend({
  id: z.string().uuid(),
  taskCode: z.string().min(1, { message: "Mã nhiệm vụ không được trống." }),
  orderId: z.string().uuid().nullable(),
  employeeId: z.string().uuid().nullable(),
  employeeName: z.string().nullable(),
  taskName: z.string().min(1, { message: "Tên nhiệm vụ không được trống." }),
  description: z.string().nullable(),
  priority: z.string().min(1, { message: "Độ ưu tiên không được trống." }),
  startDate: z.string().nullable(),
  dueDate: z.string().nullable(),
  completedDate: z.string().nullable(),
  assignedBy: z.string().uuid().nullable(),
  managerName: z.string().nullable(),
  notes: z.string().nullable(),
  status: z.string().min(1, { message: "Trạng thái không được trống." }),
  createdAt: z.string().min(1, { message: "Ngày tạo không được trống." }),
  updatedAt: z.string().min(1, { message: "Ngày cập nhật không được trống." }),
});

export const CreateTaskSchema = z.object({
  taskCode: z.string().min(1, { message: "Mã nhiệm vụ không được trống." }),
  orderId: z.string().uuid().nullable(),
  employeeId: z.string().uuid().nullable(),
  taskName: z.string().min(1, { message: "Tên nhiệm vụ không được trống." }),
  description: z.string().nullable(),
  priority: z.string().min(1, { message: "Độ ưu tiên không được trống." }),
  startDate: z.string().nullable(),
  dueDate: z.string().nullable(),
  assignedBy: z.string().uuid().nullable(),
  notes: z.string().nullable(),
  status: z.string().min(1, { message: "Trạng thái không được trống." }),
});

// Types
export type TTaskResponse = z.TypeOf<typeof TaskSchema>;
export type TCreateTaskRequest = z.TypeOf<typeof CreateTaskSchema>;
export type TUpdateTaskRequest = z.TypeOf<typeof TaskSchema>;