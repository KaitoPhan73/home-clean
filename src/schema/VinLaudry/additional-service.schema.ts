import { BaseSchema } from "@/schema/base-schema";
import z from "zod";

export const AdditionalServiceSchema = BaseSchema.extend({
  id: z.string().uuid({ message: "ID phải là một UUID hợp lệ." }),
  serviceCode: z.string().min(1, { message: "Mã dịch vụ không được trống." }),
  name: z.string().min(1, { message: "Tên dịch vụ không được trống." }),
  description: z.string().nullable(),
  price: z.number().nonnegative({ message: "Giá phải là số không âm." }),
  priceType: z.string().nullable(),
  appliesTo: z.string().nullable(),
  processingTimeAdjustment: z.number().nullable(),
  status: z.enum(["Active", "Inactive"], { message: "Trạng thái không hợp lệ." }),
  createdAt: z.string().min(1, { message: "Ngày tạo không được trống." }),
  updatedAt: z.string().min(1, { message: "Ngày cập nhật không được trống." }),
});

export const AdditionalServiceCreateSchema = z.object({
  serviceCode: z.string({ message: "Mã dịch vụ phải là chuỗi ký tự." }),
  name: z.string({ message: "Tên dịch vụ phải là chuỗi ký tự." }),
  description: z.string({ message: "Mô tả phải là chuỗi ký tự." }),
  price: z.number({ message: "Điểm phải là số." }),
  processingTimeAdjustment: z.number({ message: "Thời gian xử lý phải là số." }),
});

export type TAdditionalServiceResponse = z.TypeOf<typeof AdditionalServiceSchema>;
export type TAdditionalServiceCreateRequest = z.TypeOf<typeof AdditionalServiceCreateSchema>;
