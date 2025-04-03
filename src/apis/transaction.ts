/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { httpVinWallet } from "@/lib/http";
import { TTransactionResponse } from "@/schema/transaction.schema";
import { TTableResponse } from "@/types/Table";

export const getAllTransactions = async (params?: any) => {
  const response = await httpVinWallet.get<TTableResponse<TTransactionResponse>>(
    `/transactions`,
    {
      params,
    }
  );
  return response;
};

