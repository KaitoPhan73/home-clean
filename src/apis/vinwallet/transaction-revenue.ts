'use server';

import { DailyTransactionStat, DashboardOverview, DateRangeParams, MonthlyTransactionDetail, PaymentMethodStat, TopUser, TransactionCategoryStat, TransactionStats, WalletTypeDetail } from "@/app/(dashboard)/admin/transaction-revenue/types/transaction";
import { httpVinWallet } from "@/lib/http";

export const getDashboardOverview = async (params: DateRangeParams) => {
  const response = await httpVinWallet.get<DashboardOverview>(
    "/transactions/admin-dashboard-overview",
    { params }
  );
  return response;
};

export const getTransactionStats = async (params: DateRangeParams) => {
  const response = await httpVinWallet.get<TransactionStats>(
    "/transactions/admin-transaction-stats",
    { params }
  );
  return response;
};

export const getDailyTransactionStats = async (params: DateRangeParams) => {
  const response = await httpVinWallet.get<DailyTransactionStat[]>(
    "/transactions/daily-transaction-stats",
    { params }
  );
  return response;
};

export const getTopUsers = async (params: DateRangeParams) => {
  const response = await httpVinWallet.get<TopUser[]>(
    "/transactions/top-users",
    { params }
  );
  return response;
};

export const getWalletTypeStats = async (params: DateRangeParams) => {
  const response = await httpVinWallet.get<WalletTypeDetail[]>("/transactions/wallet-type-stats", { params });
  return response;
};

export const getMonthlyTransactionTrend = async (params: DateRangeParams) => {
  const response = await httpVinWallet.get<MonthlyTransactionDetail[]>("/transactions/monthly-transaction-trend", { params });
  return response;
};

export const getPaymentMethodStats = async (params: DateRangeParams) => {
  const response = await httpVinWallet.get<PaymentMethodStat[]>(
    "/transactions/payment-method-stats",
    { params }
  );
  return response;
};

export const getTransactionCategoryStats = async (params: DateRangeParams) => {
  const response = await httpVinWallet.get<TransactionCategoryStat[]>(
    "/transactions/transaction-category-stats",
    { params }
  );
  return response;
};