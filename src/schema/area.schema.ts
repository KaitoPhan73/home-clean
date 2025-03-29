import { BaseSchema } from "@/schema/base-schema";
import z from "zod";

// Schema cho Area
export const AreaResponseSchema = BaseSchema.extend({
  id: z.string().uuid(),
  name: z.string().min(1, { message: "Tên khu vực không được trống." }),
  hubId: z.string().min(1, { message: "Hub ID không được trống." }),
  code: z.string().min(1, { message: "Mã khu vực không được trống." }),
  status: z.string().min(1, { message: "Trạng thái không được trống." }),
  description: z.string().optional(),
  address: z.string().min(1, { message: "Địa chỉ không được trống." }),
  contactInfo: z
    .string()
    .min(1, { message: "Thông tin liên hệ không được trống." }),
  areaType: z.string().min(1, { message: "Loại khu vực không được trống." }),
})


export const CreateAreaSchema = z.object({
  name: z.string().min(1, { message: "Tên khu vực không được trống." }),
  hubId: z.string().min(1, { message: "Hub ID không được trống." }),
  code: z.string().min(1, { message: "Mã khu vực không được trống." }),
  description: z.string().optional(),
  address: z.string().min(1, { message: "Địa chỉ không được trống." }),
  contactInfo: z
    .string()
    .min(1, { message: "Thông tin liên hệ không được trống." }),
  areaType: z.string().min(1, { message: "Loại khu vực không được trống." }),
});

// Types
export type TAreaResponse = z.TypeOf<typeof AreaResponseSchema>;
export type TCreateAreaRequest = z.TypeOf<typeof CreateAreaSchema>;
export type TUpdateAreaRequest = z.TypeOf<typeof AreaResponseSchema>;
