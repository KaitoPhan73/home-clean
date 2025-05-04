import { BaseSchema } from "@/schema/base-schema";
import { z } from "zod";

export const GroupSchema = BaseSchema.extend({
  id: z.string().uuid(),
  name: z.string().max(255),
  code: z.string().max(255),
  status: z.string().optional(),
  areaId: z.string().uuid(),
  managerId: z.string().uuid(),
  clusterIds: z.array(z.string().uuid()).nonempty(),
  serviceIds: z.array(z.string().uuid()).nonempty(),
});

export const GroupCreateSchema = BaseSchema.extend({
  name: z.string().max(255),
  code: z.string().max(255),
  areaId: z.string().uuid(),
  managerId: z.string().uuid(),
  clusterIds: z.array(z.string().uuid()).min(1).optional(),
  serviceId: z.string().uuid().optional(),
});

export const GroupUpdateSchema = BaseSchema.extend({
  id: z.string().uuid({
    message: "ID không hợp lệ",
  }),
  name: z
    .string({
      message: "Tên nhóm là bắt buộc",
    })
    .min(4, {
      message: "Tên nhóm phải có ít nhất 4 ký tự",
    })
    .max(255, {
      message: "Tên nhóm không được vượt quá 255 ký tự",
    }),
  code: z
    .string({
      message: "Mã nhóm là bắt buộc",
    })
    .min(5, {
      message: "Mã nhóm phải có ít nhất 5 ký tự",
    })
    .max(255, {
      message: "Mã nhóm không được vượt quá 255 ký tự",
    }),
  status: z
    .string({
      message: "Trạng thái phải là chuỗi",
    })
    .optional(),
  areaId: z
    .string({
      message: "Khu vực là bắt buộc",
    })
    .uuid({
      message: "Khu vực không hợp lệ",
    }),
  managerId: z
    .string({
      message: "Quản lý là bắt buộc",
    })
    .uuid({
      message: "Quản lý không hợp lệ",
    }),
  clusterIds: z
    .array(
      z
        .string({
          message: "Cụm phải là chuỗi",
        })
        .uuid({
          message: "Cụm không hợp lệ",
        })
    )
    .min(1, {
      message: "Vui lòng chọn ít nhất một cụm",
    }),
  serviceId: z
    .string({
      message: "Dịch vụ là bắt buộc",
    })
    .uuid({
      message: "Dịch vụ không hợp lệ",
    }),
});

export type TGroupRequest = z.TypeOf<typeof GroupSchema>;
export type TGroupResponse = z.TypeOf<typeof GroupSchema>;
export type TGroupCreateRequest = z.TypeOf<typeof GroupCreateSchema>;
export type TUpdateGroupRequest = z.TypeOf<typeof GroupUpdateSchema>;
