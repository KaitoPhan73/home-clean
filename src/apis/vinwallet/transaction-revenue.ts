"use server";

import { DailyTransactionStat, DashboardOverview, DateRangeParams, PaymentMethodStat, TopUser, TransactionCategoryStat, TransactionStats } from "@/app/(dashboard)/admin/transaction-revenue/types/transaction";
import { httpVinWallet } from "@/lib/http";


// Dashboard Overview
export const getDashboardOverview = async (params: DateRangeParams) => {
  const response = await httpVinWallet.get<DashboardOverview>(
    "/transactions/admin-dashboard-overview",
    { params }
  );
  return response;
};

// Transaction Stats
export const getTransactionStats = async (params: DateRangeParams) => {
  const response = await httpVinWallet.get<TransactionStats>(
    "/transactions/admin-transaction-stats",
    { params }
  );
  return response;
};

// Daily Transaction Stats
export const getDailyTransactionStats = async (params: DateRangeParams) => {
  const response = await httpVinWallet.get<DailyTransactionStat[]>(
    "/transactions/daily-transaction-stats",
    { params }
  );
  return response;
};

// Top Users
export const getTopUsers = async (params: DateRangeParams) => {
  const response = await httpVinWallet.get<TopUser[]>(
    "/transactions/top-users",
    { params }
  );
  return response;
};

// Wallet Type Stats
export const getWalletTypeStats = async (params: DateRangeParams) => {
    const response = await httpVinWallet.get<{
      walletType: string;
      transactionType: string;
      walletCount: number;
      transactionCount: number;
      totalAmount: number;
      depositAmount: number;
      spendingAmount: number;
    }[]>("/transactions/wallet-type-stats", { params });
    return response;
  };

// Monthly Transaction Trend
export const getMonthlyTransactionTrend = async (params: DateRangeParams) => {
    const response = await httpVinWallet.get<{
      yearMonth: string;
      transactionType: string;
      transactionCount: number;
      newUserCount: number;
      depositAmount: number;
      spendingAmount: number;
      successRate: number;
    }[]>("/transactions/monthly-transaction-trend", { params });
    return response;
  };

// Payment Method Stats
export const getPaymentMethodStats = async (params: DateRangeParams) => {
  const response = await httpVinWallet.get<PaymentMethodStat[]>(
    "/transactions/payment-method-stats",
    { params }
  );
  return response;
};

// Transaction Category Stats
export const getTransactionCategoryStats = async (params: DateRangeParams) => {
  const response = await httpVinWallet.get<TransactionCategoryStat[]>(
    "/transactions/transaction-category-stats",
    { params }
  );
  return response;
};
