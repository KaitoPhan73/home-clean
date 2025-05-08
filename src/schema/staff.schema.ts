import { BaseSchema } from "@/schema/base-schema";
import { z } from "zod";

export const StaffSchema = BaseSchema.extend({
  id: z.string().uuid(),
  fullName: z.string().max(255),
  phoneNumber: z.string().max(20),
  email: z.string().email().max(255),
  gender: z.enum(["Male", "Female", "Other"]),
  dateOfBirth: z.string(), // ISO 8601 format
  address: z.string().max(500),
  hireDate: z.string(), // ISO 8601 format
  jobPosition: z.string().max(255),
  status: z.string().optional(),
  createdAt: z.string(), // ISO 8601 format
  updatedAt: z.string(), // ISO 8601 format
  accountId: z.string().uuid().nullable(),
  groupId: z.string().uuid(),
  code: z.string().max(255),
});

export const StaffStatusSchema = BaseSchema.extend({
  id: z.string().uuid(),
  status: z.string().max(255),
  lastUpdated: z.string().datetime(),
});

export const StaffStatusArraySchema = z.object({
  data: z.array(StaffStatusSchema),
});

export const StaffStatusReadySchema = BaseSchema.extend({
  id: z.string().uuid(),
  status: z.string().max(255),
  lastUpdated: z.string().datetime(),
  fullName: z.string().max(255).optional(),
});

export const StaffCreateSchema = z.object({
  fullName: z.string().max(255),
  phoneNumber: z.string().max(20),
  email: z.string().email().max(255),
  gender: z.enum(["Male", "Female", "Other"]),
  dateOfBirth: z.string(), // ISO 8601
  address: z.string().max(500),
  hireDate: z.string(), // ISO 8601
  jobPosition: z.string().max(255),
  password: z.string().optional(),
  groupId: z.string().uuid(),
  code: z.string().max(255),
});

export const StaffUpdateSchema = z.object({
  fullName: z
    .string()
    .min(1, "Họ tên không được để trống")
    .max(255, "Họ tên không được quá 255 ký tự"),
  phoneNumber: z
    .string()
    .min(1, "Số điện thoại không được để trống")
    .max(20, "Số điện thoại không được quá 20 ký tự"),
  email: z
    .string()
    .email("Email không hợp lệ")
    .max(255, "Email không được quá 255 ký tự"),
  gender: z.enum(["Male", "Female", "Other"], {
    errorMap: () => ({ message: "Giới tính không hợp lệ" }),
  }),
  dateOfBirth: z.string().datetime({
    message: "Ngày sinh không hợp lệ",
  }),
  address: z
    .string()
    .min(1, "Địa chỉ không được để trống")
    .max(500, "Địa chỉ không được quá 500 ký tự"),
  status: z.enum(["Active", "Inactive"], {
    errorMap: () => ({ message: "Trạng thái không hợp lệ" }),
  }),
  groupId: z.string().uuid("ID nhóm không hợp lệ"),
  password: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .max(50, "Mật khẩu không được quá 50 ký tự")
    .optional(),
});

// Type for the update request
export type TStaffUpdateRequest = z.TypeOf<typeof StaffUpdateSchema>;
export type TStaffRequest = z.TypeOf<typeof StaffSchema>;
export type TStaffResponse = z.TypeOf<typeof StaffSchema>;

export type TStaffStatus = z.TypeOf<typeof StaffSchema>;
export type TStaffStatusArrayResponse = z.TypeOf<typeof StaffStatusArraySchema>;
export type TStaffStatusReady = z.TypeOf<typeof StaffStatusReadySchema>;
export type TStaffStatusReadyResponse = z.TypeOf<typeof StaffStatusReadySchema>;
export type TStaffCreateRequest = z.TypeOf<typeof StaffCreateSchema>;
