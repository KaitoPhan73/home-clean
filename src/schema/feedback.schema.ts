import { BaseSchema } from "@/schema/base-schema";
import { z } from "zod";

export const FeedbackSchema = BaseSchema.extend({
  id: z.string().uuid(),
  serviceOrderId: z.string().uuid(),
  staffId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comments: z.string().max(500).optional(),
  status: z.string().optional(),
});

export const FeedbackCreateSchema = BaseSchema.extend({
  serviceOrderId: z.string().uuid(),
  staffId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comments: z.string().max(500).optional(),
});

export type TFeedbackRequest = z.infer<typeof FeedbackSchema>;
export type TFeedbackResponse = z.infer<typeof FeedbackSchema>;
export type TFeedbackCreateRequest = z.infer<typeof FeedbackCreateSchema>;
export type TUpdateFeedbackRequest = z.infer<typeof FeedbackSchema>;