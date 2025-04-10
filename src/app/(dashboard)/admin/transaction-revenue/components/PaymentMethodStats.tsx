/* eslint-disable @typescript-eslint/no-unused-vars */
// PaymentMethodStats.tsx
'use client';

import { PaymentMethodStat } from '@/app/(dashboard)/admin/transaction-revenue/types/transaction';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { PieChart, Pie } from 'recharts';

interface PaymentMethodStatsProps {
  data: PaymentMethodStat[];
}

export default function PaymentMethodStats({ data }: PaymentMethodStatsProps) {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Payment Method Usage</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="paymentMethodName" />
            <YAxis />
            <Tooltip formatter={(value) => [value.toLocaleString(), 'Transactions']} />
            <Legend />
            <Bar dataKey="transactionCount" name="Transaction Count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Success Rate by Payment Method</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="paymentMethodName" />
            <YAxis domain={[0, 100]} />
            <Tooltip formatter={(value) => [`${value}%`, 'Success Rate']} />
            <Legend />
            <Bar dataKey="successRate" name="Success Rate (%)" fill="#10b981">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.successRate > 90 ? '#10b981' : entry.successRate > 70 ? '#facc15' : '#f87171'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}