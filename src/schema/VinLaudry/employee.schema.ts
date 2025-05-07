import { BaseSchema } from "@/schema/base-schema";
import z from "zod";

export const EmployeeSchema = BaseSchema.extend({
  id: z.string().uuid(),
  employeeCode: z.string().min(1, { message: "Mã nhân viên không được để trống." }),
  fullName: z.string().min(1, { message: "Họ tên không được để trống." }),
  phone: z.string().min(1, { message: "Số điện thoại không được để trống." }),
  email: z.string().email({ message: "Email không hợp lệ." }),
  position: z.string().nullable(),
  role: z.string().min(1, { message: "Vai trò không được để trống." }),
  hireDate: z.string().min(1, { message: "Ngày tuyển không được để trống." }),
  address: z.string().min(1, { message: "Địa chỉ không được để trống." }),
  status: z.string().min(1, { message: "Trạng thái không được để trống." }),
  createdAt: z.string().min(1, { message: "Ngày tạo không được để trống." }),
  updatedAt: z.string().min(1, { message: "Ngày cập nhật không được để trống." }),
});

export const CreateEmployeeSchema = z.object({
  fullName: z.string().min(1, { message: "Họ tên không được để trống." }),
  phone: z.string().min(1, { message: "Số điện thoại không được để trống." }),
  email: z.string().email({ message: "Email không hợp lệ." }),
  role: z.enum(["Staff", "Manager"], { message: "Vai trò phải là 'Staff' hoặc 'Manager'." }),
  address: z.string().min(1, { message: "Địa chỉ không được để trống." }),
  password: z.string().min(1, { message: "Mật khẩu không được để trống." }),
});

export const ProgressEmployeeSchema = BaseSchema.extend({
  id: z.string().uuid(),
  taskCode: z.string().min(1, { message: "Mã nhiệm vụ không được để trống." }),
  orderId: z.string().uuid(),
  employeeId: z.string().uuid(),
  employeeName: z.string().min(1, { message: "Tên nhân viên không được để trống." }),
  taskName: z.string().min(1, { message: "Tên nhiệm vụ không được để trống." }),
  description: z.string().nullable(),
  priority: z.string().min(1, { message: "Độ ưu tiên không được để trống." }),
  startDate: z.string().min(1, { message: "Ngày bắt đầu không được để trống." }),
  dueDate: z.string().nullable(),
  completedDate: z.string().nullable(),
  assignedBy: z.string().uuid(),
  managerName: z.string().nullable(),
  notes: z.string().nullable(),
  status: z.string().min(1, { message: "Trạng thái không được để trống." }),
});

export const UpdateEmployeeSchema = z.object({
  fullName: z.string().min(1, { message: "Họ tên không được để trống." }),
  phone: z.string().min(1, { message: "Số điện thoại không được để trống." }),
  email: z.string().email({ message: "Email không hợp lệ." }),
  address: z.string().min(1, { message: "Địa chỉ không được để trống." }),
});

export type TProgressEmployeeResponse = z.infer<typeof ProgressEmployeeSchema>;
export type TEmployeeLaundryResponse = z.infer<typeof EmployeeSchema>;
export type TCreateEmployeeRequest = z.infer<typeof CreateEmployeeSchema>;
export type TUpdateEmployeeRequest = z.infer<typeof EmployeeSchema>;



