"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Search, X, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DatePickerWithRange } from "@/app/(dashboard)/laundry/orders/_components/order-table/DatePickerWithRange";
import { DateRange } from "react-day-picker";

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  dateRange: DateRange | undefined;
  onDateChange: (range: DateRange | undefined) => void;
  onClearFilters: () => void;
  isLoading?: boolean;
  onRefresh?: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  dateRange,
  onDateChange,
  onClearFilters,
  isLoading = false,
  onRefresh,
}) => {
  const hasFilters = searchTerm || (dateRange?.from && dateRange?.to);

  return (
    <div className="p-4 bg-white border-b border-gray-100">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm theo mã đơn hàng, tên hoặc loại dịch vụ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-10 border-gray-200"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4 text-gray-400" />
            </Button>
          )}
        </div>
        
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-50 rounded-md pr-2">
              <Filter className="h-4 w-4 ml-3 text-gray-500" />
              <DatePickerWithRange
                className="min-w-[240px]"
                onChange={onDateChange}
              />
            </div>
          </div>
          
          {hasFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="whitespace-nowrap h-10"
            >
              <X className="h-4 w-4 mr-2" />
              Xóa bộ lọc
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="hover:bg-slate-50 h-10"
          >
            <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="ml-2 hidden sm:inline">Làm mới</span>
          </Button>
        </div>
      </div>
      
      {hasFilters && (
        <div className="flex flex-wrap gap-2 mt-3">
          {searchTerm && (
            <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 px-3 py-1 flex items-center">
              Từ khóa: {searchTerm}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {dateRange?.from && dateRange?.to && (
            <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 px-3 py-1 flex items-center">
              Thời gian: {dateRange.from.toLocaleDateString('vi-VN')} - {dateRange.to.toLocaleDateString('vi-VN')}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2"
                onClick={() => onDateChange(undefined)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterBar;