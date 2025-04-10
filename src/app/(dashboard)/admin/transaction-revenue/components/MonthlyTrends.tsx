'use client';

import { Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';

interface MonthlyTransactionTrendProps {
  data: {
    yearMonth: string;
    transactionType: string;
    transactionCount: number;
    newUserCount: number;
    depositAmount: number;
    spendingAmount: number;
    successRate: number;
  }[];
}

export default function MonthlyTransactionTrends({ data }: MonthlyTransactionTrendProps) {
  // Format the month labels for better display
  const formattedData = data.map(item => ({
    ...item,
    month: new Date(item.yearMonth + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }));

  return (
    <div className="grid grid-cols-1 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Monthly User Growth</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [value.toLocaleString(), 'Users']} />
            <Legend />
            <Bar dataKey="newUserCount" name="New Users" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Monthly Transaction Analysis</h3>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="transactionCount" name="Transaction Count" fill="#8884d8" />
            <Bar yAxisId="left" dataKey="depositAmount" name="Deposit Amount" fill="#82ca9d" stackId="a" />
            <Bar yAxisId="left" dataKey="spendingAmount" name="Spending Amount" fill="#ffc658" stackId="a" />
            <Line yAxisId="right" type="monotone" dataKey="successRate" name="Success Rate (%)" stroke="#ff7300" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Monthly Financial Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Month</th>
                <th className="px-6 py-3">Transactions</th>
                <th className="px-6 py-3">New Users</th>
                <th className="px-6 py-3">Deposit</th>
                <th className="px-6 py-3">Spending</th>
                <th className="px-6 py-3">Success Rate</th>
              </tr>
            </thead>
            <tbody>
              {formattedData.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 font-medium">{item.month}</td>
                  <td className="px-6 py-4">{item.transactionCount.toLocaleString()}</td>
                  <td className="px-6 py-4">{item.newUserCount.toLocaleString()}</td>
                  <td className="px-6 py-4">${item.depositAmount.toLocaleString()}</td>
                  <td className="px-6 py-4">${item.spendingAmount.toLocaleString()}</td>
                  <td className="px-6 py-4">{item.successRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}