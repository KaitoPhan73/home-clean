/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useCallback } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getAllGroupsInCreateStaff } from "@/apis/group";
import { getAllOrdersByGroupId } from "@/apis/group";
import { getAllStaffStatus } from "@/apis/staff";
import { getUserById } from "@/apis/vinwallet/user";
import { getHouseById } from "@/apis/house";
import { getManagerById } from "@/apis/manager";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { RefreshCw, Users, Package, ClipboardList, AlertCircle, Search, Calendar, ArrowRightCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { TGroupResponse } from "@/schema/group.schema";
import { TOrderResponse } from "@/schema/order.schema";
import { TManagerResponse } from "@/schema/manager.schema";
import { TaskBoard } from "@/app/(dashboard)/manager/order-assignment/_components/order-management/OrderManagement/TaskBoard";
import StaffTab from "@/app/(dashboard)/manager/groups/_components/group-management/StaffTab";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { useSignalRContext } from "@/context/signalr-provider";

interface Staff {
  id: string;
  status: "Ready" | "Offline";
  lastUpdated: string;
  fullName: string;
  phoneNumber: string;
}

interface EnhancedOrder extends TOrderResponse {
  userFullName?: string;
  houseNo?: string;
}

const INITIAL_LOAD_LIMIT = 20;
const LAZY_LOAD_BATCH = 10;

const GroupSelector = ({ groups, selectedGroupId, onGroupChange }: { groups: TGroupResponse[]; selectedGroupId: string; onGroupChange: (value: string) => void }) => (
  <div className="w-80">
    <Select value={selectedGroupId} onValueChange={onGroupChange}>
      <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm rounded-lg bg-white">
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-2 text-blue-600" />
          <SelectValue placeholder="Chọn nhóm làm việc" />
        </div>
      </SelectTrigger>
      <SelectContent className="rounded-lg border border-gray-200">
        {groups.map((group) => (
          <SelectItem key={group.id} value={group.id}>
            {group.name} ({group.code})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const GroupInfo = ({ selectedGroup, orders, staffData }: { selectedGroup: TGroupResponse | undefined; orders: TOrderResponse[]; staffData: Staff[] }) => (
  selectedGroup ? (
    <div className="flex-1 bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-100 flex flex-wrap gap-3 items-center">
      <Badge className="bg-blue-600 hover:bg-blue-700 text-white">
        <ClipboardList className="h-3 w-3 mr-1" />
        Nhóm: {selectedGroup.name}
      </Badge>
      <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white">
        <Package className="h-3 w-3 mr-1" />
        {orders.length} đơn hàng
      </Badge>
      <Badge className="bg-purple-600 hover:bg-purple-700 text-white">
        <Users className="h-3 w-3 mr-1" />
        {staffData.length} nhân viên
      </Badge>
      <span className="text-sm text-blue-600 ml-auto">{selectedGroup.code}</span>
    </div>
  ) : (
    <div className="flex-1 bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-center">
      <span className="text-gray-400 italic">Vui lòng chọn nhóm làm việc để xem thông tin</span>
    </div>
  )
);

const DateFilter = ({ 
  filterMode, 
  setFilterMode, 
  selectedDate, 
  fromDate, 
  toDate, 
  handleDateChange, 
  handleFromDateChange, 
  handleToDateChange, 
  applyFilter, 
  searchQuery, 
  handleFilterSearchChange, 
  handleFilterRefresh, 
  isRefreshing 
}: {
  filterMode: "single" | "range";
  setFilterMode: (value: "single" | "range") => void;
  selectedDate: string;
  fromDate: string;
  toDate: string;
  handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFromDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleToDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  applyFilter: () => void;
  searchQuery: string;
  handleFilterSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFilterRefresh: () => void;
  isRefreshing: boolean;
}) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <div className="flex items-center w-full">
      <Input
        type="text"
        value={searchQuery}
        onChange={handleFilterSearchChange}
        placeholder="Tìm kiếm theo mã đơn, tên khách hàng, địa chỉ..."
        className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm rounded-lg"
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
              className="w-40 border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm rounded-lg"
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
              className="w-36 border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm rounded-lg"
            />
            <ArrowRightCircle className="hidden sm:block h-4 w-4" />
            <Label className="whitespace-nowrap">Đến:</Label>
            <Input
              type="date"
              value={toDate}
              onChange={handleToDateChange}
              className="w-36 border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm rounded-lg"
            />
          </div>
        </TabsContent>
      </Tabs>
      <Button onClick={applyFilter} className="mt-2 sm:mt-0 bg-blue-600 hover:bg-blue-700">
        Áp dụng
      </Button>
    </div>
    <Button
      onClick={handleFilterRefresh}
      variant="outline"
      className="whitespace-nowrap border-gray-300 hover:bg-gray-100"
      disabled={isRefreshing}
    >
      <RefreshCw className={`mr-1 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
      {isRefreshing ? "Đang làm mới..." : "Làm mới"}
    </Button>
  </div>
);

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

const ManagerTab = ({ managerInfo }: { managerInfo: TManagerResponse | null }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border">
    {managerInfo ? (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Thông tin quản lý</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Họ và tên</p>
            <p className="text-gray-800">{managerInfo.fullName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Số điện thoại</p>
            <p className="text-gray-800">{managerInfo.phoneNumber}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Email</p>
            <p className="text-gray-800">{managerInfo.email || "Không có"}</p>
          </div>
        </div>
      </div>
    ) : (
      <div className="text-center text-gray-500">Không có thông tin quản lý</div>
    )}
  </div>
);

const OrderFilterComponent = ({
  error,
  isInitialLoad,
  isRefreshing,
  filteredOrders,
  displayedItems,
  isLoadingMore,
  filterMode,
  setFilterMode,
  selectedDate,
  fromDate,
  toDate,
  handleFilterRefresh,
  handleDateChange,
  handleFromDateChange,
  handleToDateChange,
  applyFilter,
  searchQuery,
  handleFilterSearchChange,
  loadMoreItems,
  selectedGroupId,
}: {
  error: string | null;
  isInitialLoad: boolean;
  isRefreshing: boolean;
  filteredOrders: EnhancedOrder[];
  displayedItems: EnhancedOrder[];
  isLoadingMore: boolean;
  filterMode: "single" | "range";
  setFilterMode: (value: "single" | "range") => void;
  selectedDate: string;
  fromDate: string;
  toDate: string;
  handleFilterRefresh: () => void;
  handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFromDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleToDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  applyFilter: () => void;
  searchQuery: string;
  handleFilterSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loadMoreItems: () => void;
  selectedGroupId: string;
}) => {
  let dateText = "Tất cả";
  if (filterMode === "single") {
    dateText = format(parseISO(selectedDate), "dd/MM/yyyy", { locale: vi });
  } else if (filterMode === "range") {
    dateText = `${format(parseISO(fromDate), "dd/MM/yyyy", { locale: vi })} - ${format(parseISO(toDate), "dd/MM/yyyy", { locale: vi })}`;
  }

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg border shadow-sm bg-white">
        <DateFilter
          filterMode={filterMode}
          setFilterMode={setFilterMode}
          selectedDate={selectedDate}
          fromDate={fromDate}
          toDate={toDate}
          handleDateChange={handleDateChange}
          handleFromDateChange={handleFromDateChange}
          handleToDateChange={handleToDateChange}
          applyFilter={applyFilter}
          searchQuery={searchQuery}
          handleFilterSearchChange={handleFilterSearchChange}
          handleFilterRefresh={handleFilterRefresh}
          isRefreshing={isRefreshing}
        />
        <div className="mt-4 text-sm text-gray-600 flex items-center justify-between">
          <div>
            <span className="font-medium">Đơn hàng:</span> {dateText}
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {filteredOrders.length}
            </span>
          </div>
          {displayedItems.length > 0 && displayedItems.length < filteredOrders.length && (
            <div className="text-sm text-gray-500">
              Hiển thị {displayedItems.length}/{filteredOrders.length}
            </div>
          )}
        </div>
      </div>

      {error ? (
        <div className="p-6 text-center">
          <div className="text-red-600 font-medium text-lg mb-2">{error}</div>
          <Button onClick={handleFilterRefresh} variant="outline" className="border-gray-300 hover:bg-gray-100">
            <RefreshCw className="mr-1 h-4 w-4" /> Thử lại
          </Button>
        </div>
      ) : isInitialLoad || isRefreshing ? (
        <LoadingIndicator />
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white p-8 rounded-lg border text-center">
          <div className="text-gray-500 mb-4">Không có đơn hàng nào trong khoảng thời gian này</div>
          <Button onClick={handleFilterRefresh} variant="outline" className="border-gray-300 hover:bg-gray-100">
            <RefreshCw className="mr-1 h-4 w-4" /> Xem tất cả đơn hàng
          </Button>
        </div>
      ) : (
        <>
          <DndProvider backend={HTML5Backend}>
            <div className="task-board-container">
              <TaskBoard orders={displayedItems} groupId={selectedGroupId} />
            </div>
          </DndProvider>
          {displayedItems.length < filteredOrders.length && (
            <div className="text-center mt-4 mb-8">
              <Button
                onClick={loadMoreItems}
                variant="outline"
                disabled={isLoadingMore}
                className="px-8 border-gray-300 hover:bg-gray-100"
              >
                {isLoadingMore ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Đang tải...
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-2 h-4 w-4" />
                    Tải thêm ({filteredOrders.length - displayedItems.length} đơn hàng còn lại)
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

export default function EnhancedGroupOrderManagementPage() {
  const [groups, setGroups] = useState<TGroupResponse[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [orders, setOrders] = useState<TOrderResponse[]>([]);
  const [staffData, setStaffData] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [ordersData, setOrdersData] = useState<EnhancedOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState<EnhancedOrder[]>([]);
  const [displayedItems, setDisplayedItems] = useState<EnhancedOrder[]>([]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD_LIMIT);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [filterMode, setFilterMode] = useState<"single" | "range">("single");
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [fromDate, setFromDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [toDate, setToDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [filterApplied, setFilterApplied] = useState(false);
  const [userDataCache, setUserDataCache] = useState<Record<string, string>>({});
  const [houseDataCache, setHouseDataCache] = useState<Record<string, string>>({});
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const [managerInfo, setManagerInfo] = useState<TManagerResponse | null>(null);
  const { notifications } = useSignalRContext();

  const fetchGroups = useCallback(async () => {
    try {
      const response = await getAllGroupsInCreateStaff();
      if (response?.payload?.items) {
        setGroups(response.payload.items);
        if (response.payload.items.length > 0 && !selectedGroupId) {
          setSelectedGroupId(response.payload.items[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
      setError("Không thể tải danh sách nhóm");
    }
  }, [selectedGroupId]);

  const fetchOrders = useCallback(async (groupId: string) => {
    if (!groupId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAllOrdersByGroupId(groupId);
      if (response?.payload?.items) {
        setOrders(response.payload.items);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Không thể tải danh sách đơn hàng");
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchStaff = useCallback(async (groupId: string) => {
    if (!groupId) return;
    try {
      const response = await getAllStaffStatus(groupId);
      setStaffData(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching staff:", error);
      setStaffData([]);
    }
  }, []);

  const fetchManager = useCallback(async (managerId: string | null) => {
    if (!managerId) {
      setManagerInfo(null);
      return;
    }
    try {
      const response = await getManagerById(managerId);
      if (response?.payload) {
        setManagerInfo(response.payload);
      } else {
        setManagerInfo(null);
      }
    } catch (error) {
      console.error("Error fetching manager:", error);
      setManagerInfo(null);
    }
  }, []);

  const handleGroupChange = (value: string) => {
    setSelectedGroupId(value);
    setIsInitialLoad(true);
    setFilterApplied(false);
    setActiveTab("orders");
    const selectedGroup = groups.find(g => g.id === value);
    fetchManager(selectedGroup?.managerId || null);
  };

  const handleRefresh = async () => {
    if (selectedGroupId) {
      setRefreshing(true);
      setIsRefreshing(true);
      await Promise.all([
        fetchOrders(selectedGroupId),
        fetchStaff(selectedGroupId),
        loadData(),
      ]);
      setTimeout(() => {
        setRefreshing(false);
        setIsRefreshing(false);
      }, 500);
    }
  };

  const extractHouseId = useCallback((address: string): string => {
    if (!address) return "";
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(address);
    const houseIdMatch = address.match(/^house_([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i);
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

      if (searchQuery) {
        const query = searchQuery.toLowerCase().trim();
        filtered = filtered.filter((order) => {
          return (
            (order.code && order.code.toLowerCase().includes(query)) ||
            (order.userFullName && order.userFullName.toLowerCase().includes(query)) ||
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

  const handleFilterSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const updateEnhancedItems = useCallback(
    (baseItems: TOrderResponse[], userCache: Record<string, string>, houseCache: Record<string, string>) => {
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
    if (!selectedGroupId) return setError("Không tìm thấy thông tin nhóm");
    setError(null);

    try {
      const response = await getAllOrdersByGroupId(selectedGroupId);
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
    selectedGroupId,
    extractHouseId,
    userDataCache,
    houseDataCache,
    updateEnhancedItems,
  ]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToDate(e.target.value);
  };

  const handleFilterRefresh = () => {
    const today = format(new Date(), "yyyy-MM-dd");
    setSelectedDate(today);
    setFromDate(today);
    setToDate(today);
    setFilterMode("single");

    setIsRefreshing(true);
    loadData()
      .then(() => {
        setFilterApplied(true);
      })
      .finally(() => {
        setTimeout(() => {
          setIsRefreshing(false);
        }, 500);
      });
  };

  const applyFilter = () => {
    setFilterApplied(true);
  };

  const loadMoreItems = () => {
    if (visibleCount < filteredOrders.length) {
      setIsLoadingMore(true);
      setTimeout(() => {
        setVisibleCount((prev) =>
          Math.min(prev + LAZY_LOAD_BATCH, filteredOrders.length)
        );
        setIsLoadingMore(false);
      }, 150);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  useEffect(() => {
    if (selectedGroupId) {
      fetchOrders(selectedGroupId);
      fetchStaff(selectedGroupId);
      loadData();
      const selectedGroup = groups.find(g => g.id === selectedGroupId);
      fetchManager(selectedGroup?.managerId || null);
    }
  }, [selectedGroupId, fetchOrders, fetchStaff, loadData, groups, fetchManager]);

  useEffect(() => {
    if (notifications.length > 0) {
      loadData();
    }
  }, [notifications.length, loadData]);

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

  const selectedGroup = groups.find(g => g.id === selectedGroupId);

  return (
    <div className="container px-4 py-4 mx-auto max-w-7xl h-screen overflow-y-auto">
      <Card className="border-none shadow-lg rounded-xl overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="flex flex-wrap items-center gap-8 mb-2">
            <GroupSelector groups={groups} selectedGroupId={selectedGroupId} onGroupChange={handleGroupChange} />
            <GroupInfo selectedGroup={selectedGroup} orders={orders} staffData={staffData} />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-2 mb-6">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {selectedGroupId ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger 
                  value="orders" 
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
                >
                  <Package className="h-4 w-4" />
                  Đơn hàng
                </TabsTrigger>
                <TabsTrigger 
                  value="staff" 
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
                >
                  <Users className="h-4 w-4" />
                  Nhân viên
                </TabsTrigger>
                <TabsTrigger 
                  value="manager" 
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
                >
                  <Users className="h-4 w-4" />
                  Quản lý
                </TabsTrigger>
              </TabsList>
              <TabsContent value="orders">
                <OrderFilterComponent
                  error={error}
                  isInitialLoad={isInitialLoad}
                  isRefreshing={isRefreshing}
                  filteredOrders={filteredOrders}
                  displayedItems={displayedItems}
                  isLoadingMore={isLoadingMore}
                  filterMode={filterMode}
                  setFilterMode={setFilterMode}
                  selectedDate={selectedDate}
                  fromDate={fromDate}
                  toDate={toDate}
                  handleFilterRefresh={handleFilterRefresh}
                  handleDateChange={handleDateChange}
                  handleFromDateChange={handleFromDateChange}
                  handleToDateChange={handleToDateChange}
                  applyFilter={applyFilter}
                  searchQuery={searchQuery}
                  handleFilterSearchChange={handleFilterSearchChange}
                  loadMoreItems={loadMoreItems}
                  selectedGroupId={selectedGroupId}
                />
              </TabsContent>
              <TabsContent value="staff">
                <StaffTab
                  staffData={staffData}
                  onReload={handleRefresh}
                  loading={isLoading}
                  message={null}
                  groupId={selectedGroupId}
                />
              </TabsContent>
              <TabsContent value="manager">
                <ManagerTab managerInfo={managerInfo} />
              </TabsContent>
            </Tabs>
          ) : (
            <div className="bg-white p-8 rounded-lg border text-center">
              <div className="text-gray-500 mb-4">Vui lòng chọn một nhóm để xem thông tin</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}