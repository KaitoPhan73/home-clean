export interface TContributionResponse {
  totalContribution: number;
  timeFrame: string;
  members: {
    name: string;
    contribution: number;
    percentage: number;
  }[];
}
export interface TTransactionWalletResponse {
  timeSeriesData: {
    timePeriod: string;
    deposit: number;
    spending: number;
    refund: number;
    withdraw: number;
  }[];
  statusTotals: {
    pending: number;
    success: number;
    failed: number;
  };
}
