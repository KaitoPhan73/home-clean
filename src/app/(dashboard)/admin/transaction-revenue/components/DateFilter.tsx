/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { DateRangeParams } from '@/app/(dashboard)/admin/transaction-revenue/types/transaction';
import { useState } from 'react';

interface DateFilterProps {
  onChange: (params: DateRangeParams) => void;
  defaultFromDate?: string;
  defaultToDate?: string;
}

export default function DateFilter({
  onChange,
  defaultFromDate = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 60 days ago
  defaultToDate = new Date().toISOString().split('T')[0], // today
}: DateFilterProps) {
  const [fromDate, setFromDate] = useState(defaultFromDate);
  const [toDate, setToDate] = useState(defaultToDate);
  const [type, setType] = useState<'day' | 'week' | 'month' | 'year'>('day');

  const handleFilterChange = () => {
    onChange({ fromDate, toDate, type });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-lg shadow-sm mb-6">
      <div className="flex flex-1 flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">From Date</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="flex flex-1 flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">To Date</label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="flex flex-1 flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Group By</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as any)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
      </div>
      
      <div className="flex items-end">
        <button
          onClick={handleFilterChange}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}