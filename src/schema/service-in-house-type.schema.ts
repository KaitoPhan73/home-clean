import { BaseSchema } from "@/schema/base-schema";
import { z } from "zod";

export const ServiceInHouseTypeSchema = BaseSchema.extend({
  id: z.string().uuid(),
  name: z.string().max(255),
  code: z.string().max(255),
  price: z.number(),
  serviceId: z.string().uuid(),
  serviceName: z.string().max(255),
  houseTypeId: z.string().uuid(),
  houseTypeCode: z.string().max(255),
  houseTypeDescription: z.string().max(255),
});

export const ServiceInHouseTypeCreateSchema = BaseSchema.extend({
    name: z.string().min(1, "Tên không được để trống").max(255),
    code: z.string().min(1, "Mã không được để trống").max(255),
    price: z.number().min(0, "Giá phải lớn hơn hoặc bằng 0"),
    serviceId: z.string().uuid("Service ID không hợp lệ"),
    houseTypeId: z.string().uuid("House Type ID không hợp lệ"),
  });

export type TServiceInHouseTypeRequest = z.TypeOf<typeof ServiceInHouseTypeSchema>;
export type TServiceInHouseTypeResponse = z.TypeOf<typeof ServiceInHouseTypeSchema>;
export type TServiceInHouseTypeCreateRequest = z.TypeOf<
  typeof ServiceInHouseTypeCreateSchema
>;