// Overview.tsx
'use client';

import { DashboardOverview } from '@/app/(dashboard)/admin/transaction-revenue/types/transaction';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface OverviewProps {
  data: DashboardOverview;
}

export default function Overview({ data }: OverviewProps) {
  const transactionStatusData = [
    { name: 'Successful', value: data.successfulTransactions },
    { name: 'Failed', value: data.failedTransactions },
    { name: 'Pending', value: data.pendingTransactions },
  ];

  const financialData = [
    { name: 'Deposit', value: data.totalDeposit },
    { name: 'Spending', value: data.totalSpending },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Key metrics */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">User & Wallet Stats</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Users</span>
            <span className="font-semibold">{data.totalUsers.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Wallets</span>
            <span className="font-semibold">{data.totalWallets.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Wallets per User</span>
            <span className="font-semibold">
              {(data.totalUsers ? data.totalWallets / data.totalUsers : 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Transaction status */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Transaction Status</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={transactionStatusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Financial Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Financial Overview</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={financialData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
            <Bar dataKey="value" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}