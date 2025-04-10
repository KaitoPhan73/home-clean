// DailyTransactions.tsx
'use client';

import { DailyTransactionStat } from '@/app/(dashboard)/admin/transaction-revenue/types/transaction';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface DailyTransactionsProps {
  data: DailyTransactionStat[];
}

export default function DailyTransactions({ data }: DailyTransactionsProps) {
  // Format dates for better display
  const formattedData = data.map(item => ({
    ...item,
    formattedDate: new Date(item.date).toLocaleDateString()
  }));

  return (
    <div className="grid grid-cols-1 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Daily Transaction Trends</h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="formattedDate" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            <Area 
              yAxisId="left" 
              type="monotone" 
              dataKey="transactionCount" 
              name="Transaction Count" 
              fill="#8884d8" 
              fillOpacity={0.3}
              stroke="#8884d8"
            />
            <Area 
              yAxisId="right" 
              type="monotone" 
              dataKey="depositAmount" 
              name="Deposit Amount ($)" 
              fill="#82ca9d"
              fillOpacity={0.3}
              stroke="#82ca9d"
            />
            <Area 
              yAxisId="right" 
              type="monotone" 
              dataKey="spendingAmount" 
              name="Spending Amount ($)" 
              fill="#ffc658"
              fillOpacity={0.3}
              stroke="#ffc658"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Transaction Status by Day</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="formattedDate" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="successCount" name="Successful" stroke="#4ade80" strokeWidth={2} />
            <Line type="monotone" dataKey="failedCount" name="Failed" stroke="#f87171" strokeWidth={2} />
            <Line type="monotone" dataKey="pendingCount" name="Pending" stroke="#facc15" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}