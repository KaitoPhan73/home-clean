import z from "zod";
import { BaseSchema } from "./base-schema";

export const PaymentMethodSchema = BaseSchema.extend({
  id: z.string().uuid(),
  name: z.string().min(1, { message: "Tên phương thức thanh toán không được trống." }),
  description: z.string().min(1, { message: "Mô tả không được trống." }),
  status: z.enum(["Active", "Inactive", "Suspended"], {
    errorMap: () => ({ message: "Trạng thái phải là Active, Inactive hoặc Suspended" })
  })
});

export type TPaymentMethodResponse = z.TypeOf<typeof PaymentMethodSchema>;