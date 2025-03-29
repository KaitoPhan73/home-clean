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
  phoneNumber: z.string()
    .min(10, { message: "Số điện thoại phải có ít nhất 10 ký tự." })
    .max(15, { message: "Số điện thoại không quá 15 ký tự." })
    .regex(/^[0-9]+$/, { message: "Số điện thoại chỉ được chứa số." }),
});

export type TUserResponse = z.TypeOf<typeof UserSchema>;