import { BaseSchema } from "@/schema/base-schema";
import z from "zod";

export const ServiceTypeSchema = BaseSchema.extend({
  id: z.string().uuid(),
  type: z.string().min(1, { message: "Loại dịch vụ không được trống." }),
  name: z.string().min(1, { message: "Tên dịch vụ không được trống." }),
  description: z.string().nullable(),
  status: z.enum(["Active", "Inactive"], { message: "Trạng thái không hợp lệ." }),
  createdAt: z.string().min(1, { message: "Ngày tạo không được trống." }),
  updatedAt: z.string().min(1, { message: "Ngày cập nhật không được trống." }),
});

export type TServiceTypeResponse = z.TypeOf<typeof ServiceTypeSchema>;