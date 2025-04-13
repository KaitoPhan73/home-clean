'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Users,
  Wallet,
  Activity,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import { getDashboardOverview } from '@/apis/vinwallet/transaction-revenue';
import { DateRangeParams, DashboardOverview as DashboardOverviewType } from '@/app/(dashboard)/admin/transaction-revenue/types/transaction';
import DateFilter from './DateFilter';
import { Skeleton } from '@/components/ui/skeleton';

const statusColors = {
  successful: '#10b981',
  failed: '#ef4444',
  pending: '#f59e0b'
};

const transactionTypeColors = {
  Deposit: '#3b82f6',
  Spending: '#ec4899',
  Refund: '#6b7280'
};

export default function DashboardOverview({
  dateParams: initialDateParams,
  onDateChange,
}: {
  dateParams: DateRangeParams;
  onDateChange: (newParams: DateRangeParams) => void;
}) {
  const [loading, setLoading] = useState(true);
  const [dateParams, setDateParams] = useState<DateRangeParams>(initialDateParams);
  const [overviewData, setOverviewData] = useState<DashboardOverviewType | null>(null);

  const fetchOverviewData = async (params: DateRangeParams) => {
    setLoading(true);
    try {
      const response = await getDashboardOverview(params);
      setOverviewData(response.payload as DashboardOverviewType);
    } catch (error) {
      console.error('Error fetching overview data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setDateParams(initialDateParams);
    fetchOverviewData(initialDateParams);
  }, [initialDateParams]);

  const handleDateChange = (newParams: DateRangeParams) => {
    setDateParams(newParams);
    onDateChange(newParams);
  };

  // Filter transaction status data based on the current transaction type filter
  const getFilteredTransactionStatus = () => {
    if (!overviewData) return [];
    
    return [
      { name: 'Successful', value: overviewData.successfulTransactions, color: statusColors.successful },
      { name: 'Failed', value: overviewData.failedTransactions, color: statusColors.failed },
      { name: 'Pending', value: overviewData.pendingTransactions, color: statusColors.pending },
    ].filter(item => item.value > 0);
  };

  // Get financial data based on current transaction type filter
  const getFinancialData = () => {
    if (!overviewData) return [];
    
    const data = [];
    const showAll = !dateParams.transactionType;
    
    if (showAll || dateParams.transactionType === 'Deposit') {
      data.push({ 
        name: 'Deposit', 
        value: overviewData.totalDeposit, 
        color: transactionTypeColors.Deposit 
      });
    }
    
    if (showAll || dateParams.transactionType === 'Spending') {
      data.push({ 
        name: 'Spending', 
        value: overviewData.totalSpending, 
        color: transactionTypeColors.Spending 
      });
    }
    
    if (showAll || dateParams.transactionType === 'Refund') {
      data.push({ 
        name: 'Refund', 
        value: overviewData.totalRefund || 0, 
        color: transactionTypeColors.Refund 
      });
    }
    
    return data;
  };

  // Generate stats cards based on current filters
  const getStatsCards = () => {
    if (!overviewData) return [];
    
    const cards = [];
    const showAll = !dateParams.transactionType;
    
    // Always show these regardless of filter
    cards.push({
      title: 'Total Users',
      value: overviewData.totalUsers.toLocaleString(),
      icon: <Users className="h-5 w-5 text-blue-500" />,
      change: null,
    });
    
    cards.push({
      title: 'Total Wallets',
      value: overviewData.totalWallets.toLocaleString(),
      icon: <Wallet className="h-5 w-5 text-purple-500" />,
      change: null,
    });
    
    // Transaction count based on filter
    if (showAll) {
      cards.push({
        title: 'Total Transactions',
        value: overviewData.totalTransactions.toLocaleString(),
        icon: <Activity className="h-5 w-5 text-green-500" />,
        change: null,
      });
    } else {
      cards.push({
        title: `${dateParams.transactionType} Transactions`,
        value: (
          overviewData.successfulTransactions + 
          overviewData.failedTransactions + 
          overviewData.pendingTransactions
        ).toLocaleString(),
        icon: <Activity className="h-5 w-5 text-green-500" />,
        change: null,
      });
    }
    
    // Amount based on filter
    if (showAll) {
      cards.push({
        title: 'Total Amount',
        value: `$${overviewData.totalAmount.toLocaleString()}`,
        icon: <DollarSign className="h-5 w-5 text-amber-500" />,
        change: null,
      });
    } else if (dateParams.transactionType === 'Deposit') {
      cards.push({
        title: 'Total Deposit Amount',
        value: `$${overviewData.totalDeposit.toLocaleString()}`,
        icon: <DollarSign className="h-5 w-5 text-amber-500" />,
        change: null,
      });
    } else if (dateParams.transactionType === 'Spending') {
      cards.push({
        title: 'Total Spending Amount',
        value: `$${overviewData.totalSpending.toLocaleString()}`,
        icon: <DollarSign className="h-5 w-5 text-amber-500" />,
        change: null,
      });
    } else if (dateParams.transactionType === 'Refund') {
      cards.push({
        title: 'Total Refund Amount',
        value: `$${(overviewData.totalRefund || 0).toLocaleString()}`,
        icon: <DollarSign className="h-5 w-5 text-amber-500" />,
        change: null,
      });
    }
    
    return cards;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-lg" />
          <Skeleton className="h-80 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!overviewData) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        No overview data available for the selected filters
      </div>
    );
  }

  const statsCards = getStatsCards();
  const financialData = getFinancialData();
  const transactionStatusData = getFilteredTransactionStatus();

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header with filter */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Transaction Analytics</h1>
            <p className="text-gray-600">
              {dateParams.transactionType
                ? `${dateParams.transactionType} transactions from ${new Date(dateParams.fromDate).toLocaleDateString()} to ${new Date(dateParams.toDate).toLocaleDateString()}`
                : `All transactions from ${new Date(dateParams.fromDate).toLocaleDateString()} to ${new Date(dateParams.toDate).toLocaleDateString()}`}
            </p>
          </div>
          <DateFilter
            defaultFromDate={dateParams.fromDate}
            defaultToDate={dateParams.toDate}
            defaultTransactionType={dateParams.transactionType}
            onChange={handleDateChange}
          />
        </div>
      </div>

      {/* Stats cards */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Dashboard Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((card, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">{card.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{card.value}</h3>
                </div>
                <div className="bg-white p-2 rounded-full shadow-sm">
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Financial Overview */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Financial Overview</h3>
              {dateParams.transactionType && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {dateParams.transactionType}
                </span>
              )}
            </div>
            
            {financialData.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-4 mb-4">
                  {financialData.map((item) => (
                    <div key={item.name} className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: item.color }}
                      />
                      <div>
                        <p className="text-sm text-gray-500">{item.name}</p>
                        <p className="font-semibold">${item.value.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={financialData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`$${value}`, 'Amount']}
                        contentStyle={{ 
                          borderRadius: '0.5rem',
                          border: 'none',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Bar 
                        dataKey="value" 
                        radius={[4, 4, 0, 0]}
                      >
                        {financialData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No financial data available for the selected filters
              </div>
            )}
          </div>

          {/* Transaction Status */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Transaction Status</h3>
              {dateParams.transactionType && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {dateParams.transactionType}
                </span>
              )}
            </div>
            
            {transactionStatusData.length > 0 ? (
              <>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {transactionStatusData.map((status) => (
                    <div key={status.name} className="text-center">
                      <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-2" 
                        style={{ backgroundColor: `${status.color}20`, border: `2px solid ${status.color}` }}>
                        {status.name === 'Successful' && <CheckCircle className="h-5 w-5" style={{ color: status.color }} />}
                        {status.name === 'Failed' && <XCircle className="h-5 w-5" style={{ color: status.color }} />}
                        {status.name === 'Pending' && <Clock className="h-5 w-5" style={{ color: status.color }} />}
                      </div>
                      <p className="text-sm text-gray-500">{status.name}</p>
                      <p className="font-semibold">{status.value.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={transactionStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {transactionStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value} transactions`, 'Count']}
                        contentStyle={{ 
                          borderRadius: '0.5rem',
                          border: 'none',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No transaction status data available for the selected filters
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}