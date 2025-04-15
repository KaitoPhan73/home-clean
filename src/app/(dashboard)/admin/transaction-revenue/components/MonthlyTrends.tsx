/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Line } from 'recharts';
import { Filter, Calendar, TrendingUp, Download, DollarSign, Users } from 'lucide-react';

interface MonthlyTransactionTrendProps {
  data: {
    yearMonth: string;
    transactionType: 'Deposit' | 'Spending' | 'Refund' | null;
    transactionCount: number;
    newUserCount: number;
    depositAmount: number;
    spendingAmount: number;
    successRate: number;
  }[];
}

export default function MonthlyTransactionTrends({ data }: MonthlyTransactionTrendProps) {
  const [selectedTransactionType, setSelectedTransactionType] = useState<string | null>('all');
  const [filteredData, setFilteredData] = useState(data);

  const transactionTypes = ['all', ...Array.from(new Set(data.map(item => item.transactionType).filter(type => type !== null)))];

  useEffect(() => {
    if (selectedTransactionType === 'all') {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter(item => item.transactionType === selectedTransactionType));
    }
  }, [selectedTransactionType, data]);

  const formattedData = filteredData.map(item => ({
    ...item,
    month: new Date(item.yearMonth + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
  }));

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <h3 className="text-base font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            Monthly Transaction Trends
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-3 w-3 text-gray-500" />
              <select
                value={selectedTransactionType || ''}
                onChange={(e) => setSelectedTransactionType(e.target.value || null)}
                className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              >
                {transactionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Transaction Types' : type}
                  </option>
                ))}
              </select>
            </div>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-md text-xs flex items-center gap-1">
              <Download className="h-3 w-3" /> Export
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
          <Users className="h-4 w-4 text-indigo-500" />
          Monthly User Growth
        </h3>
        <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
          <span>Showing data for: <strong>{selectedTransactionType === 'all' ? 'All Transaction Types' : selectedTransactionType}</strong></span>
          <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full text-xs font-medium">
            {formattedData.length} months
          </span>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(value) => [value.toLocaleString(), 'Users']}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
            />
            <Legend />
            <Bar dataKey="newUserCount" name="New Users" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-blue-500" />
          Monthly Transaction Analysis
        </h3>
        <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
          <span>Comparing transaction counts with financial amounts</span>
          <div className="flex gap-2">
            <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
              Deposits
            </span>
            <span className="bg-pink-50 text-pink-700 px-2 py-1 rounded-full text-xs font-medium">
              Spending
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(value, name) => {
                if (name === "Success Rate (%)") return [`${value}%`, name];
                if (name === "Deposit Amount" || name === "Spending Amount") return [`$${value.toLocaleString()}`, name];
                return [value.toLocaleString(), name];
              }}
              contentStyle={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="transactionCount" name="Transaction Count" fill="#8884d8" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="left" dataKey="depositAmount" name="Deposit Amount" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="left" dataKey="spendingAmount" name="Spending Amount" fill="#ec4899" radius={[4, 4, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="successRate" name="Success Rate (%)" stroke="#f59e0b" strokeWidth={2} dot={{ stroke: '#f59e0b', strokeWidth: 2, r: 4 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-semibold flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-500" />
            Monthly Financial Overview
          </h3>
          <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
            {formattedData.length} months
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-4 py-2 whitespace-nowrap">Month</th>
                <th className="px-4 py-2 whitespace-nowrap">Transaction Type</th>
                <th className="px-4 py-2 whitespace-nowrap">Transactions</th>
                <th className="px-4 py-2 whitespace-nowrap">New Users</th>
                <th className="px-4 py-2 whitespace-nowrap">Deposit</th>
                <th className="px-4 py-2 whitespace-nowrap">Spending</th>
                <th className="px-4 py-2 whitespace-nowrap">Success Rate</th>
              </tr>
            </thead>
            <tbody>
              {formattedData.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                  <td className="px-4 py-3 font-medium whitespace-nowrap">{item.month}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {item.transactionType || 'All'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{item.transactionCount.toLocaleString()}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{item.newUserCount.toLocaleString()}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-green-600">${item.depositAmount.toLocaleString()}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-pink-600">${item.spendingAmount.toLocaleString()}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-12 bg-gray-200 rounded-full h-1.5 mr-2">
                        <div
                          className={`h-1.5 rounded-full ${
                            item.successRate >= 90 ? 'bg-green-500' :
                            item.successRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${item.successRate}%` }}
                        />
                      </div>
                      <span>{item.successRate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {formattedData.length === 0 && (
          <div className="text-center py-6 text-gray-500 text-xs">
            No data available for the selected transaction type
          </div>
        )}
      </div>
    </div>
  );
}