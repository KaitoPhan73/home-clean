/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  Calendar,
  ArrowRightCircle,
  ChevronDown,
} from "lucide-react";
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
import { useSignalRContext } from "@/context/signalr-provider";

interface EnhancedOrder extends TOrderResponse {
  userFullName?: string;
  houseNo?: string;
}

const INITIAL_LOAD_LIMIT = 20;
const LAZY_LOAD_BATCH = 10;

const useStaffAssignBoard = () => {
  const { notifications, connectionId } = useSignalRContext();

  const [ordersData, setOrdersData] = useState<EnhancedOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState<EnhancedOrder[]>([]);
  const [displayedItems, setDisplayedItems] = useState<EnhancedOrder[]>([]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD_LIMIT);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<"single" | "range">("single");
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [fromDate, setFromDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [toDate, setToDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [filterApplied, setFilterApplied] = useState(false);
  const [userDataCache, setUserDataCache] = useState<Record<string, string>>(
    {}
  );
  const [houseDataCache, setHouseDataCache] = useState<Record<string, string>>(
    {}
  );
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { connectionStatus } = useSignalRContext();

  const extractHouseId = useCallback((address: string): string => {
    if (!address) return "";
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        address
      );
    const houseIdMatch = address.match(
      /^house_([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i
    );
    return isUUID ? address : houseIdMatch ? houseIdMatch[1] : "";
  }, []);

  const filterOrders = useCallback(() => {
    if (!ordersData.length) return [];

    try {
      let filtered = [];
      if (filterMode === "single") {
        const selected = parseISO(selectedDate);
        filtered = ordersData.filter((order) => {
          if (!order.createdAt) return false;
          const orderDate = parseISO(order.createdAt);
          return orderDate.toDateString() === selected.toDateString();
        });
      } else {
        const from = parseISO(fromDate);
        const to = parseISO(toDate);
        filtered = ordersData.filter((order) => {
          if (!order.createdAt) return false;
          const orderDate = parseISO(order.createdAt);
          return orderDate >= from && orderDate <= to;
        });
      }

      // Apply search filter if search query exists
      if (searchQuery) {
        const query = searchQuery.toLowerCase().trim();
        filtered = filtered.filter((order) => {
          return (
            (order.code && order.code.toLowerCase().includes(query)) ||
            (order.userFullName &&
              order.userFullName.toLowerCase().includes(query)) ||
            (order.houseNo && order.houseNo.toLowerCase().includes(query))
          );
        });
      }

      return filtered;
    } catch (error) {
      console.error("Error filtering orders:", error);
      return [];
    }
  }, [filterMode, selectedDate, fromDate, toDate, ordersData, searchQuery]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  // Xử lý sự kiện orderStatusChanged
  useEffect(() => {
    const handleOrderStatusChanged = (event: CustomEvent) => {
      const { orderId, status } = event.detail;
      setOrdersData((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
    };

    window.addEventListener(
      "orderStatusChanged",
      handleOrderStatusChanged as EventListener
    );
    return () => {
      window.removeEventListener(
        "orderStatusChanged",
        handleOrderStatusChanged as EventListener
      );
    };
  }, []);

  // Xử lý sự kiện orderCreated
  useEffect(() => {
    const handleOrderCreated = async (event: CustomEvent) => {
      const { order } = event.detail;
      const houseId = extractHouseId(order.address);

      let userFullName = userDataCache[order.userId] || "Không xác định";
      let houseNo = houseDataCache[houseId] || order.address;

      if (!userDataCache[order.userId]) {
        try {
          const userResponse = await getUserById(order.userId);
          userFullName = userResponse.payload.fullName;
          setUserDataCache((prev) => ({
            ...prev,
            [order.userId]: userFullName,
          }));
        } catch {
          userFullName = "Không xác định";
        }
      }

      if (houseId && !houseDataCache[houseId]) {
        try {
          const houseResponse = await getHouseById(houseId);
          houseNo = houseResponse.payload.no;
          setHouseDataCache((prev) => ({ ...prev, [houseId]: houseNo }));
        } catch {
          houseNo = order.address;
        }
      }

      const newOrder: EnhancedOrder = {
        ...order,
        userFullName,
        houseNo,
      };

      setOrdersData((prevOrders) => [...prevOrders, newOrder]);
    };

    window.addEventListener(
      "orderCreated",
      handleOrderCreated as unknown as EventListener
    );
    return () => {
      window.removeEventListener(
        "orderCreated",
        handleOrderCreated as unknown as EventListener
      );
    };
  }, [userDataCache, houseDataCache, extractHouseId]);

  useEffect(() => {
    if (filterApplied) {
      const filtered = filterOrders();
      setFilteredOrders(filtered);
      setVisibleCount(INITIAL_LOAD_LIMIT);
      setDisplayedItems(filtered.slice(0, INITIAL_LOAD_LIMIT));
    }
  }, [
    filterMode,
    selectedDate,
    fromDate,
    toDate,
    ordersData,
    filterApplied,
    filterOrders,
  ]);

  useEffect(() => {
    setDisplayedItems(filteredOrders.slice(0, visibleCount));
  }, [filteredOrders, visibleCount]);

  const loadMoreItems = useCallback(() => {
    if (visibleCount < filteredOrders.length) {
      setIsLoadingMore(true);
      setTimeout(() => {
        setVisibleCount((prev) =>
          Math.min(prev + LAZY_LOAD_BATCH, filteredOrders.length)
        );
        setIsLoadingMore(false);
      }, 150);
    }
  }, [filteredOrders.length, visibleCount]);

  const updateEnhancedItems = useCallback(
    (
      baseItems: TOrderResponse[],
      userCache: Record<string, string>,
      houseCache: Record<string, string>
    ) => {
      const enhanced = baseItems.map((item: TOrderResponse) => ({
        ...item,
        userFullName: userCache[item.userId] || "Không xác định",
        houseNo: houseCache[extractHouseId(item.address)] || item.address,
      }));

      setOrdersData(enhanced);
    },
    [extractHouseId]
  );

  const loadData = useCallback(async () => {
    if (!groupId) return setError("Không tìm thấy thông tin nhóm");
    setError(null);

    try {
      const response = await getAllOrdersByGroupId(groupId);
      const items = response?.payload?.items || [];

      if (items.length === 0) {
        setOrdersData([]);
        setFilteredOrders([]);
        setDisplayedItems([]);
        setFilterApplied(true);
        return;
      }

      const initialItems = items.map((item: TOrderResponse) => ({
        ...item,
        userFullName: userDataCache[item.userId] || "Đang tải...",
        houseNo: houseDataCache[extractHouseId(item.address)] || "Đang tải...",
      }));

      setOrdersData(initialItems);
      setFilterApplied(true);

      const userIds = [
        ...new Set(
          items.map((item: TOrderResponse) => item.userId).filter(Boolean)
        ),
      ];
      const houseIds = [
        ...new Set(
          items
            .map((item: TOrderResponse) => extractHouseId(item.address))
            .filter(Boolean)
        ),
      ];

      const userIdsToFetch = userIds.filter((id) => !userDataCache[id]);
      const houseIdsToFetch = houseIds.filter((id) => !houseDataCache[id]);

      if (userIdsToFetch.length || houseIdsToFetch.length) {
        const fetchDetails = async () => {
          const BATCH_SIZE = 5;
          const newUserCache = { ...userDataCache };
          for (let i = 0; i < userIdsToFetch.length; i += BATCH_SIZE) {
            const batch = userIdsToFetch.slice(i, i + BATCH_SIZE);
            const batchPromises = batch.map((id) =>
              getUserById(id)
                .then((res) => ({ id, name: res.payload.fullName }))
                .catch(() => ({ id, name: "Không xác định" }))
            );

            const batchResults = await Promise.all(batchPromises);
            batchResults.forEach(({ id, name }) => {
              newUserCache[id] = name;
            });

            setUserDataCache(newUserCache);
            updateEnhancedItems(items, newUserCache, { ...houseDataCache });

            await new Promise((r) => setTimeout(r, 10));
          }

          const newHouseCache = { ...houseDataCache };
          for (let i = 0; i < houseIdsToFetch.length; i += BATCH_SIZE) {
            const batch = houseIdsToFetch.slice(i, i + BATCH_SIZE);
            const batchPromises = batch.map((id) =>
              getHouseById(id)
                .then((res) => ({ id, no: res.payload.no }))
                .catch(() => ({ id, no: "Không có số nhà" }))
            );

            const batchResults = await Promise.all(batchPromises);
            batchResults.forEach(({ id, no }) => {
              newHouseCache[id] = no;
            });

            setHouseDataCache(newHouseCache);
            updateEnhancedItems(items, newUserCache, newHouseCache);
            await new Promise((r) => setTimeout(r, 10));
          }
        };
        fetchDetails().catch((err) => {
          console.error("Error fetching additional details:", err);
        });
      }
    } catch (error) {
      setError("Lỗi khi tải dữ liệu đơn hàng");
      console.error(error);
    } finally {
      setIsInitialLoad(false);
    }
  }, [
    groupId,
    extractHouseId,
    userDataCache,
    houseDataCache,
    updateEnhancedItems,
  ]);

  useEffect(() => {
    if (groupId) {
      loadData();
    }
  }, [groupId, loadData]);

  useEffect(() => {
    if (notifications.length > 0) {
      loadData();
    }
  }, [notifications.length, loadData]);

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

  const handleDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedDate(e.target.value);
    },
    []
  );

  const handleFromDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFromDate(e.target.value);
    },
    []
  );

  const handleToDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setToDate(e.target.value);
    },
    []
  );

  const handleRefresh = useCallback(() => {
    const today = format(new Date(), "yyyy-MM-dd");
    setSelectedDate(today);
    setFromDate(today);
    setToDate(today);
    setFilterMode("single");

    setIsRefreshing(true); // Start the refresh spinner
    loadData()
      .then(() => {
        setFilterApplied(true);
      })
      .finally(() => {
        setTimeout(() => {
          setIsRefreshing(false);
        }, 500);
      });
  }, [
    loadData,
    setFilterMode,
    setSelectedDate,
    setFromDate,
    setToDate,
    setFilterApplied,
  ]);

  const applyFilter = useCallback(() => {
    setFilterApplied(true);
  }, []);

  return {
    filteredOrders,
    displayedItems,
    isLoadingMore,
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
    loadMoreItems,
    applyFilter,
    connectionStatus,
    isRefreshing,
    isInitialLoad,
    searchQuery,
    handleSearchChange,
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
  applyFilter,
  searchQuery,
  handleSearchChange,
  isRefreshing,
}: any) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <div className="flex items-center w-full">
      <Input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Tìm kiếm theo mã đơn, tên khách hàng, địa chỉ..."
        className="w-full"
      />
    </div>
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
      <Tabs
        value={filterMode}
        onValueChange={(v) => setFilterMode(v as "single" | "range")}
        className="flex flex-col sm:flex-row items-start sm:items-center"
      >
        <TabsList className="mb-2 sm:mb-0 sm:mr-4">
          <TabsTrigger value="single">Một ngày</TabsTrigger>
          <TabsTrigger value="range">Khoảng ngày</TabsTrigger>
        </TabsList>
        <TabsContent value="single" className="mt-0">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <Input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="w-40"
            />
          </div>
        </TabsContent>
        <TabsContent value="range" className="mt-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Label className="whitespace-nowrap">Từ:</Label>
            <Input
              type="date"
              value={fromDate}
              onChange={handleFromDateChange}
              className="w-36"
            />
            <ArrowRightCircle className="hidden sm:block h-4 w-4" />
            <Label className="whitespace-nowrap">Đến:</Label>
            <Input
              type="date"
              value={toDate}
              onChange={handleToDateChange}
              className="w-36"
            />
          </div>
        </TabsContent>
      </Tabs>

      <Button onClick={applyFilter} className="mt-2 sm:mt-0">
        Áp dụng
      </Button>
    </div>

    <Button
      onClick={handleRefresh}
      variant="outline"
      className="whitespace-nowrap"
      disabled={isRefreshing}
    >
      <RefreshCw
        className={`mr-1 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
      />
      {isRefreshing ? "Đang làm mới..." : "Làm mới"}
    </Button>
  </div>
);

// Enhanced loading component
const LoadingIndicator = () => (
  <div className="flex justify-center items-center h-64 bg-gradient-to-b from-blue-50 to-white rounded-lg border border-gray-200 shadow-sm">
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-blue-200"></div>
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-t-4 border-blue-600 animate-spin"></div>
      </div>
      <p className="mt-4 text-blue-600 font-medium">Đang tải thông tin...</p>
      <p className="text-blue-400 text-sm mt-1">Vui lòng đợi trong giây lát</p>
    </div>
  </div>
);

const OrderFilter = () => {
  const {
    filteredOrders,
    displayedItems,
    isLoadingMore,
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
    loadMoreItems,
    applyFilter,
    isRefreshing,
    isInitialLoad,
    searchQuery,
    handleSearchChange,
  } = useStaffAssignBoard();

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-600 font-medium text-lg mb-2">{error}</div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="mr-1 h-4 w-4" /> Thử lại
        </Button>
      </div>
    );
  }

  let dateText = "Tất cả";
  if (filterMode === "single") {
    dateText = format(parseISO(selectedDate), "dd/MM/yyyy", { locale: vi });
  } else if (filterMode === "range") {
    dateText = `${format(parseISO(fromDate), "dd/MM/yyyy", {
      locale: vi,
    })} - ${format(parseISO(toDate), "dd/MM/yyyy", { locale: vi })}`;
  }

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg border shadow-sm">
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
          applyFilter={applyFilter}
          searchQuery={searchQuery}
          handleSearchChange={handleSearchChange}
          isRefreshing={isRefreshing}
        />
        <div className="mt-4 text-sm text-gray-600 flex items-center justify-between">
          <div>
            <span className="font-medium">Đơn hàng:</span> {dateText}
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {filteredOrders.length}
            </span>
          </div>
          {displayedItems.length > 0 &&
            displayedItems.length < filteredOrders.length && (
              <div className="text-sm text-gray-500">
                Hiển thị {displayedItems.length}/{filteredOrders.length}
              </div>
            )}
        </div>
      </div>

      {isInitialLoad || isRefreshing ? (
        <LoadingIndicator />
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white p-8 rounded-lg border text-center">
          <div className="text-gray-500 mb-4">
            Không có đơn hàng nào trong khoảng thời gian này
          </div>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="mr-1 h-4 w-4" /> Làm mới
          </Button>
        </div>
      ) : (
        <>
          <DndProvider backend={HTML5Backend}>
            <div className="task-board-container">
              <TaskBoard
                orders={displayedItems}
                groupId={groupId ?? undefined}
              />
            </div>
          </DndProvider>

          {displayedItems.length < filteredOrders.length && (
            <div className="text-center mt-4 mb-8">
              <Button
                onClick={loadMoreItems}
                variant="outline"
                disabled={isLoadingMore}
                className="px-8"
              >
                {isLoadingMore ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Đang tải...
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-2 h-4 w-4" />
                    Tải thêm ({filteredOrders.length -
                      displayedItems.length}{" "}
                    đơn hàng còn lại)
                  </>
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderFilter;
