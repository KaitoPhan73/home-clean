"use client";

import { TTransactionWalletResponse } from "@/types/wallet";
import TransactionStatusChart from "../status-chart/transaction-status-chart";
import TransactionTypeChart from "../type-chart/transaction-type-chart";

export function TransactionChartsCombined({
  data,
}: {
  data: TTransactionWalletResponse;
}) {
  // Transform data for status chart
  const statusData = [
    { status: "Pending", value: data.statusTotals.pending },
    { status: "Success", value: data.statusTotals.success },
    { status: "Failed", value: data.statusTotals.failed },
  ];

  // Transform data for type chart
  const typeData = data.timeSeriesData.map((item) => ({
    month: item.timePeriod,
    Deposit: item.deposit,
    Spending: item.spending,
    Refund: item.refund,
    Withdraw: item.withdraw,
  }));

  return (
    <div className="grid gap-4 grid-cols-6 md:grid-cols-12">
      <div className="col-span-12 md:col-span-6">
        <TransactionStatusChart data={statusData} />
      </div>
      <div className="col-span-12 md:col-span-6">
        <TransactionTypeChart data={typeData} />
      </div>
    </div>
  );
}
