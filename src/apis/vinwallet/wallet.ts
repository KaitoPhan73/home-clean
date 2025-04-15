/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { httpVinWallet } from "@/lib/http";
import { TUserResponse } from "@/schema/user.schema";
import { TWalletResponse } from "@/schema/wallet.schema";
import { TTableResponse } from "@/types/Table";
import {
  TContributionResponse,
  TTransactionWalletResponse,
} from "@/types/wallet";
import { revalidateTag } from "next/cache";

export const getAllWallets = async (params?: any) => {
  const response = await httpVinWallet.get<TTableResponse<TWalletResponse>>(
    `/wallets`,
    {
      params,
    }
  );
  return response;
};

export const getUsersInWallet = async (id: string, params?: any) => {
  const response = await httpVinWallet.get<TTableResponse<TUserResponse>>(
    `/wallets/${id}/users-in-sharewallet`,
    {
      params,
      next: {
        tags: [`users-in-wallet-${id}`],
      },
    }
  );
  return response;
};

export const getContributionStatistics = async (id: string, params?: any) => {
  const response = await httpVinWallet.get<TContributionResponse>(
    `/wallets/${id}/contribution-statistics`,
    {
      params,
    }
  );
  return response;
};

export const getWalletById = async (id: string, accessToken: string) => {
  const response = await httpVinWallet.get<TWalletResponse>(`/wallets/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response;
};

export const deleteUserFromWallet = async (
  walletId: string,
  userId: string
) => {
  const response = await httpVinWallet.delete(`/wallets/${walletId}/${userId}`);
  return response;
};

export const changeOwnerWallet = async (walletId: string, userId: string) => {
  const response = await httpVinWallet.patch(
    `/wallets/${walletId}/change-owner/${userId}`,
    {}
  );
  return response;
};

type TBodyWalletStatistics = {
  endDate?: string | undefined;
  startDate?: string | undefined;
  timePeriod?: string | undefined;
  walletId: string;
};
export const getTransactionWalletStatistics = async (
  data: TBodyWalletStatistics
) => {
  console.log("dataCCC", data);

  const response = await httpVinWallet.post<TTransactionWalletResponse>(
    `/transactions/statistics`,
    data
  );

  return response;
};

export const refetchUserInWallet = async (walletId: string) => {
  revalidateTag(`users-in-wallet-${walletId}`);
};
