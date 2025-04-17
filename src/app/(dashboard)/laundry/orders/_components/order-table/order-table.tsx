/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Layers, 
  Search, 
  RefreshCcw, 
  X, 
  FileText, 
  Loader2, 
  User,
  CalendarRange
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { 
  parseISO,
  format,
  startOfDay,
  endOfDay,
  isSameDay,
  isWithinInterval,
} from "date-fns";
import { vi } from "date-fns/locale";
import { TOrderLaundryResponse } from "@/schema/VinLaudry/laundry-order";
import { laundryColumns } from "./columns";
import { DataTableProps } from "@/app/(dashboard)/laundry/orders/_components/order-table/DataTable";
import FilterBar from "@/app/(dashboard)/laundry/orders/_components/order-table/FilterBar";

// Status configuration object
export const statusConfig = {
  all: {
    id: "all",
    label: "Tất cả",
    color: "text-slate-500",
    borderColor: "border-l-slate-500",
    icon: null,
  },
  Draft: {
    id: "Draft",
    label: "Nháp",
    color: "text-amber-500",
    borderColor: "border-l-amber-500",
    bgColor: "bg-amber-100",
    icon: <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5"></span>,
  },
  Paid: {
    id: "Paid",
    label: "Đã thanh toán",
    color: "text-blue-500",
    borderColor: "border-l-blue-500",
    bgColor: "bg-blue-100",
    icon: <span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></span>,
  },
  Completed: {
    id: "Completed",
    label: "Hoàn thành",
    color: "text-emerald-500",
    borderColor: "border-l-emerald-500",
    bgColor: "bg-emerald-100",
    icon: <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>,
  },
  Processing: {
    id: "Processing",
    label: "Đang xử lý",
    color: "text-purple-500",
    borderColor: "border-l-purple-500",
    bgColor: "bg-purple-100",
    icon: <span className="w-2 h-2 rounded-full bg-purple-500 mr-1.5"></span>,
  },
  PendingPayment: {
    id: "PendingPayment",
    label: "Chờ thanh toán",
    color: "text-orange-500",
    borderColor: "border-l-orange-500",
    bgColor: "bg-orange-100",
    icon: <span className="w-2 h-2 rounded-full bg-orange-500 mr-1.5"></span>,
  },
  Canceled: {
    id: "Canceled",
    label: "Đã hủy",
    color: "text-rose-500",
    borderColor: "border-l-rose-500",
    bgColor: "bg-rose-100",
    icon: <span className="w-2 h-2 rounded-full bg-rose-500 mr-1.5"></span>,
  },
};

interface OrderTableProps {
  data: TOrderLaundryResponse[];
  totalItems: number;
  isLoading?: boolean;
  onRefresh?: () => void;
  onCreateOrder?: () => void;
}

