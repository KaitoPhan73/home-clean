/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
// In DashboardPage.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import CategoryStats from '@/app/(dashboard)/admin/transaction-revenue/components/CategoryStats';
import DailyTransactions from '@/app/(dashboard)/admin/transaction-revenue/components/DailyTransactions';
import MonthlyTransactionTrends from '@/app/(dashboard)/admin/transaction-revenue/components/MonthlyTrends';
import PaymentMethodStats from '@/app/(dashboard)/admin/transaction-revenue/components/PaymentMethodStats';
import TransactionStatsComponent from '@/app/(dashboard)/admin/transaction-revenue/components/TransactionStats';
import WalletTypeStats from '@/app/(dashboard)/admin/transaction-revenue/components/WalletTypeStats';
import {
  getDailyTransactionStats,
  getMonthlyTransactionTrend,
  getPaymentMethodStats,
  getTopUsers,
  getTransactionCategoryStats,
  getTransactionStats,
  getWalletTypeStats,
} from '@/apis/vinwallet/transaction-revenue';
import {
  DailyTransactionStat,
  DateRangeParams,
  PaymentMethodStat,
  TopUser,
  TransactionCategoryStat,
  TransactionStats,
  WalletTypeStat,
  MonthlyTransactionTrend,
} from '@/app/(dashboard)/admin/transaction-revenue/types/transaction';
import DashboardOverview from '@/app/(dashboard)/admin/transaction-revenue/components/Overview';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('transactions');
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({
    transactions: false,
    users: false,
    wallets: false,
    trends: false,
    payments: false,
    categories: false,
  });
  const [dateParams, setDateParams] = useState<DateRangeParams>({
    fromDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
    transactionType: 'Deposit', // Sync with DashboardOverview default
  });

  const [transactionStatsData, setTransactionStatsData] = useState<TransactionStats | null>(null);
  const [dailyTransactionData, setDailyTransactionData] = useState<DailyTransactionStat[] | null>(null);
  const [topUsersData, setTopUsersData] = useState<TopUser[] | null>(null);
  const [walletTypeData, setWalletTypeData] = useState<WalletTypeStat[] | null>(null);
  const [monthlyTrendData, setMonthlyTrendData] = useState<MonthlyTransactionTrend[] | null>(null);
  const [paymentMethodData, setPaymentMethodData] = useState<PaymentMethodStat[] | null>(null);
  const [categoryStatsData, setCategoryStatsData] = useState<TransactionCategoryStat[] | null>(null);

  const fetchData = useCallback(async () => {
    setLoading((prev) => ({ ...prev, [activeTab]: true }));
    try {
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
        // case 'wallets':
        //   if (!walletTypeData) {
        //     const wallets = await getWalletTypeStats(dateParams);
        //     setWalletTypeData(wallets.payload);
        //   }
        //   break;
        // case 'trends':
        //   if (!monthlyTrendData) {
        //     const trends = await getMonthlyTransactionTrend(dateParams);
        //     setMonthlyTrendData(trends.payload);
        //   }
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
        default:
          break;
      }
    } catch (error) {
      console.error(`Error fetching data for ${activeTab}:`, error);
    } finally {
      setLoading((prev) => ({ ...prev, [activeTab]: false }));
    }
  }, [activeTab, dateParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDateChange = (newParams: DateRangeParams) => {
    setDateParams(newParams);
    // Reset data to trigger refetch
    setTransactionStatsData(null);
    setDailyTransactionData(null);
    setTopUsersData(null);
    setWalletTypeData(null);
    setMonthlyTrendData(null);
    setPaymentMethodData(null);
    setCategoryStatsData(null);
  };

  return (
    <div className="bg-gray-50 h-screen flex flex-col overflow-hidden">
      <DashboardOverview dateParams={dateParams} onDateChange={handleDateChange} />

      {/* Tabs Section */}
      <div className="container mx-auto px-3 py-3 mt-4">
        <div className="bg-white rounded-lg shadow-sm flex-grow">
          <Tabs defaultValue="transactions" value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b border-gray-200">
              <TabsList className="flex justify-around py-2 px-2">
                <TabsTrigger
                  value="transactions"
                  className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700 rounded-md px-2 py-1 text-xs flex-1 text-center"
                >
                  Transactions
                </TabsTrigger>
                <TabsTrigger
                  value="users"
                  className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 rounded-md px-2 py-1 text-xs flex-1 text-center"
                >
                  Users
                </TabsTrigger>
                <TabsTrigger
                  value="wallets"
                  className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 rounded-md px-2 py-1 text-xs flex-1 text-center"
                >
                  Wallets
                </TabsTrigger>
                <TabsTrigger
                  value="trends"
                  className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-700 rounded-md px-2 py-1 text-xs flex-1 text-center"
                >
                  Trends
                </TabsTrigger>
                <TabsTrigger
                  value="payments"
                  className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-700 rounded-md px-2 py-1 text-xs flex-1 text-center"
                >
                  Payments
                </TabsTrigger>
                <TabsTrigger
                  value="categories"
                  className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700 rounded-md px-2 py-1 text-xs flex-1 text-center"
                >
                  Categories
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="p-3 overflow-auto h-[calc(100vh-36rem)]">
              {loading[activeTab] ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <>
                  <TabsContent value="transactions">
                    <div className="space-y-4">
                      {transactionStatsData ? (
                        <TransactionStatsComponent
                          data={transactionStatsData}
                          transactionType={dateParams.transactionType}
                        />
                      ) : (
                        <div className="text-center text-xs text-gray-500">No transaction stats available</div>
                      )}
                      {/* {dailyTransactionData ? (
                        <DailyTransactions
                          data={dailyTransactionData}
                          transactionType={dateParams.transactionType}
                        />
                      ) : (
                        <div className="text-center text-xs text-gray-500">No daily transaction data available</div>
                      )} */}
                    </div>
                  </TabsContent>
                  <TabsContent value="users">
                    {topUsersData && topUsersData.length > 0 ? (
                      <div className="bg-white rounded-lg shadow-sm p-3">
                        <h3 className="text-sm font-semibold mb-2">Top Users by Transaction Volume</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                              <tr>
                                <th className="px-3 py-2">User</th>
                                <th className="px-3 py-2">Transactions</th>
                                <th className="px-3 py-2">Total Amount</th>
                                <th className="px-3 py-2">Last Transaction</th>
                              </tr>
                            </thead>
                            <tbody>
                              {topUsersData.map((user, index) => (
                                <tr key={user.userId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                  <td className="px-3 py-2 font-medium">{user.username}</td>
                                  <td className="px-3 py-2">{user.transactionCount.toLocaleString()}</td>
                                  <td className="px-3 py-2">${user.totalAmount.toLocaleString()}</td>
                                  <td className="px-3 py-2">
                                    {new Date(user.lastTransactionDate).toLocaleDateString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-xs text-gray-500">No user data available</div>
                    )}
                  </TabsContent>
                  <TabsContent value="wallets">
                    {walletTypeData && walletTypeData.length > 0 ? (
                      <WalletTypeStats
                        data={walletTypeData}
                        transactionType={dateParams.transactionType}
                      />
                    ) : (
                      <div className="text-center text-xs text-gray-500">No wallet data available</div>
                    )}
                  </TabsContent>
                  {/* <TabsContent value="trends">
                    {monthlyTrendData && monthlyTrendData.length > 0 ? (
                      <MonthlyTransactionTrends data={monthlyTrendData} />
                    ) : (
                      <div className="text-center text-xs text-gray-500">No trend data available</div>
                    )}
                  </TabsContent> */}
                  <TabsContent value="payments">
                    {paymentMethodData && paymentMethodData.length > 0 ? (
                      <PaymentMethodStats data={paymentMethodData} />
                    ) : (
                      <div className="text-center text-xs text-gray-500">No payment method data available</div>
                    )}
                  </TabsContent>
                  {/* <TabsContent value="categories">
                    {categoryStatsData && categoryStatsData.length > 0 ? (
                      <CategoryStats
                        data={categoryStatsData}
                        transactionType={dateParams.transactionType}
                      />
                    ) : (
                      <div className="text-center text-xs text-gray-500">No category data available</div>
                    )}
                  </TabsContent> */}
                </>
              )}
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}