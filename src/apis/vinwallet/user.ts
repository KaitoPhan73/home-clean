/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { httpVinWallet } from "@/lib/http";
import { TTransactionResponse } from "@/schema/transaction.schema";
import { TUpdateUserRequest, TUserResponse } from "@/schema/user.schema";
import { TWalletResponse } from "@/schema/wallet.schema";
import { TTableResponse } from "@/types/Table";

export const getAllUsers = async (params?: any) => {
  const response = await httpVinWallet.get<TTableResponse<TUserResponse>>(
    `/users`,
    {
      params,
    }
  );
  console.log("getAllUsers Response:", response);
  return response;
};
export const getWalletsInUser = async (id: string, params?: any) => {
  const response = await httpVinWallet.get<TTableResponse<TWalletResponse>>(
    `/users/${id}/wallets`,
    {
      params,
    }
  );
  return response;
};

export const getTransactionsInUser = async (id: string, params?: any) => {
  const response = await httpVinWallet.get<TTableResponse<TTransactionResponse>>(
    `/users/${id}/transactions`,
    {
      params,
    }
  );
  return response;
};

export const getUserById = async (id: string) => {
  const response = await httpVinWallet.get<TUserResponse>(`/users/${id}`);
  return response;
};

export const createUser = async (data: Partial<TUserResponse>) => {
  const response = await httpVinWallet.post<TUserResponse>(`/users`, data);
  return response;
};

export const updateVerifyUser = async (id: string, data: TUpdateUserRequest) => {
  const response = await httpVinWallet.put<TUpdateUserRequest>(
    `/users/${id}/verify-user`,
    data
  );
  return response;
};

export const updateUser = async (id: string, data: TUpdateUserRequest) => {
  const response = await httpVinWallet.put<TUserResponse>(`/users/${id}`, data);
  return response;
};
