import { BaseSchema } from "@/schema/base-schema";
import z from "zod";

export const WalletSchema = BaseSchema.extend({
  id: z.string().uuid(),
  name: z.string().min(1, { message: "Tên ví không được trống." }),
  balance: z.number().min(0, { message: "Số dư không được âm." }),
  currency: z.string().min(1, { message: "Loại tiền tệ không được trống." }),
  type: z.enum(["Personal", "Shared"], {
    errorMap: () => ({ message: "Loại ví phải là Personal hoặc Shared" })
  }),
  extraField: z.string().nullable().optional(),
  status: z.string().min(1, { message: "Trạng thái không được trống." }),
  ownerId: z.string().uuid({ message: "Mã chủ sở hữu phải là UUID hợp lệ." })
});

export const CreateWalletSchema = z.object({
  name: z.string().min(1, { message: "Tên ví không được trống." }),
  balance: z.number().nonnegative({ message: "Số dư không được âm." }),
  currency: z.string().min(1, { message: "Tiền tệ không được trống." }),
  type: z.string().min(1, { message: "Loại ví không được trống." }),
  extraField: z.string().optional(),
  ownerId: z.string().min(1, { message: "Mã chủ sở hữu không được trống." }),
});

export type TWalletResponse = z.TypeOf<typeof WalletSchema>;
export type TCreateWalletRequest = z.TypeOf<typeof CreateWalletSchema>;
