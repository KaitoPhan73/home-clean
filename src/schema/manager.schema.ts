import { BaseSchema } from "@/schema/base-schema";
import { z } from "zod";

export const ManagerSchema = BaseSchema.extend({
  id: z.string().uuid(),
  fullName: z.string().max(255),
  phoneNumber: z.string().max(20),
  email: z.string().email(),
  status: z.enum(["Active", "Inactive"]).optional(),
  code: z.string().max(255),
});

export const ManagerCreateSchema = BaseSchema.extend({
  fullName: z.string().max(255),
  phoneNumber: z.string().max(20),
  email: z.string().email(),
  code: z.string().max(255),
  password: z.string().max(255),
});

export type TManagerRequest = z.TypeOf<typeof ManagerSchema>;
export type TManagerResponse = z.infer<typeof ManagerSchema>;
export type TManagerCreateRequest = z.infer<typeof ManagerCreateSchema>;