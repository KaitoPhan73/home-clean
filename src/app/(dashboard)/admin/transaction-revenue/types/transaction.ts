// Common date range params for all API calls
export type DateRangeParams = {
    fromDate: string;
    toDate: string;
    type: 'day' | 'week' | 'month' | 'year';
  };
  
  // Dashboard Overview
  export type DashboardOverview = {
    fromDate: string;
    toDate: string;
    transactionType: string;
    totalTransactions: number;
    totalAmount: number;
    totalUsers: number;
    totalWallets: number;
    totalDeposit: number;
    totalSpending: number;
    successfulTransactions: number;
    failedTransactions: number;
    pendingTransactions: number;
  };
  
  // Transaction Stats
  export type TransactionStats = {
    startDate: string;
    endDate: string;
    transactionType: string;
    totalTransactions: number;
    totalAmount: number;
    depositCount: number;
    spendingCount: number;
    depositAmount: number;
    spendingAmount: number;
    statusDistribution: StatusDistribution[];
  };
  
  export type StatusDistribution = {
    status: string;
    count: number;
    percentage: number;
  };
  
  // Daily Transaction Stats
  export type DailyTransactionStat = {
    date: string;
    transactionType: string;
    transactionCount: number;
    depositAmount: number;
    spendingAmount: number;
    successCount: number;
    failedCount: number;
    pendingCount: number;
  };
  
  // Top Users
  export type TopUser = {
    userId: string;
    username: string;
    transactionCount: number;
    totalAmount: number;
    lastTransactionDate: string;
  };
  
  // Wallet Type Stats
  export type WalletTypeStat = {
    walletTypeId: string;
    walletTypeName: string;
    walletCount: number;
    transactionCount: number;
    totalBalance: number;
    averageBalance: number;
  };
  
  // Monthly Transaction Trend
  export type MonthlyTransactionTrend = {
    month: string;
    year: number;
    transactionCount: number;
    totalAmount: number;
    growthRate: number;
  };
  
  // Payment Method Stats
  export type PaymentMethodStat = {
    paymentMethodId: string;
    paymentMethodName: string;
    transactionType: string;
    transactionCount: number;
    totalAmount: number;
    successCount: number;
    failedCount: number;
    successRate: number;
  };
  
  // Transaction Category Stats
  export type TransactionCategoryStat = {
    categoryId: string;
    categoryName: string;
    transactionType: string;
    transactionCount: number;
    totalAmount: number;
    averageAmount: number;
  };