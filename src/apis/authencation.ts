/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { httpHomePlus, httpVinWallet } from "@/lib/http";
import { TAuthResponse, TLoginAdminRequest, TLoginRequest } from "@/schema/auth.schema";

export const checkLoginManager = async (data: TLoginRequest) => {
  const response = await httpHomePlus.post<TAuthResponse>(
    `/auth/login-manager`,
    data
  );
  console.log("login Response:", response);
  return response;
};

export const checkLoginAdmin = async (data: TLoginAdminRequest) => {
  const response = await httpVinWallet.post<TAuthResponse>(
    `/auth/admin/login`,
    data
  );
  console.log("login Response:", response);
  return response;
};

export const checkLoginStaff = async (data: TLoginRequest) => {
  const response = await httpHomePlus.post<TAuthResponse>(
    `/auth/login-staff`,
    data
  );
  console.log("login Response:", response);
  return response;
};

// export const checkLoginUser = async (data: TLoginRequest) => {
//   const response = await httpHomePlus.post<TAuthResponse>(
//     `/auth/login-user`,
//     data
//   );
//   console.log("login Response:", response);
//   return response;
// };
