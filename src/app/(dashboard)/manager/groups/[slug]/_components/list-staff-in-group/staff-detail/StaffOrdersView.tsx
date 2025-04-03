/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  ChevronDownIcon,
  ChevronUpIcon,
  ClipboardListIcon,
  MapPinIcon,
  PackageIcon,
  UserIcon,
} from "lucide-react";
import { format, isEqual, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TOrderResponse } from "@/schema/order.schema";
import { getOrderByStaffId } from "@/apis/staff";

// Định nghĩa kiểu API Response
interface ApiResponse {
  payload: {
    items: TOrderResponse[];
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
  status: number;
}

interface StaffOrdersPopupProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  staffId: string;
  staffName?: string;
}

interface OrdersByDate {
  date: string;
  orders: TOrderResponse[];
  isOpen: boolean;
}

interface StatsData {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  cancelled: number;
  accepted: number;
}

// Component thống kê
const StatsCards = ({ stats }: { stats: StatsData }) => {
  return (
    <div className="grid grid-cols-5 gap-4">
      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center">
          <CardTitle className="text-2xl font-bold">{stats.total}</CardTitle>
          <CardDescription>Tổng số đơn</CardDescription>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center">
          <CardTitle className="text-2xl font-bold text-green-600">{stats.completed}</CardTitle>
          <CardDescription>Hoàn thành</CardDescription>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center">
          <CardTitle className="text-2xl font-bold text-blue-600">{stats.inProgress}</CardTitle>
          <CardDescription>Đang xử lý</CardDescription>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center">
          <CardTitle className="text-2xl font-bold text-yellow-600">{stats.pending}</CardTitle>
          <CardDescription>Chờ xử lý</CardDescription>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center">
          <CardTitle className="text-2xl font-bold text-red-600">{stats.cancelled}</CardTitle>
          <CardDescription>Đã hủy</CardDescription>
        </CardContent>
      </Card>
    </div>
  );
};

// Component hiển thị skeleton khi loading
const OrderSkeletons = () => {
  return (
    Array(3)
      .fill(0)
      .map((_, index) => (
        <div key={index} className="mb-4 p-4 border rounded-lg">
          <div className="flex justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="mt-2">
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-3/4 mt-2" />
          </div>
          <div className="flex justify-between mt-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      ))
  );
};

// Component hiển thị khi không có đơn hàng
const NoOrders = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
      <PackageIcon className="h-12 w-12 mb-4 opacity-50" />
      <p className="text-lg font-medium">Không tìm thấy đơn hàng nào</p>
    </div>
  );
};

