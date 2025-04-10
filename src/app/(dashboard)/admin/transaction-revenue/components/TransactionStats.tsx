'use client';

import { TransactionStats } from '@/app/(dashboard)/admin/transaction-revenue/types/transaction';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface TransactionStatsProps {
  data: TransactionStats;
}

export default function TransactionStatsComponent({ data }: TransactionStatsProps) {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  const transactionTypeData = [
    { name: 'Deposit', value: data.depositCount },
    { name: 'Spending', value: data.spendingCount },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Transaction Summary</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Transactions</span>
            <span className="font-semibold">{data.totalTransactions.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Amount</span>
            <span className="font-semibold">${data.totalAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Deposit Transactions</span>
            <span className="font-semibold">{data.depositCount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Spending Transactions</span>
            <span className="font-semibold">{data.spendingCount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Deposit Amount</span>
            <span className="font-semibold">${data.depositAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Spending Amount</span>
            <span className="font-semibold">${data.spendingAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Transaction Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={transactionTypeData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {transactionTypeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [value.toLocaleString(), 'Transactions']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}