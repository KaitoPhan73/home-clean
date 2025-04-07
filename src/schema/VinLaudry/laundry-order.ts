import { BaseSchema } from "@/schema/base-schema";
import { z } from "zod";

const ItemTypeResponseSchema = z.object({
  id: z.string().uuid(),
  itemCode: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  defaultPrice: z.number(),
  pricePerItem: z.number().nullable(),
  pricePerKg: z.number().nullable(),
  imageUrl: z.string().nullable(),
});

const OrderDetailByItemSchema = z.object({
  id: z.string().uuid(),
  itemTypeId: z.string().uuid(),
  quantity: z.number(),
  weight: z.number(),
  unitPrice: z.number(),
  subtotal: z.number(),
  notes: z.string().nullable(),
  actualWeight: z.number().nullable(),
  estimatedTime: z.string().nullable(),
  actualCompletionTime: z.string().nullable(),
  itemTypeResponse: ItemTypeResponseSchema,
});

const OrderDetailByKgSchema = z.object({
  id: z.string().uuid(),
  itemTypeId: z.string().uuid(),
  quantity: z.number().optional(),
  weight: z.number(),
  unitPrice: z.number(),
  subtotal: z.number().nullable(),
  notes: z.string().nullable(),
  actualWeight: z.number().nullable(),
  estimatedTime: z.string().nullable(),
  actualCompletionTime: z.string().nullable(),
  itemTypeResponse: ItemTypeResponseSchema.optional(),
});

const AdditionalServiceSchema = z.object({
  id: z.string().uuid(),
  serviceCode: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
});

export const OrderLaundrySchema = BaseSchema.extend({
  id: z.string().uuid(),
  orderCode: z.string().min(1),
  name: z.string().min(1),
  userId: z.string().uuid(),
  balance: z.number().nullable(),
  currency: z.string().nullable(),
  type: z.string().min(1),
  extraField: z.string().min(1),
  totalAmount: z.number().nullable(),
  discountAmount: z.number().nullable(),
  orderDate: z.string().datetime(),
  deliveryDate: z.string().datetime().nullable(),
  status: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  estimatedCompletionTime: z.string().datetime().nullable(),
  appliedDiscountId: z.string().uuid().nullable(),
  orderAdditionalServicesResponse: z.array(AdditionalServiceSchema),
  orderDetailsByKg: z.array(OrderDetailByKgSchema),
  orderDetailsByItem: z.array(OrderDetailByItemSchema),
});

export type TOrderLaundryResponse = z.infer<typeof OrderLaundrySchema>;