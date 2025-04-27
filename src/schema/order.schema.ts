import { BaseSchema } from "@/schema/base-schema";
import { z } from "zod";

export const OrderSchema = BaseSchema.extend({
  id: z.string().uuid(),
  note: z.string().nullable(),
  price: z.number().nullable(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  address: z.string().uuid(),
  bookingDate: z.string().nullable(),
  employeeId: z.string().uuid().nullable(),
  employeeRating: z.number().nullable(),
  customerFeedback: z.string().nullable(),
  cleaningToolsRequired: z.boolean().nullable(),
  cleaningToolsProvided: z.boolean().nullable(),
  serviceType: z.string().nullable(),
  distanceToCustomer: z.number().nullable(),
  priorityLevel: z.string().nullable(),
  notes: z.string().nullable(),
  discountCode: z.string().nullable(),
  discountAmount: z.number().nullable(),
  totalAmount: z.number(),
  realTimeStatus: z.string().nullable(),
  jobStartTime: z.string().nullable(),
  jobEndTime: z.string().nullable(),
  emergencyRequest: z.boolean(),
  cleaningAreas: z.array(z.string()).default([]),
  itemsToClean: z.array(z.string()).default([]), 
  estimatedArrivalTime: z.string().nullable(),
  estimatedDuration: z.number().nullable(),
  actualDuration: z.number().nullable(),
  cancellationDeadline: z.string().nullable(),
  code: z.string(),
  timeSlotId: z.string().uuid(),
  serviceId: z.string().uuid(),
  userId: z.string().uuid(),
  extraServices: z.array(z.string()).default([]),
  timeSlotDetail: z.string(),
  options: z.array(z.string()).default([]),
});


export const AssignStaffToOrderSchema = BaseSchema.extend({
  orderId: z.string().uuid(),
  staffId: z.string().uuid(),
});

export const SubActivitySchema = z.object({
  activityId: z.string().uuid(),
  title: z.string(),
  estimatedTime: z.string(),
  status: z.enum(["Pending", "InProgress", "Completed"]),
});

export const StepSchema = z.object({
  title: z.string(),
  description: z.string(),
  time: z.string(),
  status: z.enum(["Pending", "InProgress", "Completed"]),
  subActivities: z.array(SubActivitySchema).nullable(),
});

export const TrackingOrderSchema = z.object({
  orderId: z.string().uuid(),
  steps: z.array(StepSchema),
});

export type TOrderRequest = z.TypeOf<typeof OrderSchema>;
export type TOrderResponse = z.TypeOf<typeof OrderSchema>;
export type TAssignStaffToOrderRequest = z.TypeOf<typeof AssignStaffToOrderSchema>;
export type TApproveReOrderUpdateRequest = z.infer<typeof OrderSchema>;
export type TTrackingOrderResponse = z.infer<typeof TrackingOrderSchema>;

