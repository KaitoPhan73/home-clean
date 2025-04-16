/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { DateRangeParams } from '@/app/(dashboard)/admin/transaction-revenue/types/transaction';
import { Calendar } from 'lucide-react';

interface DateFilterProps {
  defaultFromDate: string;
  defaultToDate: string;
  defaultTransactionType?: 'Deposit' | 'Spending' | 'Refund';
  onChange: (params: DateRangeParams) => void;
}

export default function DateFilter({
  defaultFromDate,
  defaultToDate,
  defaultTransactionType,
  onChange,
}: DateFilterProps) {
  const [fromDate, setFromDate] = useState(defaultFromDate);
  const [toDate, setToDate] = useState(defaultToDate);
  const [transactionType, setTransactionType] = useState<'Deposit' | 'Spending' | 'Refund' | undefined>(
    defaultTransactionType
  );

  const handleApplyFilter = () => {
    onChange({
      fromDate,
      toDate,
      transactionType,
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 bg-gray-50 p-4 rounded-lg shadow-sm">
      <div className="flex items-center gap-3">
        <div className="relative">
          <label htmlFor="fromDate" className="block text-xs font-medium text-gray-700 mb-1">
            From
          </label>
          <div className="relative">
            <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="date"
              id="fromDate"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="pl-8 block w-full rounded-md border-gray-300 shadow-sm text-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="relative">
          <label htmlFor="toDate" className="block text-xs font-medium text-gray-700 mb-1">
            To
          </label>
          <div className="relative">
            <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="date"
              id="toDate"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="pl-8 block w-full rounded-md border-gray-300 shadow-sm text-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
      <div className="flex items-end gap-3">
        <div>
          <label htmlFor="transactionType" className="block text-xs font-medium text-gray-700 mb-1">
            Transaction Type
          </label>
          <select
            id="transactionType"
            value={transactionType || ''}
            onChange={(e) => setTransactionType(e.target.value as any || undefined)}
            className="block w-full rounded-md border-gray-300 shadow-sm text-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Types</option>
            <option value="Deposit">Deposit</option>
            <option value="Spending">Spending</option>
            <option value="Refund">Refund</option>
          </select>
        </div>
        <button
          onClick={handleApplyFilter}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded-md transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}