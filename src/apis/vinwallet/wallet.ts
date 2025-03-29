/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { httpVinWallet } from "@/lib/http";
import { TWalletResponse } from "@/schema/wallet.schema";
import { TTableResponse } from "@/types/Table";

export const getAllWallets = async (params?: any) => {
  const response = await httpVinWallet.get<TTableResponse<TWalletResponse>>(
    `/wallets`,
    {
      params,
    }
  );
  return response;
};