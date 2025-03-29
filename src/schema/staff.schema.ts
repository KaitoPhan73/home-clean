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
  staffId: z.string().uuid(),
  status: z.string().max(255),
  lastUpdated: z.string().datetime(),
});

export const StaffStatusArraySchema = z.object({
  data: z.array(StaffStatusSchema),
});

export const StaffStatusReadySchema = BaseSchema.extend({
  staffId: z.string().uuid(),
  status: z.string().max(255),
  lastUpdated: z.string().datetime(),
  fullName: z.string().max(255).optional(),
});


export type TStaffRequest = z.TypeOf<typeof StaffSchema>;
export type TStaffResponse = z.TypeOf<typeof StaffSchema>;

export type TStaffStatus = z.TypeOf<typeof StaffStatusSchema>;
export type TStaffStatusArrayResponse = z.TypeOf<typeof StaffStatusArraySchema>;
export type TStaffStatusReady = z.TypeOf<typeof StaffStatusReadySchema>;
export type TStaffStatusReadyResponse = z.TypeOf<typeof StaffStatusReadySchema>;
