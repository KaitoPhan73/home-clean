/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { httpHomePlus, httpVinLaundry, httpVinWallet } from "@/lib/http";
import { TAuthResponse, TLoginAdminRequest, TLoginRequest } from "@/schema/auth.schema";
import { TAuthLaundryResponse, TLoginLaundryRequest } from "@/schema/VinLaudry/auth-laudry";

export const checkLoginManager = async (data: TLoginRequest, p0?: { signal: AbortSignal; }) => {
  const response = await httpHomePlus.post<TAuthResponse>(
    `/auth/login-manager`,
    data
  );
  console.log("login homeplus Response:", response);
  return response;
};

export const checkLoginManagerLaudry = async (data: TLoginLaundryRequest, p0?: { signal: AbortSignal; }) => {
  const response = await httpVinLaundry.post<TAuthLaundryResponse>(
    `/auth/login`,
    data
  );
  console.log("login laundry Response:", response);
  return response;
};

export const checkLoginAdmin = async (data: TLoginAdminRequest, p0?: { signal: AbortSignal; }) => {
  const response = await httpVinWallet.post<TAuthResponse>(
    `/auth/admin/login`,
    data
  );
  console.log("login Response:", response);
  return response;
};
