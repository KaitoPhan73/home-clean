/* eslint-disable @typescript-eslint/no-unused-vars */
// OrderTable.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import { format, isSameDay, isWithinInterval, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import FilterBar from "./FilterBar";
import OrderGrid from "./OrderGrid";
import StatusSidebar from "./StatusSidebar";
import { toast } from "@/hooks/use-toast";
import { useSignalRContext } from "@/context/signalr-provider";
import { TOrderLaundryResponse } from "@/schema/VinLaudry/laundry-order";

interface OrderCardGridProps {
  data: TOrderLaundryResponse[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
  status: string;
  dateRange: DateRange | undefined;
  isLoading?: boolean;
  onRefresh?: () => void;
  onCreateOrder?: () => void;
}

const OrderTable = ({
  data: initialData,
  totalItems,
  page,
  pageSize,
  totalPages,
  status,
  dateRange: initialDateRange,
  isLoading = false,
  onRefresh,
  onCreateOrder,
}: OrderCardGridProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { connectionStatus, notifications } = useSignalRContext();
  const [data, setData] = useState<TOrderLaundryResponse[]>(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(status);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(initialDateRange);
  const [size, setSize] = useState(pageSize);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({
    all: 0,
    Draft: 0,
    Paid: 0,
    Completed: 0,
    Processing: 0,
    PendingPayment: 0,
    Cancelled: 0,
  });
  const [filteredBySearchAndDate, setFilteredBySearchAndDate] = useState<TOrderLaundryResponse[]>(data);
  const [filteredOrders, setFilteredOrders] = useState<TOrderLaundryResponse[]>(data);
  const [shouldUpdateUrl, setShouldUpdateUrl] = useState(false);
  const [realtimeEnabled, setRealtimeEnabled] = useState(true);

  const handleRefresh = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: pageSize.toString(),
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

      const response = await fetch(`/api/orders?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch orders");

      const { items, total, totalPages: newTotalPages } = await response.json();
      setData(items);
      // Optionally update other states like totalItems, totalPages if needed
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
    }
  }, [page, pageSize, searchTerm, activeTab, dateRange]);

  // Listen for orderStatusChanged event
  useEffect(() => {
    const handleOrderStatusChanged = (event: CustomEvent) => {
      if (!realtimeEnabled) return;
      
      const { orderId, status } = event.detail;
      setData((prevData) =>
        prevData.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
      toast({
        title: "Cập nhật trạng thái",
        description: `Đơn hàng #${orderId} đã được cập nhật thành ${status}`,
        variant: "default",
      });
    };

    window.addEventListener("orderStatusChanged", handleOrderStatusChanged as EventListener);

