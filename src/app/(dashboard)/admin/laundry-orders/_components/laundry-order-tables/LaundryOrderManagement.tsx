/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarRange } from "lucide-react";
import { TOrderLaundryResponse } from "@/schema/VinLaudry/laundry-order";
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
import { FilterBar } from "./FilterBar";
import { StatusSidebar } from "./StatusSidebar";
import { OrderGrid } from "./OrderGrid";
import { getAllOrders } from "@/apis/laudry/order";

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
    icon: <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5"></span>,
  },
  Paid: {
    id: "Paid",
    label: "Đã thanh toán",
    color: "text-blue-500",
    borderColor: "border-l-blue-500",
    icon: <span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></span>,
  },
  Completed: {
    id: "Completed",
    label: "Hoàn thành",
    color: "text-emerald-500",
    borderColor: "border-l-emerald-500",
    icon: <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>,
  },
  Processing: {
    id: "Processing",
    label: "Đang xử lý",
    color: "text-purple-500",
    borderColor: "border-l-purple-500",
    icon: <span className="w-2 h-2 rounded-full bg-purple-500 mr-1.5"></span>,
  },
  PendingPayment: {
    id: "PendingPayment",
    label: "Chờ thanh toán",
    color: "text-orange-500",
    borderColor: "border-l-orange-500",
    icon: <span className="w-2 h-2 rounded-full bg-orange-500 mr-1.5"></span>,
  },
  Cancelled: {
    id: "Cancelled",
    label: "Đã hủy",
    color: "text-rose-500",
    borderColor: "border-l-rose-500",
    icon: <span className="w-2 h-2 rounded-full bg-rose-500 mr-1.5"></span>,
  },
};

interface Props {
  orders: TOrderLaundryResponse[];
  total: number;
  totalPages: number;
  size: number;
  currentPage: number;
}

export default function LaundryOrderManagement({
  orders: initialOrders,
  total: initialTotal,
  totalPages: initialTotalPages,
  size: initialSize,
  currentPage: initialPage,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [filteredOrders, setFilteredOrders] = useState<TOrderLaundryResponse[]>(initialOrders);
  const [allOrders, setAllOrders] = useState<TOrderLaundryResponse[]>(initialOrders);
  const [page, setPage] = useState(initialPage);
  const [total, setTotal] = useState(initialTotal);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [size, setSize] = useState(initialSize);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch additional orders for pagination
  const fetchOrders = async (pageNum: number, fetchSize: number = size) => {
    setIsLoading(true);
    try {
      // Include date range in API call
      const params: any = { page: pageNum, size: fetchSize };
      if (activeTab !== "all") params.status = activeTab;
      if (searchValue) params.search = searchValue;
      if (dateRange?.from) {
        params.from = format(dateRange.from, "yyyy-MM-dd");
        if (dateRange.to && !isSameDay(dateRange.from, dateRange.to)) {
          params.to = format(dateRange.to, "yyyy-MM-dd");
        }
      }
      
      const { payload } = await getAllOrders(params);
      
      // Replace orders completely instead of appending to prevent duplicates
      setAllOrders(payload.items || []);
      setTotal(payload.total);
      setTotalPages(payload.totalPages);
      setPage(pageNum);
      setSize(payload.size);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sync URL params
  useEffect(() => {
    const status = searchParams.get("status") || "all";
    setActiveTab(status);
    
    const search = searchParams.get("search") || "";
    setSearchValue(search);
    
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const urlSize = searchParams.get("size") || "1000";
    
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

  // Filter orders when state changes
  useEffect(() => {
    filterOrders(activeTab, searchValue, dateRange);
  }, [allOrders, activeTab, searchValue, dateRange]);

  // Calculate status counts 
  const calculateStatusCounts = () => {
    const counts: Record<string, number> = {
      all: allOrders.length,
      Draft: 0,
      Paid: 0,
      Completed: 0,
      Processing: 0,
      PendingPayment: 0,
      Cancelled: 0,
    };
    
    allOrders.forEach((order) => {
      const status = order.status;
      counts[status] = (counts[status] || 0) + 1;
    });
    
    return counts;
  };

  const statusCounts = calculateStatusCounts();

  const filterOrders = (
    status: string,
    search: string,
    dateRange: DateRange | undefined
  ) => {
    let filtered = [...allOrders];

    // Filter by status
    if (status && status !== "all") {
      filtered = filtered.filter((order) => order.status === status);
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.orderCode?.toLowerCase().includes(searchLower) ||
          order.name?.toLowerCase().includes(searchLower) ||
          order.userId?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by date
    if (dateRange?.from) {
      filtered = filtered.filter((order) => {
        const orderDate = parseISO(order.orderDate);
        if (dateRange.from && dateRange.to && !isSameDay(dateRange.from, dateRange.to)) {
          // Range filtering
          return isWithinInterval(orderDate, {
            start: startOfDay(dateRange.from),
            end: endOfDay(dateRange.to || dateRange.from),
          });
        } else {
          // Single day filtering
          return dateRange.from ? isSameDay(orderDate, dateRange.from) : false;
        }
      });
    }

    setFilteredOrders(filtered);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const params = new URLSearchParams(searchParams.toString());
    
    if (tabId === "all") {
      params.delete("status");
    } else {
      params.set("status", tabId);
    }
    
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
    
    // Refresh data when tab changes
    fetchOrders(1, size);
  };

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (searchValue) {
      params.set("search", searchValue);
    } else {
      params.delete("search");
    }
    
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
    
    // Refresh data when search changes
    fetchOrders(1, size);
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
    
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
    
    // Refresh data when date range changes
    fetchOrders(1, size);
  };

  const handleReset = () => {
    setSearchValue("");
    setDateRange(undefined);
    setActiveTab("all");
    router.push(`?size=${size}`, { scroll: false });
    
    // Refresh data when filters are reset
    fetchOrders(1, size);
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      fetchOrders(page + 1, size);
    }
  };

  const handleSizeChange = (newSize: number) => {
    setSize(newSize);
    setPage(1);
    
    const params = new URLSearchParams(searchParams.toString());
    params.set("size", newSize.toString());
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
    
    fetchOrders(1, newSize);
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
    <div>
      <FilterBar
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        onSearch={handleSearch}
        onReset={handleReset}
      />
      
      <div className="flex bg-white rounded-lg border border-gray-200 shadow-sm h-[calc(100vh-12rem)] overflow-hidden">
        <StatusSidebar
          activeTab={activeTab}
          statusCounts={statusCounts}
          onTabChange={handleTabChange}
          statusConfig={statusConfig}
        />
        
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
                  ({filteredOrders.length} đơn hàng)
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
          
          <OrderGrid
            filteredOrders={filteredOrders}
            displayCount={filteredOrders.length}
            activeTab={activeTab}
            statusConfig={statusConfig}
            onLoadMore={handleLoadMore}
          />
        </div>
      </div>
    </div>
  );
}