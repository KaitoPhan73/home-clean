/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { httpVinWallet } from "@/lib/http";
import { TPaymentMethodResponse } from "@/schema/payment-method.schema";
import { TTableResponse } from "@/types/Table";

export const getAllPaymentMethods = async (params?: any) => {
  const response = await httpVinWallet.get<TTableResponse<TPaymentMethodResponse>>(
    `/payment-methods`,
    {
      params,
    }
  );
  return response;
};