    return () => {
      window.removeEventListener("orderStatusChanged", handleOrderStatusChanged as EventListener);
    };
  }, [realtimeEnabled]);

  // Listen for orderCreated event
  useEffect(() => {
    const handleOrderCreated = (event: CustomEvent) => {
      if (!realtimeEnabled) return;
      
      const { order }: { order: TOrderLaundryResponse } = event.detail;
      setData((prevData) => [order, ...prevData]);
      toast({
        title: "Đơn hàng mới",
        description: `Đơn hàng #${order.orderCode} đã được tạo`,
        variant: "default",
      });
    };

    window.addEventListener("orderCreated", handleOrderCreated as EventListener);

    return () => {
      window.removeEventListener("orderCreated", handleOrderCreated as EventListener);
    };
  }, [realtimeEnabled]);

  // Sync initialData when changed from server
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    const search = searchParams.get("search") || "";
    setSearchTerm(search);

    const urlSize = searchParams.get("size") || pageSize.toString();
    setSize(Number(urlSize));
  }, [searchParams, pageSize]);

  const filterBySearchAndDate = useCallback(() => {
    let result = [...data];

    if (searchTerm) {
      result = result.filter((order) =>
        order.orderCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (dateRange?.from) {
      result = result.filter((order) => {
        const orderDate = parseISO(order.createdAt as string);
        if (dateRange.to) {
          return isWithinInterval(orderDate, { start: dateRange.from ?? new Date(0), end: dateRange.to ?? new Date(0) });
        }
        return dateRange.from ? isSameDay(orderDate, dateRange.from) : false;
      });
    }

    setFilteredBySearchAndDate(result);

    // Calculate counts for each status
    const counts: Record<string, number> = {
      all: result.length, // Fix: Count of filtered results for "all" tab
      Draft: 0,
      Paid: 0,
      Completed: 0,
      Processing: 0,
      PendingPayment: 0,
      Cancelled: 0,
    };

    result.forEach((order) => {
      const orderStatus = order.status;
      if (orderStatus) counts[orderStatus] = (counts[orderStatus] || 0) + 1;
    });

    setStatusCounts(counts);
    return result;
  }, [data, searchTerm, dateRange]);

  const filterByStatus = useCallback((filteredData: TOrderLaundryResponse[]) => {
    if (activeTab === "all") {
      return filteredData;
    }
    return filteredData.filter((order) => order.status === activeTab);
  }, [activeTab]);

  useEffect(() => {
    const filteredBySearchDateResult = filterBySearchAndDate();
    const finalFiltered = filterByStatus(filteredBySearchDateResult);
    setFilteredOrders(finalFiltered);
  }, [filterBySearchAndDate, filterByStatus]);

  useEffect(() => {
    if (shouldUpdateUrl) {
      const params: Record<string, string> = {
        size: size.toString(),
      };
      if (activeTab !== "all") {
        params.status = activeTab;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }
      if (dateRange?.from) {
        params.startDate = format(dateRange.from, "yyyy-MM-dd");
        if (dateRange.to && !isSameDay(dateRange.from, dateRange.to)) {
          params.endDate = format(dateRange.to, "yyyy-MM-dd");
        }
      }

      const urlParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) urlParams.set(key, value);
      });
      router.push(`?${urlParams.toString()}`, { scroll: false });
      setShouldUpdateUrl(false);
    }
  }, [activeTab, dateRange, router, searchTerm, shouldUpdateUrl, size]);

  const updateUrlParams = useCallback((params: Record<string, string>) => {
    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) urlParams.set(key, value);
    });
    router.push(`?${urlParams.toString()}`, { scroll: false });
  }, [router]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleSearch = () => {
    setShouldUpdateUrl(true);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setDateRange(undefined);
    setActiveTab("all");
    updateUrlParams({ size: size.toString() });
  };

  const handleSizeChange = (newSize: number) => {
    setSize(newSize);
    setShouldUpdateUrl(true);
  };

  const toggleRealtime = () => {
    setRealtimeEnabled(prev => !prev);
    toast({
      title: realtimeEnabled ? "Chế độ real-time đã tắt" : "Chế độ real-time đã bật",
      description: realtimeEnabled 
        ? "Bạn sẽ cần làm mới thủ công để cập nhật đơn hàng" 
        : "Đơn hàng sẽ tự động cập nhật khi có thay đổi",
      variant: "default",
    });
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
      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        dateRange={dateRange}
        onDateChange={handleDateRangeChange}
        onClearFilters={handleClearFilters}
        onSearch={handleSearch}
        isLoading={isLoading}
        onRefresh={onRefresh}
        onCreateOrder={onCreateOrder}
        totalItems={statusCounts.all}
        realtimeEnabled={realtimeEnabled}
        onToggleRealtime={toggleRealtime}
        connectionStatus={connectionStatus}
      />
      <div className="flex bg-white overflow-hidden h-[calc(100vh-16rem)]">
        <StatusSidebar
          activeTab={activeTab}
          statusCounts={statusCounts}
          onTabChange={handleTabChange}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <OrderGrid
            filteredOrders={filteredOrders}
            activeTab={activeTab}
            dateRangeText={dateRangeText}
            isLoading={isLoading}
            pageSize={size}
            onSizeChange={handleSizeChange}
            totalItems={filteredOrders.length}
          />
        </div>
      </div>
    </Card>
  );
};

export default OrderTable;