/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { getDailyTransactionStats, getDashboardOverview, getMonthlyTransactionTrend, getPaymentMethodStats, getTopUsers, getTransactionCategoryStats, getTransactionStats, getWalletTypeStats } from '@/apis/vinwallet/transaction-revenue';
import CategoryStats from '@/app/(dashboard)/admin/transaction-revenue/components/CategoryStats';
import DailyTransactions from '@/app/(dashboard)/admin/transaction-revenue/components/DailyTransactions';
import DateFilter from '@/app/(dashboard)/admin/transaction-revenue/components/DateFilter';
import MonthlyTransactionTrends from '@/app/(dashboard)/admin/transaction-revenue/components/MonthlyTrends';
import Overview from '@/app/(dashboard)/admin/transaction-revenue/components/Overview';
import PaymentMethodStats from '@/app/(dashboard)/admin/transaction-revenue/components/PaymentMethodStats';
import TransactionStatsComponent from '@/app/(dashboard)/admin/transaction-revenue/components/TransactionStats';
import WalletTypeStats from '@/app/(dashboard)/admin/transaction-revenue/components/WalletTypeStats';
import { DailyTransactionStat, DashboardOverview, DateRangeParams, PaymentMethodStat, TopUser, TransactionCategoryStat, TransactionStats } from '@/app/(dashboard)/admin/transaction-revenue/types/transaction';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [dateParams, setDateParams] = useState<DateRangeParams>({
    fromDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 60 days ago
    toDate: new Date().toISOString().split('T')[0], // today
    type: 'day'
  });

  const [overviewData, setOverviewData] = useState<DashboardOverview | null>(null);
  const [transactionStatsData, setTransactionStatsData] = useState<TransactionStats | null>(null);
  const [dailyTransactionData, setDailyTransactionData] = useState<DailyTransactionStat[] | null>(null);
  const [topUsersData, setTopUsersData] = useState<TopUser[] | null>(null);
  const [walletTypeData, setWalletTypeData] = useState<any[] | null>(null);
  const [monthlyTrendData, setMonthlyTrendData] = useState<any[] | null>(null);
  const [paymentMethodData, setPaymentMethodData] = useState<PaymentMethodStat[] | null>(null);
  const [categoryStatsData, setCategoryStatsData] = useState<TransactionCategoryStat[] | null>(null);

  // Fetch data based on active tab and date parameters
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Always fetch overview data
        if (activeTab === 'overview' || !overviewData) {
          const overview = await getDashboardOverview(dateParams);
          setOverviewData(overview.payload);
        }

        // Fetch other data based on active tab
        switch (activeTab) {
          case 'transactions':
            if (!transactionStatsData) {
              const stats = await getTransactionStats(dateParams);
              setTransactionStatsData(stats.payload);
            }
            if (!dailyTransactionData) {
              const daily = await getDailyTransactionStats(dateParams);
              setDailyTransactionData(daily.payload);
            }
            break;
          case 'users':
            if (!topUsersData) {
              const users = await getTopUsers(dateParams);
              setTopUsersData(users.payload);
            }
            break;
          case 'wallets':
            if (!walletTypeData) {
              const wallets = await getWalletTypeStats(dateParams);
              setWalletTypeData(wallets.payload);
            }
            break;
          case 'trends':
            if (!monthlyTrendData) {
              const trends = await getMonthlyTransactionTrend(dateParams);
              setMonthlyTrendData(trends.payload);
            }
            break;
          case 'payments':
            if (!paymentMethodData) {
              const payments = await getPaymentMethodStats(dateParams);
              setPaymentMethodData(payments.payload);
            }
            break;
          case 'categories':
            if (!categoryStatsData) {
              const categories = await getTransactionCategoryStats(dateParams);
              setCategoryStatsData(categories.payload);
            }
            break;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, dateParams]);

  // Handle date filter changes
  const handleDateChange = (newParams: DateRangeParams) => {
    setDateParams(newParams);
    // Reset all data to trigger refetch with new params
    setOverviewData(null);
    setTransactionStatsData(null);
    setDailyTransactionData(null);
    setTopUsersData(null);
    setWalletTypeData(null);
    setMonthlyTrendData(null);
    setPaymentMethodData(null);
    setCategoryStatsData(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Transaction Analytics Dashboard</h1>
      
      <DateFilter 
        onChange={handleDateChange} 
        defaultFromDate={dateParams.fromDate}
        defaultToDate={dateParams.toDate}
      />
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="wallets">Wallets</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="payments">Payment Methods</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <TabsContent value="overview">
              {overviewData && <Overview data={overviewData} />}
            </TabsContent>
            
            <TabsContent value="transactions">
              <div className="space-y-8">
                {transactionStatsData && <TransactionStatsComponent data={transactionStatsData} />}
                {dailyTransactionData && <DailyTransactions data={dailyTransactionData} />}
              </div>
            </TabsContent>
            
            <TabsContent value="users">
              {topUsersData && (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                  <h3 className="text-lg font-semibold mb-4">Top Users by Transaction Volume</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                          <th className="px-6 py-3">User</th>
                          <th className="px-6 py-3">Transactions</th>
                          <th className="px-6 py-3">Total Amount</th>
                          <th className="px-6 py-3">Last Transaction</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topUsersData.map((user, index) => (
                          <tr key={user.userId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 font-medium">{user.username}</td>
                            <td className="px-6 py-4">{user.transactionCount.toLocaleString()}</td>
                            <td className="px-6 py-4">${user.totalAmount.toLocaleString()}</td>
                            <td className="px-6 py-4">{new Date(user.lastTransactionDate).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="wallets">
              {walletTypeData && <WalletTypeStats data={walletTypeData} />}
            </TabsContent>
            
            <TabsContent value="trends">
              {monthlyTrendData && <MonthlyTransactionTrends data={monthlyTrendData} />}
            </TabsContent>
            
            <TabsContent value="payments">
              {paymentMethodData && <PaymentMethodStats data={paymentMethodData} />}
            </TabsContent>
            
            <TabsContent value="categories">
              {categoryStatsData && <CategoryStats data={categoryStatsData} />}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}