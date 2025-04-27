/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import { Search, RefreshCw, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "./DatePickerWithRange";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format, isSameDay } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { getAllOrders } from "@/apis/laudry/order";

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
  realtimeEnabled?: boolean;
  onToggleRealtime?: () => void;
  connectionStatus?: "connecting" | "connected" | "disconnected" | "error";
  activeTab?: string;
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
  activeTab = "all",
}: FilterBarProps) => {
  const [isQuickRefreshing, setIsQuickRefreshing] = useState(false);

  // Function to handle quick refresh without page reload
  const handleQuickRefresh = async () => {
    try {
      setIsQuickRefreshing(true);
      
      // Use the fetch API to get current data based on all existing filters
      const params = new URLSearchParams({
        ...(searchTerm && { search: searchTerm }),
        ...(activeTab !== "all" && { status: activeTab }),
        ...(dateRange?.from && {
          startDate: format(dateRange.from, "yyyy-MM-dd"),
        }),
        ...(dateRange?.to &&
          !isSameDay(dateRange.from!, dateRange.to) && {
            endDate: format(dateRange.to, "yyyy-MM-dd"),
          }),
      });

      const filters = params.toString();
      const orderResponse = await getAllOrders(filters);
      const { items, total } = await orderResponse.payload;
      
      const refreshEvent = new CustomEvent('manualDataRefresh', { 
        detail: { items, total } 
      });
      window.dispatchEvent(refreshEvent);
      
      toast({
        title: "Dữ liệu đã được cập nhật",
        description: "Danh sách đơn hàng đã được làm mới.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể làm mới dữ liệu. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsQuickRefreshing(false);
    }
  };

  return (
    <div className="p-6 border-b border-gray-200 bg-white rounded-t-lg">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
        <div className="flex flex-row items-center">
          <h2 className="text-xl font-bold text-gray-800">Quản Lí Các Đơn Hàng Giặt Sấy</h2>
          {/* <div className="ml-3 flex items-center">
            <span className="text-sm font-medium text-gray-500">Tổng cộng: </span>
            <span className="ml-1 text-sm font-bold text-blue-600">{totalItems} đơn hàng</span>
          </div> */}
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
          
          {/* Updated Quick Refresh Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={handleQuickRefresh}
                  disabled={isQuickRefreshing}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                >
                  {isQuickRefreshing ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-600 mr-1"></div>
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-1" />
                  )}
                  Làm mới trang
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Làm mới dữ liệu không reload trang</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Keep the original refresh data button if needed */}
          {onRefresh && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={onRefresh}
                    disabled={isLoading}
                    className="border-gray-300"
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Làm mới dữ liệu</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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