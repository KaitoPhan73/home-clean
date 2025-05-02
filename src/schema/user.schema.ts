import z from "zod";
import { BaseSchema } from "./base-schema";

export const UserSchema = BaseSchema.extend({
  id: z.string().uuid(),
  fullName: z.string().min(1, { message: "Họ và tên không được trống." }),
  status: z.string().min(1, { message: "Trạng thái không được trống." }),
  houseId: z.string().uuid({ message: "Mã nhà phải là UUID hợp lệ." }),
  extraField: z.string().nullable().optional(),
  username: z.string().min(1, { message: "Tên đăng nhập không được trống." }),
  role: z.string().min(1, { message: "Vai trò không được trống." }),
  email: z.string().email({ message: "Email không hợp lệ." }),
  phoneNumber: z
    .string()
    .min(10, { message: "Số điện thoại phải có ít nhất 10 ký tự." })
    .max(15, { message: "Số điện thoại không quá 15 ký tự." })
    .regex(/^[0-9]+$/, { message: "Số điện thoại chỉ được chứa số." }),
  citizenCode: z
    .string()
    .max(20, { message: "Mã công dân không được vượt quá 20 ký tự." })
    .regex(/^[0-9]*$/, { message: "Mã công dân chỉ được chứa số." })
    .nullable()
    .optional(),
});

export const UserCreateSchema = BaseSchema.extend({
  fullName: z.string().min(1, { message: "Họ và tên không được trống." }),
  username: z.string().min(1, { message: "Tên đăng nhập không được trống." }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự." }),
  buildingCode: z.string().min(1, { message: "Mã tòa nhà không được trống." }),
  houseCode: z.string().min(1, { message: "Mã nhà không được trống." }),
  phoneNumber: z
    .string()
    .min(10, { message: "Số điện thoại phải có ít nhất 10 ký tự." })
    .max(15, { message: "Số điện thoại không quá 15 ký tự." })
    .regex(/^[0-9]+$/, { message: "Số điện thoại chỉ được chứa số." }),
  email: z.string().email({ message: "Email không hợp lệ." }),
  citizenCode: z
    .string()
    .max(20, { message: "Mã công dân không được vượt quá 20 ký tự." })
    .regex(/^[0-9]*$/, { message: "Mã công dân chỉ được chứa số." })
    .nullable()
    .optional(),
});

export const UserUpdateSchema = z.object({
  fullName: z.string().min(1, { message: "Họ và tên không được trống." }),
  email: z.string().email({ message: "Email không hợp lệ." }),
  phoneNumber: z
    .string()
    .min(10, { message: "Số điện thoại phải có ít nhất 10 ký tự." })
    .max(15, { message: "Số điện thoại không quá 15 ký tự." })
    .regex(/^[0-9]+$/, { message: "Số điện thoại chỉ được chứa số." }),
  houseId: z.string().uuid({ message: "Mã nhà phải là UUID hợp lệ." }),
});

export type TUserResponse = z.TypeOf<typeof UserSchema>;
export type TUserRequest = z.infer<typeof UserSchema>;
export type TCreateUserRequest = z.infer<typeof UserCreateSchema>;
export type TUpdateUserRequest = z.infer<typeof UserUpdateSchema>;