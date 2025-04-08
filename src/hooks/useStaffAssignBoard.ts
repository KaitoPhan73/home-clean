/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { getAllOrdersByGroupId } from "@/apis/group";
import { getCookie } from "cookies-next";
import {
  format,
  parseISO,
  isValid,
  isSameDay,
  isAfter,
  isBefore,
} from "date-fns";
import { TOrderResponse } from "@/schema/order.schema";


interface OrdersData {
  items: TOrderResponse[];
  totalPages: number;
}

export const useStaffAssignBoard = () => {
  const [ordersData, setOrdersData] = useState<OrdersData>({
    items: [],
    totalPages: 0,
  });
  const [filteredOrders, setFilteredOrders] = useState<TOrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<"single" | "range">("single");
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  const [fromDate, setFromDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  const [toDate, setToDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  
  const [appliedFilter, setAppliedFilter] = useState({
    filterMode: "single" as "single" | "range",
    selectedDate: format(new Date(), "yyyy-MM-dd"),
    fromDate: format(new Date(), "yyyy-MM-dd"),
    toDate: format(new Date(), "yyyy-MM-dd"),
  });

  const filterOrders = useCallback(() => {
    if (!ordersData.items.length) {
      console.log("No orders to filter");
      setFilteredOrders([]);
      return;
    }

    let filtered: TOrderResponse[] = [];
    try {
      if (filterMode === "single") {
        const selected = parseISO(selectedDate);
        if (!isValid(selected)) {
          console.log("Invalid selected date:", selectedDate);
          setFilteredOrders([]);
          return;
        }
        filtered = ordersData.items.filter((order) => {
          if (!order.createdAt) return false;
          try {
            const orderDate = parseISO(order.createdAt);
            return isValid(orderDate) && isSameDay(orderDate, selected);
          } catch (e) {
            console.error("Date parsing error:", e);
            return false;
          }
        });
      } else {
        const from = parseISO(fromDate);
        const to = parseISO(toDate);
        if (!isValid(from) || !isValid(to)) {
          console.log("Invalid date range:", fromDate, toDate);
          setFilteredOrders([]);
          return;
        }
        filtered = ordersData.items.filter((order) => {
          if (!order.createdAt) return false;
          try {
            const orderDate = parseISO(order.createdAt);
            return (
              isValid(orderDate) &&
              (isSameDay(orderDate, from) || isAfter(orderDate, from)) &&
              (isSameDay(orderDate, to) || isBefore(orderDate, to))
            );
          } catch (e) {
            console.error("Date parsing error:", e);
            return false;
          }
        });
      }
      console.log("Filtered", filtered.length, "orders");
      setFilteredOrders(filtered);
    } catch (error) {
      console.error("Error filtering orders:", error);
      setFilteredOrders([]);
    }
  }, [filterMode, selectedDate, fromDate, toDate, ordersData.items]);

  const loadData = useCallback(async () => {
    if (!groupId) {
      console.log("No groupId to load data");
      setError("Group information not found");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Starting data load for groupId:", groupId);
      const orderResponse = await getAllOrdersByGroupId(groupId);
      console.log("API data received:", orderResponse);

      const orderPayload = orderResponse?.payload || {
        items: [],
        totalPages: 0,
      };

      const enhancedItems = orderPayload.items.map((item: any) => ({
        ...item,
        id: item.id || `temp-${Math.random().toString(36).substring(2, 10)}`,
        code:
          item.code ||
          `ORD-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        totalAmount: typeof item.totalAmount === "number" ? item.totalAmount : 0,
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || item.createdAt || new Date().toISOString(),
        status: standardizeStatus(item.status),
        note: item.note ?? null,
        price: item.price ?? item.totalAmount ?? null,
        address: item.address ?? "Unknown Address",
        bookingDate: item.bookingDate ?? null,
        employeeId: item.employeeId ?? null,
        employeeRating: item.employeeRating ?? null,
        customerFeedback: item.customerFeedback ?? null,
        serviceType: item.serviceType ?? "General",
        distanceToCustomer: item.distanceToCustomer ?? 0,
        priorityLevel: item.priorityLevel ?? "Normal",
        notes: item.notes ?? null,
        discountCode: item.discountCode ?? null,
        discountAmount: item.discountAmount ?? null,
        realTimeStatus: item.realTimeStatus ?? "Draft",
        jobStartTime: item.jobStartTime ?? null,
        jobEndTime: item.jobEndTime ?? null,
        emergencyRequest: Boolean(item.emergencyRequest),
        cleaningAreas: Array.isArray(item.cleaningAreas)
          ? item.cleaningAreas
          : [],
        itemsToClean: Array.isArray(item.itemsToClean) ? item.itemsToClean : [],
        estimatedArrivalTime: item.estimatedArrivalTime ?? null,
        estimatedDuration: item.estimatedDuration ?? null,
        actualDuration: item.actualDuration ?? null,
        cancellationDeadline: item.cancellationDeadline ?? null,
        timeSlotId: item.timeSlotId ?? "temp-1234",
        serviceId: item.serviceId ?? "temp-1234",
        userId: item.userId ?? "temp-user",
        extraServices: Array.isArray(item.extraServices)
          ? item.extraServices
          : [],
        options: Array.isArray(item.options) ? item.options : [],
        cleaningToolsRequired:
          item.cleaningToolsRequired !== undefined
            ? Boolean(item.cleaningToolsRequired)
            : null,
        cleaningToolsProvided:
          item.cleaningToolsProvided !== undefined
            ? Boolean(item.cleaningToolsProvided)
            : null,
      }));

      console.log("Processed", enhancedItems.length, "orders");
      setOrdersData({
        items: enhancedItems,
        totalPages: orderPayload.totalPages,
      });
    } catch (error) {
      console.error("Error loading data:", error);
      setError("An error occurred while loading order data");
    } finally {
      setIsLoading(false);
    }
  }, [groupId]);

  const handleSearch = useCallback(() => {
    setAppliedFilter({
      filterMode,
      selectedDate,
      fromDate,
      toDate,
    });
    loadData();
  }, [filterMode, selectedDate, fromDate, toDate, loadData]);

  useEffect(() => {
    const fetchInitialData = async () => {
      console.log("Page just loaded, starting to get data...");
      setIsLoading(true);
      try {
        const userRaw = getCookie("user");
        console.log("User cookie:", userRaw);
        if (!userRaw) {
          setError("User information not found in cookies");
          setIsLoading(false);
          return;
        }

        const user = JSON.parse(userRaw as string);
        console.log("User data from cookie:", user);
        if (!user?.groupId) {
          setError("groupId not found in cookie");
          setIsLoading(false);
          return;
        }

        setGroupId(user.groupId);
      } catch (error) {
        console.error("Error getting initial data:", error);
        setError("Error loading initial data");
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);
  useEffect(() => {
    if (groupId) {
      loadData();
    }
  }, [groupId, loadData]);

  useEffect(() => {
    console.log("OrdersData changed, filtering list...");
    filterOrders();
  }, [filterOrders, ordersData]);

  const handleRefresh = useCallback(() => {
    const today = format(new Date(), "yyyy-MM-dd");
    
    setFilterMode("single");
    setSelectedDate(today);
    setFromDate(today);
    setToDate(today);
    
    setAppliedFilter({
      filterMode: "single",
      selectedDate: today,
      fromDate: today,
      toDate: today,
    });
    
    loadData();
  }, [loadData]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Selected date changed:", e.target.value);
    setSelectedDate(e.target.value);
  };

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    console.log("From date changed:", newDate);
    setFromDate(newDate);
    const from = parseISO(newDate);
    const to = parseISO(toDate);
    if (isValid(from) && isValid(to) && isAfter(from, to)) setToDate(newDate);
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    console.log("To date changed:", newDate);
    setToDate(newDate);
    const from = parseISO(fromDate);
    const to = parseISO(newDate);
    if (isValid(from) && isValid(to) && isBefore(to, from)) setFromDate(newDate);
  };

  return {
    ordersData,
    filteredOrders,
    isLoading,
    error,
    groupId,
    filterMode,
    setFilterMode,
    selectedDate,
    fromDate,
    toDate,
    handleRefresh,
    handleDateChange,
    handleFromDateChange,
    handleToDateChange,
    handleSearch
  };
};

const standardizeStatus = (status: string | undefined): string => {
  if (!status) return "Draft";
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, "");
  switch (normalizedStatus) {
    case "draft":
    case "new":
    case "created":
    case "tạomới":
      return "Draft";
    case "pending":
    case "waiting":
    case "inreview":
    case "chờxử lý":
    case "chờduyệt":
      return "Pending";
    case "accepted":
    case "approved":
    case "inprogress":
    case "processing":
    case "đãduyệt":
    case "đangxử lý":
      return "Accepted";
    case "completed":
    case "done":
    case "finished":
    case "hoànthành":
      return "Completed";
    case "cancelled":
    case "canceled":
    case "đãhủy":
    case "hủy":
      return "Cancelled";
    default:
      return "Draft";
  }
};