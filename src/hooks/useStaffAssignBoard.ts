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

export interface OrderItem {
  id: string;
  note: string | null;
  price: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  address: string;
  bookingDate: string | null;
  employeeId: string | null;
  employeeRating: number | null;
  customerFeedback: string | null;
  cleaningToolsRequired: boolean | null;
  cleaningToolsProvided: boolean | null;
  serviceType: string;
  distanceToCustomer: number;
  priorityLevel: string;
  notes: string | null;
  discountCode: string | null;
  discountAmount: number | null;
  totalAmount: number;
  realTimeStatus: string;
  jobStartTime: string | null;
  jobEndTime: string | null;
  emergencyRequest: boolean;
  cleaningAreas: string[];
  itemsToClean: string[];
  estimatedArrivalTime: string | null;
  estimatedDuration: number | null;
  actualDuration: number | null;
  cancellationDeadline: string | null;
  code: string;
  timeSlotId: string;
  serviceId: string;
  userId: string;
  extraServices: string[];
  options: string[];
}

interface OrdersData {
  items: OrderItem[];
  totalPages: number;
}

export const useStaffAssignBoard = () => {
  const [ordersData, setOrdersData] = useState<OrdersData>({
    items: [],
    totalPages: 0,
  });
  const [filteredOrders, setFilteredOrders] = useState<OrderItem[]>([]);
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
  const [dataLoaded, setDataLoaded] = useState(false);

  const filterOrders = useCallback(() => {
    if (!ordersData.items.length) {
      console.log("Không có order để lọc");
      setFilteredOrders([]);
      return;
    }

    let filtered: OrderItem[] = [];
    try {
      if (filterMode === "single") {
        const selected = parseISO(selectedDate);
        if (!isValid(selected)) {
          console.log("Ngày chọn không hợp lệ:", selectedDate);
          setFilteredOrders([]);
          return;
        }
        filtered = ordersData.items.filter((order) => {
          if (!order.createdAt) return false;
          return isSameDay(parseISO(order.createdAt), selected);
        });
      } else {
        const from = parseISO(fromDate);
        const to = parseISO(toDate);
        if (!isValid(from) || !isValid(to)) {
          console.log("Khoảng ngày không hợp lệ:", fromDate, toDate);
          setFilteredOrders([]);
          return;
        }
        filtered = ordersData.items.filter((order) => {
          if (!order.createdAt) return false;
          const orderDate = parseISO(order.createdAt);
          return (
            isValid(orderDate) &&
            (isSameDay(orderDate, from) || isAfter(orderDate, from)) &&
            (isSameDay(orderDate, to) || isBefore(orderDate, to))
          );
        });
      }
      console.log("Đã lọc được", filtered.length, "order");
      setFilteredOrders(filtered);
    } catch (error) {
      console.error("Lỗi khi lọc order:", error);
      setFilteredOrders([]);
    }
  }, [filterMode, selectedDate, fromDate, toDate, ordersData.items]);

  const loadData = useCallback(async () => {
    if (!groupId) {
      console.log("Không có groupId để tải dữ liệu");
      setError("Không tìm thấy thông tin nhóm để tải dữ liệu");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Bắt đầu tải dữ liệu cho groupId:", groupId);
      const orderResponse = await getAllOrdersByGroupId(groupId);
      console.log("Dữ liệu từ API:", orderResponse);

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

      console.log("Đã xử lý", enhancedItems.length, "order");
      setOrdersData({
        items: enhancedItems,
        totalPages: orderPayload.totalPages,
      });
      setDataLoaded(true);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      setError("Đã xảy ra lỗi khi tải dữ liệu đơn hàng");
    } finally {
      setIsLoading(false);
    }
  }, [groupId]);

  // Tải dữ liệu ngay khi vào trang
  useEffect(() => {
    const fetchInitialData = async () => {
      console.log("Trang vừa load, bắt đầu lấy dữ liệu...");
      setIsLoading(true);
      try {
        const userRaw = getCookie("user");
        console.log("Cookie user:", userRaw);
        if (!userRaw) {
          setError("Không tìm thấy thông tin người dùng trong cookie");
          setIsLoading(false);
          return;
        }

        const user = JSON.parse(userRaw as string);
        console.log("Dữ liệu user từ cookie:", user);
        if (!user?.groupId) {
          setError("Không tìm thấy groupId trong cookie");
          setIsLoading(false);
          return;
        }

        setGroupId(user.groupId);
        await loadData(); // Tải dữ liệu ngay khi có groupId
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu ban đầu:", error);
        setError("Lỗi khi tải dữ liệu ban đầu");
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [loadData]);

  // Lọc lại dữ liệu khi ordersData thay đổi
  useEffect(() => {
    console.log("OrdersData thay đổi, lọc lại danh sách...");
    filterOrders();
  }, [filterOrders, ordersData]);

  const handleRefresh = () => {
    console.log("Nhấn nút làm mới, cập nhật lại dữ liệu...");
    loadData(); // Nút này chỉ dùng để cập nhật khi có thay đổi
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Ngày chọn thay đổi:", e.target.value);
    setSelectedDate(e.target.value);
  };

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    console.log("Từ ngày thay đổi:", newDate);
    setFromDate(newDate);
    const from = parseISO(newDate);
    const to = parseISO(toDate);
    if (isValid(from) && isValid(to) && isAfter(from, to)) setToDate(newDate);
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    console.log("Đến ngày thay đổi:", newDate);
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