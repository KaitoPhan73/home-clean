'use client';

import { TransactionStats } from '@/app/(dashboard)/admin/transaction-revenue/types/transaction';

interface TransactionStatsProps {
  data: TransactionStats;
  transactionType?: 'Deposit' | 'Spending' | 'Refund';
}

export default function TransactionStatsComponent({ data, transactionType }: TransactionStatsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-base font-semibold mb-4">Transaction Statistics</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs text-gray-500">Transaction Type</p>
          <h4 className="text-sm font-bold">{transactionType || 'All'}</h4>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs text-gray-500">Total Transactions</p>
          <h4 className="text-sm font-bold">{data.totalTransactions.toLocaleString()}</h4>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs text-gray-500">Total Amount</p>
          <h4 className="text-sm font-bold">${data.totalAmount.toLocaleString()}</h4>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs text-gray-500">Deposit Count</p>
          <h4 className="text-sm font-bold">{data.depositCount.toLocaleString()}</h4>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs text-gray-500">Spending Count</p>
          <h4 className="text-sm font-bold">{data.spendingCount.toLocaleString()}</h4>
        </div>
      </div>
    </div>
  );
}