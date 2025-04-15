'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { WalletTypeStat } from '@/app/(dashboard)/admin/transaction-revenue/types/transaction';
import { useMemo } from 'react';

interface WalletTypeStatProps {
  data: WalletTypeStat[];
  transactionType?: 'Deposit' | 'Spending' | 'Refund';
}

export default function WalletTypeStats({ data, transactionType }: WalletTypeStatProps) {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Filter data based on transactionType prop
  const filteredData = useMemo(() => {
    if (!transactionType) {
      return data; // Show all data when transactionType is undefined
    }
    return data.filter(item => item.walletTypeId === transactionType || item.walletTypeName === null);
  }, [data, transactionType]);

  // Format data for charts and table
  const formattedData = useMemo(() => {
    return filteredData.map(item => ({
      ...item,
      walletCount: Number(item.walletCount) || 0,
      transactionCount: Number(item.transactionCount) || 0,
      totalAmount: Number(item.walletCount) || 0,
      depositAmount: Number(item.walletTypeId) || 0,
      spendingAmount: Number(item.averageBalance) || 0,
    }));
  }, [filteredData]);

  if (formattedData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center text-sm text-gray-500">
        No wallet data available for {transactionType || 'all transaction types'}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Wallet Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={formattedData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="walletCount"
              nameKey="walletType"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [value.toLocaleString(), 'Wallets']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Wallet Statistics</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Wallet Type</th>
                <th className="px-6 py-3">Count</th>
                <th className="px-6 py-3">Transactions</th>
                <th className="px-6 py-3">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {formattedData.map((wallet, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 font-medium">{wallet.walletTypeName}</td>
                  <td className="px-6 py-4">{wallet.walletCount.toLocaleString()}</td>
                  <td className="px-6 py-4">{wallet.transactionCount.toLocaleString()}</td>
                  <td className="px-6 py-4">${wallet.totalAmount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 md:col-span-2">
        <h3 className="text-lg font-semibold mb-4">Wallet Type Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="walletType" />
            <YAxis />
            <Tooltip formatter={(value) => [value.toLocaleString(), 'Amount']} />
            <Legend />
            <Bar dataKey="depositAmount" name="Deposit Amount" fill="#10b981" />
            <Bar dataKey="spendingAmount" name="Spending Amount" fill="#f87171" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}