const OrderTable = ({
  data,
  totalItems,
  isLoading = false,
  onRefresh,
  onCreateOrder,
}: OrderTableProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [filteredData, setFilteredData] = useState<TOrderLaundryResponse[]>(data);
  const [loadingRealTimeStatus, setLoadingRealTimeStatus] = useState(false);
  const [size, setSize] = useState(100);

  // Sync URL params without causing navigation
  useEffect(() => {
    const status = searchParams.get("status") || "all";
    setActiveTab(status);
    
    const search = searchParams.get("search") || "";
    setSearchTerm(search);
    
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const urlSize = searchParams.get("size") || "100";
    
    setSize(Number(urlSize));
    
    // Handle date range from URL
    if (from) {
      const dateRange: DateRange = { from: parseISO(from) };
      if (to) dateRange.to = parseISO(to);
      setDateRange(dateRange);
    } else {
      setDateRange(undefined);
    }
  }, [searchParams]);

  // Calculate status counts
  const calculateStatusCounts = () => {
    const counts: Record<string, number> = {
      all: data.length,
      Draft: 0,
      Paid: 0,
      Completed: 0,
      Processing: 0,
      PendingPayment: 0,
      Canceled: 0,
    };
    
    data.forEach((order) => {
      const status = order.status;
      counts[status] = (counts[status] || 0) + 1;
    });
    
    return counts;
  };

  const statusCounts = calculateStatusCounts();

  // Filter orders without causing re-renders
  const filterOrders = useCallback(() => {
    const filtered = data.filter((order) => {
      const matchesSearch = !searchTerm
        ? true
        : order.orderCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (order.type && order.type.toLowerCase().includes(searchTerm.toLowerCase()));

      let matchesStatus = true;
      if (activeTab !== "all") {
        matchesStatus = order.status === activeTab;
      }

      let matchesDateRange = true;
      if (dateRange?.from) {
        const orderDate = order.orderDate ? new Date(order.orderDate) : null;
        if (orderDate) {
          if (dateRange.to && !isSameDay(dateRange.from, dateRange.to)) {
            matchesDateRange = isWithinInterval(orderDate, {
              start: startOfDay(dateRange.from),
              end: endOfDay(dateRange.to || dateRange.from),
            });
          } else {
            matchesDateRange = isSameDay(orderDate, dateRange.from);
          }
        }
      }

      return matchesSearch && matchesStatus && matchesDateRange;
    });

    setFilteredData(filtered);
  }, [data, searchTerm, activeTab, dateRange]);

  useEffect(() => {
    filterOrders();
  }, [filterOrders]);

  // Update URL params without navigation/reload
  const updateUrlParams = useCallback((params: URLSearchParams) => {
    const url = new URL(window.location.href);
    url.search = params.toString();
    window.history.replaceState({ path: url.toString() }, '', url.toString());
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const params = new URLSearchParams(searchParams.toString());
    
    if (tabId === "all") {
      params.delete("status");
    } else {
      params.set("status", tabId);
    }
    
    // Avoid navigation, just update URL params
    updateUrlParams(params);
  };

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }
    
    // Avoid navigation, just update URL params
    updateUrlParams(params);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    const params = new URLSearchParams(searchParams.toString());
    
    if (range?.from) {
      params.set("from", format(range.from, "yyyy-MM-dd"));
      if (range.to && !isSameDay(range.from, range.to)) {
        params.set("to", format(range.to, "yyyy-MM-dd"));
      } else {
        params.delete("to");
      }
    } else {
      params.delete("from");
      params.delete("to");
    }
    
    // Avoid navigation, just update URL params
    updateUrlParams(params);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setDateRange(undefined);
    setActiveTab("all");
    
    const params = new URLSearchParams();
    params.set("size", size.toString());
    
    // Avoid navigation, just update URL params
    updateUrlParams(params);
  };

  const handleSizeChange = (newSize: number) => {
    setSize(newSize);
    
    const params = new URLSearchParams(searchParams.toString());
    params.set("size", newSize.toString());
    
    // Avoid navigation, just update URL params
    updateUrlParams(params);
  };

  const updateEmployeeStatus = async () => {
    try {
      setLoadingRealTimeStatus(true);
      // Simulate API call for employee status update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Toast notification for success
      console.log("Employee status updated successfully");
    } catch (error) {
      console.error("Error updating employee status:", error);
    } finally {
      setLoadingRealTimeStatus(false);
    }
  };

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return "";
    if (range.to && !isSameDay(range.from, range.to)) {
      return `${format(range.from, "dd/MM/yyyy", { locale: vi })} - ${format(
        range.to,
        "dd/MM/yyyy",
        { locale: vi }
      )}`;
    }
    return format(range.from, "dd/MM/yyyy", { locale: vi });
  };

  const dateRangeText = formatDateRange(dateRange);

  return (
    <Card className="shadow-lg border-gray-100 overflow-hidden">
      <CardHeader className="bg-white border-b border-gray-100 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Layers className="h-6 w-6 text-blue-600" />
            <CardTitle className="text-xl font-bold">
              Quản lý đơn giặt ủi
            </CardTitle>
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-600 border-blue-200"
            >
              {totalItems} đơn hàng
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={updateEmployeeStatus}
              disabled={loadingRealTimeStatus}
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              {loadingRealTimeStatus ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <User className="h-4 w-4 mr-2" />
                  Cập nhật trạng thái
                </>
              )}
            </Button>
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isLoading}
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Làm mới
              </Button>
            )}
            {onCreateOrder && (
              <Button
                size="sm"
                onClick={onCreateOrder}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                <FileText className="h-4 w-4 mr-2" />
                Tạo đơn mới
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <FilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          dateRange={dateRange}
          onDateChange={handleDateRangeChange}
          onClearFilters={handleClearFilters}
          onSearch={handleSearch}
          isLoading={isLoading}
          onRefresh={onRefresh}
        />

        <div className="flex bg-white overflow-hidden h-[calc(100vh-16rem)]">
          {/* Left Sidebar */}
          <div className="w-64 shrink-0 border-r border-gray-200">
            <div className="p-3 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700">Trạng thái đơn hàng</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {Object.entries(statusConfig).map(([key, status]) => (
                <button
                  key={key}
                  onClick={() => handleTabChange(key)}
                  className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-gray-50 ${
                    activeTab === key ? `${status.borderColor} border-l-4 ${status.borderColor || 'bg-gray-50'}` : ''
                  }`}
                >
                  <div className="flex items-center">
                    {status.icon}
                    <span className={activeTab === key ? status.color : "text-gray-700"}>
                      {status.label}
                    </span>
                  </div>
                  <Badge variant="outline" className="bg-gray-50 text-gray-600">
                    {statusCounts[key] || 0}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                  {statusConfig[activeTab as keyof typeof statusConfig].icon && (
                    <span className={statusConfig[activeTab as keyof typeof statusConfig].color}>
                      {statusConfig[activeTab as keyof typeof statusConfig].icon}
                    </span>
                  )}
                  {statusConfig[activeTab as keyof typeof statusConfig].label}
                  <span className="text-sm text-gray-500">
                    ({filteredData.length} đơn hàng)
                  </span>
                </h2>
                
                {dateRangeText && (
                  <div className="flex items-center text-sm text-slate-500">
                    <CalendarRange size={16} className="mr-1" />
                    {dateRangeText}
                  </div>
                )}
              </div>
              
              <div className="mt-3 flex items-center">
                <label htmlFor="size-select" className="text-sm text-gray-600 mr-2 ml-2">
                  Số đơn mỗi trang:
                </label>
                <select
                  id="size-select"
                  value={size}
                  onChange={(e) => handleSizeChange(Number(e.target.value))}
                  className="border rounded-md px-2 py-1 text-sm"
                >
                  <option value={10}>10</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={1000}>1000</option>
                </select>
                
                {isLoading && (
                  <div className="ml-4 flex items-center text-sm text-gray-500">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang tải...
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              {/* Table content */}
              <DataTableProps<TOrderLaundryResponse, unknown>
                columns={laundryColumns}
                data={filteredData}
                isLoading={isLoading}
                totalItems={filteredData.length}
              />

              {filteredData.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="bg-gray-100 rounded-full p-3 mb-4">
                    <Search className="h-6 w-6 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    Không tìm thấy dữ liệu
                  </h3>
                  <p className="text-gray-500 max-w-md mb-4">
                    {activeTab !== "all"
                      ? `Hiện không có đơn hàng nào ở trạng thái "${
                          statusConfig[activeTab as keyof typeof statusConfig].label
                        }"`
                      : "Không tìm thấy đơn hàng nào phù hợp với các điều kiện tìm kiếm"}
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Xóa bộ lọc
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderTable;