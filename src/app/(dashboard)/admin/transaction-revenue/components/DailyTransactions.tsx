'use client';

import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';
import { DailyTransactionStat, DateRangeParams } from '@/app/(dashboard)/admin/transaction-revenue/types/transaction';

interface DailyTransactionsProps {
  data: DailyTransactionStat[];
  dateParams: DateRangeParams;
}

export default function DailyTransactions({ data, dateParams }: DailyTransactionsProps) {
  const filteredData = useMemo(() => {
    if (!dateParams.transactionType) return data;
    return data.filter((item) => item.transactionType === dateParams.transactionType);
  }, [data, dateParams.transactionType]);

  const formattedData = useMemo(() => {
    return filteredData.map((item) => ({
      ...item,
      transactionCount: Number(item.transactionCount) || 0,
      depositAmount: Number(item.depositAmount) || 0,
      spendingAmount: Number(item.spendingAmount) || 0,
      successCount: Number(item.successCount) || 0,
      failedCount: Number(item.failedCount) || 0,
      pendingCount: Number(item.pendingCount) || 0,
      formattedDate: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }));
  }, [filteredData]);

  const calculateGrowth = () => {
    if (formattedData.length < 2) return { transactions: 0, deposits: 0, spending: 0 };
    const firstDay = formattedData[0];
    const lastDay = formattedData[formattedData.length - 1];
    const transactionGrowth =
      firstDay.transactionCount === 0
        ? 0
        : ((lastDay.transactionCount - firstDay.transactionCount) / firstDay.transactionCount) * 100;
    const depositGrowth =
      firstDay.depositAmount === 0
        ? 0
        : ((lastDay.depositAmount - firstDay.depositAmount) / firstDay.depositAmount) * 100;
    const spendingGrowth =
      firstDay.spendingAmount === 0
        ? 0
        : ((lastDay.spendingAmount - firstDay.spendingAmount) / firstDay.spendingAmount) * 100;
    return {
      transactions: transactionGrowth.toFixed(1),
      deposits: depositGrowth.toFixed(1),
      spending: spendingGrowth.toFixed(1),
    };
  };

  const growth = calculateGrowth();

  if (filteredData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
        No data available for {dateParams.transactionType || 'all transaction types'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-3">
          <div className="p-2 rounded-full bg-blue-50">
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Transaction Growth</p>
            <div className="flex items-center">
              <h3 className="text-lg font-bold mr-1">{growth.transactions}%</h3>
              <span className={Number(growth.transactions) >= 0 ? 'text-green-500' : 'text-red-500'}>
                {Number(growth.transactions) >= 0 ? '↑' : '↓'}
              </span>
            </div>
          </div>
        </div>
        {(!dateParams.transactionType || dateParams.transactionType === 'Deposit') && (
          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-3">
            <div className="p-2 rounded-full bg-green-50">
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Deposit Growth</p>
              <div className="flex items-center">
                <h3 className="text-lg font-bold mr-1">{growth.deposits}%</h3>
                <span className={Number(growth.deposits) >= 0 ? 'text-green-500' : 'text-red-500'}>
                  {Number(growth.deposits) >= 0 ? '↑' : '↓'}
                </span>
              </div>
            </div>
          </div>
        )}
        {(!dateParams.transactionType || dateParams.transactionType === 'Spending') && (
          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-3">
            <div className="p-2 rounded-full bg-pink-50">
              <TrendingUp className="h-5 w-5 text-pink-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Spending Growth</p>
              <div className="flex items-center">
                <h3 className="text-lg font-bold mr-1">{growth.spending}%</h3>
                <span className={Number(growth.spending) >= 0 ? 'text-green-500' : 'text-red-500'}>
                  {Number(growth.spending) >= 0 ? '↑' : '↓'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Daily Transaction Trends
          </h3>
          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            Last {formattedData.length} days
          </span>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={formattedData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorDeposits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ffc658" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="formattedDate" axisLine={false} tickLine={false} tickMargin={10} />
            <YAxis
              yAxisId="left"
              orientation="left"
              stroke="#8884d8"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#82ca9d"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                padding: '8px 12px',
              }}
              formatter={(value, name) => {
                if (name === 'Transaction Count') return [value.toLocaleString(), name];
                return [`$${value.toLocaleString()}`, name];
              }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="transactionCount"
              name="Transaction Count"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorTransactions)"
              strokeWidth={2}
            />
            {(!dateParams.transactionType || dateParams.transactionType === 'Deposit') && (
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="depositAmount"
                name="Deposit Amount"
                stroke="#82ca9d"
                fillOpacity={1}
                fill="url(#colorDeposits)"
                strokeWidth={2}
              />
            )}
            {(!dateParams.transactionType || dateParams.transactionType === 'Spending') && (
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="spendingAmount"
                name="Spending Amount"
                stroke="#ffc658"
                fillOpacity={1}
                fill="url(#colorSpending)"
                strokeWidth={2}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Transaction Status by Day
          </h3>
          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            Success rate trend
          </span>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="formattedDate" axisLine={false} tickLine={false} tickMargin={10} />
            <YAxis axisLine={false} tickLine={false} tickMargin={10} />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                padding: '8px 12px',
              }}
              formatter={(value) => [value.toLocaleString(), 'Transactions']}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Line
              type="monotone"
              dataKey="successCount"
              name="Successful"
              stroke="#10b981"
              activeDot={{ r: 6 }}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="failedCount"
              name="Failed"
              stroke="#ef4444"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="pendingCount"
              name="Pending"
              stroke="#f59e0b"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}