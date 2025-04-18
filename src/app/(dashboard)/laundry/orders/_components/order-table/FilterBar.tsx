"use client";

import React from "react";
import { Search, RefreshCw, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "./DatePickerWithRange";

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  dateRange: DateRange | undefined;
  onDateChange: (range: DateRange | undefined) => void;
  onClearFilters: () => void;
  onSearch: () => void;
  isLoading?: boolean;
  onRefresh?: () => void;
  onCreateOrder?: () => void;
  totalItems: number;
}

const FilterBar = ({
  searchTerm,
  setSearchTerm,
  dateRange,
  onDateChange,
  onClearFilters,
  onSearch,
  isLoading = false,
  onRefresh,
  onCreateOrder,
  totalItems,
}: FilterBarProps) => {
  return (
    <div className="p-6 border-b border-gray-200 bg-white rounded-t-lg">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
        <div className="flex flex-row items-center">
          <h2 className="text-xl font-bold text-gray-800">Đơn Hàng Giặt Ủi</h2>
          <div className="ml-3 flex items-center">
            <span className="text-sm font-medium text-gray-500">Tổng cộng: </span>
            <span className="ml-1 text-sm font-bold text-blue-600">{totalItems} đơn hàng</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {onCreateOrder && (
            <Button 
              onClick={onCreateOrder}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Tạo đơn mới
            </Button>
          )}
          
          {onRefresh && (
            <Button
              variant="outline"
              onClick={onRefresh}
              disabled={isLoading}
              className="border-gray-300"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </div>
      </div>
      
      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Tìm kiếm theo mã đơn, tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            className="pl-9 h-10"
          />
        </div>
        
        <div className="flex gap-2">
          <DatePickerWithRange onChange={onDateChange} />
          
          <Button variant="outline" onClick={onSearch} className="h-10 border-gray-300">
            <Search className="h-4 w-4 mr-1" />
            Tìm kiếm
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={onClearFilters} 
            className="h-10 text-gray-600"
            disabled={!searchTerm && !dateRange?.from}
          >
            <X className="h-4 w-4 mr-1" />
            Xóa lọc
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;