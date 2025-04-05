import { z } from "zod";
import { BaseSchema } from "./base-schema";

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
  id: z.string().uuid({ message: "ID không hợp lệ." }),
  orderCode: z.string().min(1, { message: "Mã đơn hàng không được để trống." }),
  name: z.string().min(1, { message: "Tên không được để trống." }),
  userId: z.string().uuid({ message: "ID người dùng không hợp lệ." }),
  balance: z.number().nullable(),
  currency: z.string().nullable(),
  type: z.string().min(1, { message: "Loại đơn hàng không được để trống." }),
  extraField: z.string().min(1, { message: "Trường bổ sung không được để trống." }),
  totalAmount: z.number().nullable(),
  discountAmount: z.number().nullable(),
  orderDate: z.string().datetime({ message: "Ngày đặt hàng không hợp lệ." }),
  deliveryDate: z.string().datetime({ message: "Ngày giao hàng không hợp lệ." }).nullable(),
  status: z.string(),
  createdAt: z.string().datetime({ message: "Thời gian tạo không hợp lệ." }),
  updatedAt: z.string().datetime({ message: "Thời gian cập nhật không hợp lệ." }),
  estimatedCompletionTime: z.string().datetime({ message: "Thời gian hoàn thành ước tính không hợp lệ." }).nullable(),
  appliedDiscountId: z.string().uuid({ message: "ID mã giảm giá không hợp lệ." }).nullable(),
  orderAdditionalServicesResponse: z.array(AdditionalServiceSchema),
  orderDetailsByKg: z.array(OrderDetailByKgSchema),
  orderDetailsByItem: z.array(OrderDetailByItemSchema),
});

export type TOrderLaundryResponse = z.infer<typeof OrderLaundrySchema>;