// Lấy màu biểu thị trạng thái đơn hàng
const getStatusColor = (status: string | null) => {
  if (!status) return "bg-gray-500";
  switch (status.toLowerCase()) {
    case "completed":
    case "hoàn thành":
      return "bg-green-500";
    case "in_progress":
    case "đang xử lý":
      return "bg-blue-500";
    case "pending":
    case "chờ xử lý":
      return "bg-yellow-500";
    case "cancelled":
    case "đã hủy":
      return "bg-red-500";
    case "accepted":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
};

// Component hiển thị chi tiết một đơn hàng
const OrderDetail = ({ order }: { order: TOrderResponse }) => {
  return (
    <Card className="rounded-none border-0 border-b last:border-b-0">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center">
              <span className="font-medium">#{order.code}</span>
              {order.emergencyRequest && (
                <Badge className="ml-2 bg-red-500">Khẩn cấp</Badge>
              )}
            </CardTitle>
            <CardDescription className="flex items-center mt-1">
              <UserIcon className="h-3 w-3 mr-1" />
              <span>Khách hàng: {order.userId?.slice(0, 8)}...</span>
            </CardDescription>
          </div>
          <Badge className={getStatusColor(order.status)}>
            {order.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-sm text-gray-600 space-y-1">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span>
              Thời gian:{" "}
              <span className="text-blue-400 font-semibold">
                {format(new Date(order.createdAt), "HH:mm", {
                  locale: vi,
                })}
              </span>
            </span>
          </div>
          <div className="flex items-center">
            <MapPinIcon className="h-3 w-3 mr-1" />
            <span>Địa chỉ: {order.address?.slice(0, 50)}...</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="text-sm">
          <span className="font-medium">Dịch vụ:</span>{" "}
          {order.serviceType || "Dịch vụ vệ sinh"}
        </div>
        <div className="text-sm font-semibold text-green-600">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(order.totalAmount)}
        </div>
      </CardFooter>
    </Card>
  );
};

// Component nhóm đơn hàng theo ngày
const OrderDateGroup = ({ 
  dateGroup, 
  toggleDateGroup 
}: { 
  dateGroup: OrdersByDate, 
  toggleDateGroup: (date: string) => void 
}) => {
  // Format ngày thành chuỗi ví dụ: "03/04/2025 (Hôm nay) - 5 đơn"
  const formatDateHeader = (dateStr: string, ordersCount: number) => {
    const date = parseISO(dateStr);
    const today = new Date();
    
    // Kiểm tra xem ngày này có phải là ngày hôm nay
    const isToday = isEqual(
      new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      new Date(today.getFullYear(), today.getMonth(), today.getDate())
    );

    const formattedDate = format(date, "dd/MM/yyyy", { locale: vi });
    return (
      <span>
        <span className="text-indigo-400 font-semibold">{formattedDate}</span>
        {isToday && <span className="text-purple-400"> (Hôm nay)</span>} -{" "}
        <span className="text-teal-400">{ordersCount} đơn</span>
      </span>
    );
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div 
        className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
        onClick={() => toggleDateGroup(dateGroup.date)}
      >
        <h3 className="font-medium flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-blue-400" />
          {formatDateHeader(dateGroup.date, dateGroup.orders.length)}
        </h3>
        {dateGroup.isOpen ? (
          <ChevronUpIcon className="h-5 w-5" />
        ) : (
          <ChevronDownIcon className="h-5 w-5" />
        )}
      </div>
      
      {dateGroup.isOpen && (
        <div className="divide-y">
          {dateGroup.orders.map((order) => (
            <OrderDetail key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

// Component chính
const StaffOrdersPopup: React.FC<StaffOrdersPopupProps> = ({
  isOpen,
  onOpenChange,
  staffId,
  staffName = "Nhân viên",
}) => {
  const [orders, setOrders] = useState<TOrderResponse[]>([]);
  const [ordersByDate, setOrdersByDate] = useState<OrdersByDate[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<StatsData>({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    cancelled: 0,
    accepted: 0,
  });

  useEffect(() => {
    if (isOpen && staffId) {
      fetchOrders();
    }
  }, [isOpen, staffId]);

  useEffect(() => {
    // Nhóm các đơn hàng theo ngày
    const groupedOrders = orders.reduce<Record<string, TOrderResponse[]>>((acc, order) => {
      const dateStr = format(new Date(order.createdAt), "yyyy-MM-dd");
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      acc[dateStr].push(order);
      return acc;
    }, {});

    // Chuyển đổi thành mảng và sắp xếp theo ngày gần nhất
    const sortedDates = Object.keys(groupedOrders).sort((a, b) => 
      parseISO(b).getTime() - parseISO(a).getTime()
    );

    const ordersByDateArray = sortedDates.map(date => ({
      date,
      orders: groupedOrders[date],
      isOpen: true // Mặc định mở rộng tất cả các nhóm
    }));

    setOrdersByDate(ordersByDateArray);

    // Tính toán thống kê
    calculateStats(orders);
  }, [orders]);

  const calculateStats = (orders: TOrderResponse[]) => {
    const completed = orders.filter(
      (order) =>
        order.status?.toLowerCase() === "completed" ||
        order.status?.toLowerCase() === "hoàn thành"
    ).length;
    const inProgress = orders.filter(
      (order) =>
        order.status?.toLowerCase() === "in_progress" ||
        order.status?.toLowerCase() === "đang xử lý"
    ).length;
    const pending = orders.filter(
      (order) =>
        order.status?.toLowerCase() === "pending" ||
        order.status?.toLowerCase() === "chờ xử lý"
    ).length;
    const cancelled = orders.filter(
      (order) =>
        order.status?.toLowerCase() === "cancelled" ||
        order.status?.toLowerCase() === "đã hủy"
    ).length;
    const accepted = orders.filter(
      (order) => order.status?.toLowerCase() === "accepted"
    ).length;

    setStats({
      total: orders.length,
      completed,
      inProgress,
      pending,
      cancelled,
      accepted,
    });
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = (await getOrderByStaffId(staffId)) as unknown as ApiResponse;
      console.log("API Response:", response);

      let fetchedOrders: TOrderResponse[] = [];

      if (
        response &&
        response.payload &&
        Array.isArray(response.payload.items)
      ) {
        fetchedOrders = response.payload.items;
        console.log("Fetched Orders from payload.items:", fetchedOrders);
      } else {
        console.warn("API returned unexpected format or empty data:", response);
        fetchedOrders = [];
      }

      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleDateGroup = (dateStr: string) => {
    setOrdersByDate(prev => 
      prev.map(group => 
        group.date === dateStr 
          ? { ...group, isOpen: !group.isOpen } 
          : group
      )
    );
  };

  const renderContent = () => {
    if (loading) {
      return <OrderSkeletons />;
    }
    
    if (orders.length === 0) {
      return <NoOrders />;
    }
    
    return (
      <div className="space-y-4">
        {ordersByDate.map((group) => (
          <OrderDateGroup 
            key={group.date} 
            dateGroup={group} 
            toggleDateGroup={toggleDateGroup} 
          />
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-6 overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <ClipboardListIcon className="h-5 w-5" />
            Đơn hàng của {staffName}
          </DialogTitle>
        </DialogHeader>

        <div className="shrink-0 mt-4">
          <StatsCards stats={stats} />
        </div>
        
        <Separator className="my-4 shrink-0" />
        
        <ScrollArea className="flex-1 min-h-0 overflow-y-auto pr-4">
          {renderContent()}
        </ScrollArea>

        <DialogFooter className="mt-4 shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StaffOrdersPopup;