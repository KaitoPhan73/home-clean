import { z } from "zod";
import { BaseSchema } from "./base-schema"; // Import base schema

// Service schema kế thừa từ BaseSchema
export const ServiceSchema = BaseSchema.extend({
  id: z.string().uuid({ message: "ID không hợp lệ" }),
  name: z.string().max(255, { message: "Tên dịch vụ không được quá 255 ký tự" }),
  description: z.string().optional(),
  status: z.string().max(20, { message: "Trạng thái không được quá 20 ký tự" }),
  prorityLevel: z.number().int({ message: "Mức độ ưu tiên phải là số nguyên" }),
  price: z.coerce.number().min(0, { message: "Giá không được nhỏ hơn 0" }),
  discount: z.number()
    .min(0, { message: "Giảm giá không được nhỏ hơn 0%" })
    .max(100, { message: "Giảm giá không được lớn hơn 100%" }),
  duration: z.coerce.number().positive({ message: "Thời lượng phải là số nguyên dương" }),
  maxCapacity: z.coerce.number().int().positive({ message: "Sức chứa tối đa phải là số nguyên dương" }),
  serviceCode: z.string().max(50, { message: "Mã dịch vụ không được quá 50 ký tự" }),
  isFeatured: z.boolean({ message: "Dữ liệu phải là true hoặc false" }),
  isAvailable: z.boolean({ message: "Dữ liệu phải là true hoặc false" }),
  createdBy: z.string().nullable(),
  updatedBy: z.string().nullable(),
  serviceCategoryId: z.string().uuid({ message: "ID danh mục không hợp lệ" }),
  code: z.string().max(50, { message: "Mã code không được quá 50 ký tự" }),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// Service Create Schema (Không yêu cầu `id`)
export const ServiceCreateSchema = BaseSchema.extend({
  name: z.string().max(255, { message: "Tên dịch vụ không được quá 255 ký tự" }),
  description: z.string().optional(),
  price: z.coerce.number().min(0, { message: "Giá không được nhỏ hơn 0" }),
  discount: z.coerce.number()
    .min(0, { message: "Giảm giá không được nhỏ hơn 0%" })
    .max(100, { message: "Giảm giá không được lớn hơn 100%" }),
  prorityLevel: z.coerce.number().int().min(0, { message: "Mức độ ưu tiên phải là số nguyên không âm" }),
  duration: z.coerce.number().positive({ message: "Thời lượng phải là số nguyên dương" }),
  maxCapacity: z.coerce.number().int().positive({ message: "Sức chứa tối đa phải là số nguyên dương" }),
  serviceCode: z.string().max(50, { message: "Mã dịch vụ không được quá 50 ký tự" }),
  serviceCategoryId: z.string().uuid({ message: "ID danh mục không hợp lệ" }),
  code: z.string().max(50, { message: "Mã code không được quá 50 ký tự" }),
  base64Image: z.string().optional(),
});


// Tạo các type từ các schema
export type TServiceRequest = z.infer<typeof ServiceSchema>;
export type TServiceResponse = z.infer<typeof ServiceSchema>;
export type TServiceCreateRequest = z.infer<typeof ServiceCreateSchema>;
export type TUpdateServiceRequest = z.infer<typeof ServiceSchema>;
