/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Calendar, ArrowRightCircle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { getAllOrdersByGroupId } from "@/apis/group";
import { getUserById } from "@/apis/vinwallet/user";
import { getHouseById } from "@/apis/house";
import { getCookie } from "cookies-next";
import { TOrderResponse } from "@/schema/order.schema";
import { TaskBoard } from "./TaskBoard";

// Định nghĩa type mở rộng cho order
interface EnhancedOrder extends TOrderResponse {
  userFullName?: string;
  houseNo?: string;
}

const useStaffAssignBoard = () => {
  const [ordersData, setOrdersData] = useState<EnhancedOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<EnhancedOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<"single" | "range">("single");
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [fromDate, setFromDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [toDate, setToDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const filterOrders = useCallback(() => {
    if (!ordersData.length) return [];
    try {
      let filtered = [];
      if (filterMode === "single") {
        const selected = parseISO(selectedDate);
        filtered = ordersData.filter(order => {
          if (!order.createdAt) return false;
          const orderDate = parseISO(order.createdAt);
          return orderDate.toDateString() === selected.toDateString();
        });
      } else {
        const from = parseISO(fromDate);
        const to = parseISO(toDate);
        filtered = ordersData.filter(order => {
          if (!order.createdAt) return false;
          const orderDate = parseISO(order.createdAt);
          return orderDate >= from && orderDate <= to;
        });
      }
      return filtered;
    } catch (error) {
      console.error("Error filtering orders:", error);
      return [];
    }
  }, [filterMode, selectedDate, fromDate, toDate, ordersData]);

  useEffect(() => {
    const filtered = filterOrders();
    setFilteredOrders(filtered);
  }, [filterMode, selectedDate, fromDate, toDate, ordersData, filterOrders]);

  const loadData = useCallback(async () => {
    if (!groupId) return setError("Không tìm thấy thông tin nhóm");
    setIsLoading(true);
    try {
      const response = await getAllOrdersByGroupId(groupId);
      const items = response?.payload?.items || [];

      // Fetch user và house dữ liệu
      const userIds = [...new Set(items.map((item: TOrderResponse) => item.userId).filter(Boolean))];
      const houseIds = [...new Set(items.map((item: TOrderResponse) => extractHouseId(item.address)).filter(Boolean))];

      const userPromises = userIds.map(id => getUserById(id).catch(() => ({ payload: { fullName: "Không xác định" } })));
      const housePromises = houseIds.map(id => getHouseById(id).catch(() => ({ payload: { no: "Không có số nhà" } })));

      const users = await Promise.all(userPromises);
      const houses = await Promise.all(housePromises);

      const userMap = new Map(users.map((u, i) => [userIds[i], u.payload.fullName]));
      const houseMap = new Map(houses.map((h, i) => [houseIds[i], h.payload.no]));

      const enhancedItems = items.map((item: TOrderResponse) => ({
        ...item,
        userFullName: userMap.get(item.userId) || "Không xác định",
        houseNo: houseMap.get(extractHouseId(item.address)) || item.address,
      }));

      setOrdersData(enhancedItems);
    } catch (error) {
      setError("Lỗi khi tải dữ liệu đơn hàng");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    const userRaw = getCookie("user");
    if (!userRaw) return setError("Không tìm thấy thông tin người dùng");
    try {
      const user = JSON.parse(userRaw as string);
      setGroupId(user.groupId);
    } catch {
      setError("Lỗi khi tải dữ liệu người dùng");
    }
  }, []);

  useEffect(() => {
    if (groupId) loadData();
  }, [groupId, loadData]);

  const handleRefresh = () => {
    const today = format(new Date(), "yyyy-MM-dd");
    setSelectedDate(today);
    setFromDate(today);
    setToDate(today);
    setFilterMode("single");
    loadData();
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToDate(e.target.value);
  };

  const extractHouseId = (address: string): string => {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(address);
    const houseIdMatch = address.match(/^house_([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i);
    return isUUID ? address : houseIdMatch ? houseIdMatch[1] : "";
  };

  return {
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

const DateFilter = ({
  filterMode,
  setFilterMode,
  selectedDate,
  fromDate,
  toDate,
  handleDateChange,
  handleFromDateChange,
  handleToDateChange,
  handleRefresh,
}: any) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <Tabs value={filterMode} onValueChange={(v) => setFilterMode(v as "single" | "range")} className="flex items-center">
        <TabsList className="mr-2">
          <TabsTrigger value="single">Một ngày</TabsTrigger>
          <TabsTrigger value="range">Khoảng ngày</TabsTrigger>
        </TabsList>
        <TabsContent value="single" className="mt-0">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <Input type="date" value={selectedDate} onChange={handleDateChange} className="w-40" />
          </div>
        </TabsContent>
        <TabsContent value="range" className="mt-0">
          <div className="flex items-center gap-2">
            <Label>Từ:</Label>
            <Input type="date" value={fromDate} onChange={handleFromDateChange} className="w-36" />
            <ArrowRightCircle className="h-4 w-4" />
            <Label>Đến:</Label>
            <Input type="date" value={toDate} onChange={handleToDateChange} className="w-36" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
    <Button onClick={handleRefresh} variant="outline">
      <RefreshCw className="mr-1 h-4 w-4" /> Làm mới
    </Button>
  </div>
);

const StaffAssignBoard = () => {
  const {
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
  } = useStaffAssignBoard();

  if (isLoading) return <div className="flex justify-center p-6"><RefreshCw className="animate-spin h-8 w-8" /></div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  const dateText = filterMode === "single"
    ? format(parseISO(selectedDate), "dd/MM/yyyy", { locale: vi })
    : `${format(parseISO(fromDate), "dd/MM/yyyy", { locale: vi })} - ${format(parseISO(toDate), "dd/MM/yyyy", { locale: vi })}`;

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg border">
        <DateFilter
          filterMode={filterMode}
          setFilterMode={setFilterMode}
          selectedDate={selectedDate}
          fromDate={fromDate}
          toDate={toDate}
          handleDateChange={handleDateChange}
          handleFromDateChange={handleFromDateChange}
          handleToDateChange={handleToDateChange}
          handleRefresh={handleRefresh}
        />
        <div className="mt-4 text-sm text-gray-600">
          Đơn hàng: {dateText} ({filteredOrders.length})
        </div>
      </div>
      <DndProvider backend={HTML5Backend}>
        <TaskBoard orders={filteredOrders} groupId={groupId ?? undefined} />
      </DndProvider>
    </div>
  );
};

export default StaffAssignBoard;