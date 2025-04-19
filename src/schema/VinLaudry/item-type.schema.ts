import { BaseSchema } from "@/schema/base-schema";
import { z } from "zod";

export const ItemTypeSchema = BaseSchema.extend({
  id: z.string().uuid(),
  itemCode: z.string().min(1, { message: "Mã mặt hàng không được trống." }),
  name: z.string().min(1, { message: "Tên mặt hàng không được trống." }),
  description: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  defaultPrice: z.number().nonnegative({ message: "Giá mặc định phải là số không âm." }).nullable().optional(),
  pricePerItem: z.number().nonnegative({ message: "Giá theo món phải là số không âm." }).nullable().optional(),
  pricePerKg: z.number().nonnegative({ message: "Giá theo kg phải là số không âm." }).nullable().optional(),
  estimatedProcessTime: z.number().nonnegative({ message: "Thời gian xử lý dự kiến phải là số không âm." }).nullable().optional(),
  imageUrl: z.string().url({ message: "URL hình ảnh không hợp lệ." }).nullable().optional(),
  status: z.enum(["Active", "Inactive"], { message: "Trạng thái không hợp lệ." }),
  minWeight: z.number().nonnegative({ message: "Trọng lượng tối thiểu phải là số không âm." }).nullable().optional(),
  maxWeight: z.number().nonnegative({ message: "Trọng lượng tối đa phải là số không âm." }).nullable().optional(),
  standardProcessingTime: z.number().nonnegative({ message: "Thời gian xử lý tiêu chuẩn phải là số không âm." }).nullable().optional(),
  serviceTypeId: z.string().uuid({ message: "ID loại dịch vụ phải là UUID hợp lệ." }),
  serviceType: z.string().min(1, { message: "Loại dịch vụ không được trống." }),
});

export const ItemTypeCreateSchema = BaseSchema.extend({
  itemCode: z.string().min(1, { message: "Mã mặt hàng không được trống." }),
  name: z.string().min(1, { message: "Tên mặt hàng không được trống." }),
  description: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  defaultPrice: z.number().nonnegative({ message: "Giá mặc định phải là số không âm." }).nullable().optional(),
  pricePerItem: z.number().nonnegative({ message: "Giá theo món phải là số không âm." }).nullable().optional(),
  pricePerKg: z.number().nonnegative({ message: "Giá theo kg phải là số không âm." }).nullable().optional(),
  estimatedProcessTime: z.number().nonnegative({ message: "Thời gian xử lý dự kiến phải là số không âm." }).nullable().optional(),
  imageUrl: z.string().url({ message: "URL hình ảnh không hợp lệ." }).nullable().optional(),
  status: z.enum(["Active", "Inactive"], { message: "Trạng thái không hợp lệ." }).optional(),
  minWeight: z.number().nonnegative({ message: "Trọng lượng tối thiểu phải là số không âm." }).nullable().optional(),
  maxWeight: z.number().nonnegative({ message: "Trọng lượng tối đa phải là số không âm." }).nullable().optional(),
  standardProcessingTime: z.number().nonnegative({ message: "Thời gian xử lý tiêu chuẩn phải là số không âm." }).nullable().optional(),
  serviceTypeId: z.string().uuid({ message: "ID loại dịch vụ phải là UUID hợp lệ." }),
  serviceType: z.string().min(1, { message: "Loại dịch vụ không được trống." }),
});

export type TItemTypeResponse = z.infer<typeof ItemTypeSchema>;
export type TItemTypeRequest = z.infer<typeof ItemTypeSchema>;
export type TItemTypeCreateRequest = z.infer<typeof ItemTypeCreateSchema>;
export type TUpdateItemTypeRequest = z.infer<typeof ItemTypeSchema>;