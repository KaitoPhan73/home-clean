export type DateRangeParams = {
  fromDate: string;
  toDate: string;
  transactionType?: 'Deposit' | 'Spending' | 'Refund';
};

export type DashboardOverview = {
  fromDate: string;
  toDate: string;
  transactionType: string | null;
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

export type TopUser = {
  userId: string;
  username: string;
  transactionCount: number;
  totalAmount: number;
  lastTransactionDate: string;
  transactionType: string;
};

export type WalletTypeStat = {
  walletTypeId: string;
  walletTypeName: string;
  walletCount: number;
  transactionCount: number;
  totalBalance: number;
  averageBalance: number;
};

export type MonthlyTransactionTrend = {
  month: string;
  year: number;
  transactionCount: number;
  totalAmount: number;
  growthRate: number;
};

export type MonthlyTransactionDetail = {
  yearMonth: string;
  transactionType: string;
  transactionCount: number;
  newUserCount: number;
  depositAmount: number;
  spendingAmount: number;
  successRate: number;
};

export type WalletTypeDetail = {
  walletType: string;
  transactionType: string;
  walletCount: number;
  transactionCount: number;
  totalAmount: number;
  depositAmount: number;
  spendingAmount: number;
};

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

export type TransactionCategoryStat = {
  categoryId: string;
  categoryName: string;
  transactionType: string;
  transactionCount: number;
  totalAmount: number;
  averageAmount: number;
};