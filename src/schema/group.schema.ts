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
  serviceIds: z.string().uuid(), 
});

export const GroupCreateSchema = BaseSchema.extend({
  name: z.string().max(255),
  code: z.string().max(255),
  areaId: z.string().uuid(),
  managerId: z.string().uuid(),
  clusterIds: z.array(z.string().uuid()).min(1).optional(), 
  serviceId: z.string().uuid().optional(),
});

export type TGroupRequest = z.TypeOf<typeof GroupSchema>;
export type TGroupResponse = z.TypeOf<typeof GroupSchema>;
export type TGroupCreateRequest = z.TypeOf<typeof GroupCreateSchema>;
export type TUpdateGroupRequest = z.TypeOf<typeof GroupSchema>;