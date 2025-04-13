import { z } from "zod";
import { BaseSchema } from "./base-schema";

export const TimesSlotSchema = BaseSchema.extend({
  id: z.string().uuid(),
  startTime: z.string(), // ✅ đã chuyển thành string
  endTime: z.string(), // ✅ đã chuyển thành string
  description: z.string(),
  status: z.string(),
  code: z.string(),
});

export const TimesSlotCreateSchema = BaseSchema.extend({
  startTime: z.string(),
  endTime: z.string(),
  description: z.string(),
  status: z.string(),
  code: z.string(),
});

export const UpdateTimesSlotSchema = z.object({
  id: z.string().uuid(),
  startTime: z.string(),
  endTime: z.string(),
  description: z.string(),
  status: z.string(),
  code: z.string(),
});

// Types
export type TTimesSlotRequest = z.infer<typeof TimesSlotSchema>;
export type TTimesSlotResponse = z.infer<typeof TimesSlotSchema>;
export type TTimesSlotCreateRequest = z.infer<typeof TimesSlotCreateSchema>;
export type TTimesSlotCreateResponse = z.infer<typeof TimesSlotCreateSchema>;
export type TTimesSlotUpdateRequest = z.infer<typeof UpdateTimesSlotSchema>;
