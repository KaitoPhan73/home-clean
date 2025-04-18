/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import { format, isSameDay, isWithinInterval, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { TOrderLaundryResponse } from "@/schema/VinLaudry/laundry-order";
import FilterBar from "./FilterBar";
import OrderGrid from "./OrderGrid";
import StatusSidebar from "./StatusSidebar";

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
  data,
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
    Canceled: 0,
  });
  const [filteredBySearchAndDate, setFilteredBySearchAndDate] = useState<TOrderLaundryResponse[]>(data);
  const [filteredOrders, setFilteredOrders] = useState<TOrderLaundryResponse[]>(data);
  const [shouldUpdateUrl, setShouldUpdateUrl] = useState(false);

  useEffect(() => {
    const search = searchParams.get("search") || "";
    setSearchTerm(search);

    const urlSize = searchParams.get("size") || pageSize.toString();
    setSize(Number(urlSize));
  }, [searchParams, pageSize]);

  // First filter step: Apply search and date filters
  const filterBySearchAndDate = useCallback(() => {
    let result = [...data];

    // Filter by search term
    if (searchTerm) {
      result = result.filter((order) => 
        order.orderCode?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        order.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date range
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

    // Calculate status counts based on filtered data
    const counts: Record<string, number> = {
      all: result.length,
      Draft: 0,
      Paid: 0,
      Completed: 0,
      Processing: 0,
      PendingPayment: 0,
      Canceled: 0,
    };

    result.forEach((order) => {
      const orderStatus = order.status;
      if (orderStatus) counts[orderStatus] = (counts[orderStatus] || 0) + 1;
    });

    setStatusCounts(counts);
    
    return result;
  }, [data, searchTerm, dateRange]);

  // Second filter step: Apply status filter to the already filtered data
  const filterByStatus = useCallback((filteredData: TOrderLaundryResponse[]) => {
    if (activeTab === "all") {
      return filteredData;
    }
    return filteredData.filter((order) => order.status === activeTab);
  }, [activeTab]);

  // Complete filtering process
  useEffect(() => {
    const filteredBySearchDateResult = filterBySearchAndDate();
    const finalFiltered = filterByStatus(filteredBySearchDateResult);
    setFilteredOrders(finalFiltered);
  }, [filterBySearchAndDate, filterByStatus]);

  // Effect to handle URL updates
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
    // Don't update URL immediately to avoid page reload
  };

  const handleSearch = () => {
    // For explicit search actions, we do want to update the URL
    setShouldUpdateUrl(true);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    // We don't update URL immediately to avoid page reload
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setDateRange(undefined);
    setActiveTab("all");
    updateUrlParams({ size: size.toString() });
  };

  const handleSizeChange = (newSize: number) => {
    setSize(newSize);
    // For size changes, we do want to update the URL
    setShouldUpdateUrl(true);
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
        totalItems={filteredBySearchAndDate.length}
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