/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// hooks/useStaffAssignBoard.ts
import { useState, useEffect } from "react";
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
  employeeRating: number | null; // Đảm bảo không undefined
  customerFeedback: string | null; // Thêm thuộc tính bắt buộc
  cleaningToolsRequired: boolean | null;
  cleaningToolsProvided: boolean | null;
  serviceType: string; // Thêm thuộc tính bắt buộc
  distanceToCustomer: number; // Thêm thuộc tính bắt buộc
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

  useEffect(() => {
    try {
      const userRaw = getCookie("user");
      if (userRaw) {
        const user = JSON.parse(userRaw as string);
        if (user?.groupId) {
          setGroupId(user.groupId);
        } else {
          setError("Không tìm thấy thông tin nhóm của bạn");
        }
      } else {
        setError("Không tìm thấy thông tin người dùng");
      }
    } catch (error) {
      setError("Lỗi khi đọc thông tin người dùng");
    }
  }, []);

  useEffect(() => {
    if (groupId) {
      loadData();
    }
  }, [groupId]);

  const filterOrders = () => {
    if (!ordersData.items.length) return;

    let filtered: OrderItem[] = [];
    if (filterMode === "single") {
      const selected = parseISO(selectedDate);
      if (!isValid(selected)) return;
      filtered = ordersData.items.filter((order) =>
        isSameDay(parseISO(order.createdAt), selected)
      );
    } else {
      const from = parseISO(fromDate);
      const to = parseISO(toDate);
      if (!isValid(from) || !isValid(to)) return;
      filtered = ordersData.items.filter((order) => {
        const orderDate = parseISO(order.createdAt);
        return (
          isValid(orderDate) &&
          (isSameDay(orderDate, from) || isAfter(orderDate, from)) &&
          (isSameDay(orderDate, to) || isBefore(orderDate, to))
        );
      });
    }
    setFilteredOrders(filtered);
  };

  const loadData = async () => {
    if (!groupId) {
      setError("Không tìm thấy thông tin nhóm để tải dữ liệu");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const orderResponse = await getAllOrdersByGroupId(groupId);
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
        employeeRating: item.employeeRating ?? null, // Đảm bảo không undefined
        customerFeedback: item.customerFeedback ?? null, // Thêm giá trị mặc định
        serviceType: item.serviceType ?? "General", // Thêm giá trị mặc định
        distanceToCustomer: item.distanceToCustomer ?? 0, // Thêm giá trị mặc định
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

      setOrdersData({ items: enhancedItems, totalPages: orderPayload.totalPages });
      setError(null);
      filterOrders();
    } catch (error) {
      setError("Đã xảy ra lỗi khi tải dữ liệu đơn hàng");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => loadData();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSelectedDate(e.target.value);

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setFromDate(newDate);
    const from = parseISO(newDate);
    const to = parseISO(toDate);
    if (isValid(from) && isValid(to) && isAfter(from, to)) setToDate(newDate);
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
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