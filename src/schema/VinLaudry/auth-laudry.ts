import { z } from "zod";

export const LoginLaundrySchema = z
    .object({
        phoneNumber: z.string().min(1, {
            message: "Số điện thoại không được trống.",
        }),
        password: z.string().min(1, {
            message: "Mật khẩu không được trống.",
        }),
    })
    .strict();

export const AuthLaundryResponseSchema = z.object({
    accessToken: z.string().min(1, { message: "Access token không được trống." }),
    refreshToken: z.string().min(1, { message: "Refresh token không được trống." }),
    userId: z.string().min(1, { message: "User ID không được trống." }),
    fullName: z.string().min(1, { message: "Họ và tên không được trống." }),
    status: z.enum(["Active", "InActive", "Banned"]).default("Active"),
    role: z.enum(["Manager", "Admin", "Staff"]).default("Manager"),
    groupId: z.string().optional(),
});

export type TLoginLaundryRequest = z.infer<typeof LoginLaundrySchema>;
export type TAuthLaundryResponse = z.infer<typeof AuthLaundryResponseSchema>;