import z from "zod";

export const LoginSchema = z
  .object({
    phoneNumber: z.string().regex(/^(\+84|0)[0-9]{9,10}$/, {
      message: "Số điện thoại không hợp lệ.",
    }),
    password: z.string().min(1, {
      message: "Mật khẩu không được trống.",
    }),
  })
  .strict();

export const LoginAdminSchema = z
  .object({
    username: z.string().min(1, {
      message: "Tên đăng nhập không được trống.",
    }),
    password: z.string().min(1, {
      message: "Mật khẩu không được trống.",
    }),
  })
  .strict();

export const AuthResponseSchema = z.object({
  accessToken: z.string().min(1, { message: "Access token không được trống." }),
  refreshToken: z
    .string()
    .min(1, { message: "Refresh token không được trống." }),
  userId: z.string().min(1, { message: "User ID không được trống." }),
  fullName: z.string().min(1, { message: "Họ và tên không được trống." }),
  status: z.enum(["Active", "InActive", "Banned"]).default("Active"),
  role: z.enum(["Manager", "Admin", "Staff"]).default("Manager"),
  groupId: z.string().optional(),
});
export type TLoginRequest = z.TypeOf<typeof LoginSchema>;
export type TAuthResponse = z.TypeOf<typeof AuthResponseSchema>;
export type TLoginAdminRequest = z.TypeOf<typeof LoginAdminSchema>;
