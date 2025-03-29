import { BaseSchema } from "@/schema/base-schema";
import { z } from "zod";

export const TransactionSchema = BaseSchema.extend({
  id: z.string().uuid(),
  walletId: z.string().uuid(),
  userId: z.string().uuid(),
  paymentMethodId: z.string().uuid(),
  amount: z.string().regex(/^\d+$/, { message: "Amount must be a numeric string" }),
  type: z.enum(["Spending", "Income"]),
  paymentUrl: z.string().url().nullable().optional(),
  note: z.string().max(255),
  transactionDate: z.string().datetime(),
  status: z.enum(["Success", "Failed", "Pending"]).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  code: z.string().max(255),
  categoryId: z.string().uuid(),
  orderId: z.string().uuid(),
});

export type EnrichedTransaction = TTransactionResponse & {
  userName: string;
  walletName: string;
  paymentMethodName: string;
};

export type TTransactionRequest = z.TypeOf<typeof TransactionSchema>;
export type TTransactionResponse = z.infer<typeof TransactionSchema>;
