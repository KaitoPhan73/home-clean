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
  addDays,
} from "date-fns";
import { TOrderResponse } from "@/schema/order.schema";

interface OrdersData {
  items: TOrderResponse[];
  totalPages: number;
  total?: number; // Add the 'total' property to match the object structure
}

export const useStaffAssignBoard = () => {
  const [ordersData, setOrdersData] = useState<OrdersData>({
    items: [],
    totalPages: 100,
  });
  const [filteredOrders, setFilteredOrders] = useState<TOrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<"all" | "single" | "range">("all");
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  const [fromDate, setFromDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  const [toDate, setToDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  
  // Function to safely parse dates with fallback
  const safeParseDate = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    try {
      const parsed = parseISO(dateString);
      return isValid(parsed) ? parsed : null;
    } catch (e) {
      console.error("Error parsing date:", dateString, e);
      return null;
    }
  };

  const filterOrders = useCallback(() => {
    if (!ordersData.items.length) {
      console.log("No orders to filter");
      setFilteredOrders([]);
      return;
    }

    try {
      // If filter mode is "all", return all orders
      if (filterMode === "all") {
        console.log("Showing all orders:", ordersData.items.length);
        setFilteredOrders(ordersData.items);
        return;
      }
      
      let filtered: TOrderResponse[] = [];
      
      if (filterMode === "single") {
        const selected = safeParseDate(selectedDate);
        if (!selected) {
          console.log("Invalid selected date:", selectedDate);
          setFilteredOrders([]);
          return;
        }
        
        filtered = ordersData.items.filter((order) => {
          const orderDate = safeParseDate(order.createdAt);
          return orderDate && isSameDay(orderDate, selected);
        });
      } else { // range mode
        const from = safeParseDate(fromDate);
        const to = safeParseDate(toDate);
        
        if (!from || !to) {
          console.log("Invalid date range:", fromDate, toDate);
          setFilteredOrders([]);
          return;
        }
        
        // Add one day to 'to' date to include the full day in the range
        const toDateInclusive = addDays(to, 1);
        
        filtered = ordersData.items.filter((order) => {
          const orderDate = safeParseDate(order.createdAt);
          return orderDate && isAfter(orderDate, from) && isBefore(orderDate, toDateInclusive);
        });
      }
      
      console.log(`Filtered ${filtered.length} orders out of ${ordersData.items.length}`);
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

      // Process and enhance the items as in your original code
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
        // Rest of your fields as in original code
      }));

      console.log("Processed", enhancedItems.length, "orders");
      setOrdersData({
        items: enhancedItems,
        total: orderPayload.total || 0,
        totalPages: orderPayload.totalPages || 0,});
    } catch (error) {
      console.error("Error loading data:", error);
      setError("An error occurred while loading order data");
    } finally {
      setIsLoading(false);
    }
  }, [groupId]);

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
    
    setFilterMode("all"); // Reset to "all" mode
    setSelectedDate(today);
    setFromDate(today);
    setToDate(today);
    
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
    
    // Ensure 'to' date is not before 'from' date
    const from = parseISO(newDate);
    const to = parseISO(toDate);
    if (isValid(from) && isValid(to) && isAfter(from, to)) {
      setToDate(newDate);
    }
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    console.log("To date changed:", newDate);
    setToDate(newDate);
    
    // Ensure 'from' date is not after 'to' date
    const from = parseISO(fromDate);
    const to = parseISO(newDate);
    if (isValid(from) && isValid(to) && isBefore(to, from)) {
      setFromDate(newDate);
    }
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