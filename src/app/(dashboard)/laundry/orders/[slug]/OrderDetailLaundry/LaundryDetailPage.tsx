/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { httpVinLaundry } from "@/lib/http";
import LoadingSkeleton from "@/app/(dashboard)/laundry/orders/Loading";
import NotFoundMessage from "@/app/(dashboard)/laundry/orders/NotFound";
import OrderHeader from "@/app/(dashboard)/laundry/orders/[slug]/OrderDetailLaundry/_components/OrderHeader";
import OrderInfo from "@/app/(dashboard)/laundry/orders/[slug]/OrderDetailLaundry/_components/OrderInfo";
import OrderTasks from "@/app/(dashboard)/laundry/orders/[slug]/OrderDetailLaundry/_components/OrderTasks";
import { getAllUsers, getUserById } from "@/apis/vinwallet/user";
import { OrderStatusEnum } from "@/app/(dashboard)/laundry/orders/[slug]/OrderDetailLaundry/_components/order-task/TaskEnums";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TOrderLaundryResponse } from "@/schema/VinLaudry/laundry-order";
import {
  AlertCircle,
  ShoppingBag,
  FileText,
  Clock,
  User,
  Calendar,
  Package,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { OrderItems } from "@/app/(dashboard)/laundry/orders/[slug]/OrderDetailLaundry/_components/OrderItems";

interface UserDetail {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  status: string;
}

const mapApiStatusToEnum = (apiStatus: string): OrderStatusEnum => {
  switch (apiStatus) {
    case "Draft":
      return OrderStatusEnum.Draft;
    case "Processing":
      return OrderStatusEnum.Processing;
    case "PendingPayment":
      return OrderStatusEnum.PendingPayment;
    case "Paid":
      return OrderStatusEnum.Paid;
    case "Completed":
      return OrderStatusEnum.Completed;
    case "Cancelled":
      return OrderStatusEnum.Cancelled;
    default:
      return OrderStatusEnum.Processing;
  }
};

export default function LaundryDetailPage() {
  const params = useParams();
  const orderId = params.slug;

  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [order, setOrder] = useState<TOrderLaundryResponse | null>(null);
  const [user, setUser] = useState<UserDetail | null>(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [userError, setUserError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const userCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user="));

    if (userCookie) {
      try {
        const userJson = decodeURIComponent(userCookie.split("=")[1]);
        setCurrentUser(JSON.parse(userJson));
      } catch (error) {
        console.error("Error parsing user cookie:", error);
      }
    }

    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setRefreshing(true);
      const orderResponse = await httpVinLaundry.get<TOrderLaundryResponse>(
        `/orders/${orderId}`
      );
      setOrder(orderResponse.payload);

      if (orderResponse?.payload?.userId) {
        setUserLoading(true);
        try {
          const userResponse = await getUserById(orderResponse.payload.userId);
          if (userResponse?.payload) {
            setUser(userResponse.payload);
            setUserError(null);
          } else {
            const usersResponse = await getAllUsers({
              id: orderResponse.payload.userId,
            });
            const foundUser = usersResponse?.payload?.items?.find(
              (u) => u.id === orderResponse.payload.userId
            );
            if (foundUser) {
              setUser(foundUser);
              setUserError(null);
            } else {
              setUserError("Không thể tìm thấy thông tin người dùng");
            }
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
          setUserError("Lỗi khi tải thông tin người dùng");
          toast({
            title: "Lỗi",
            description: "Không thể tải thông tin người dùng",
            variant: "destructive",
          });
        } finally {
          setUserLoading(false);
        }
      } else {
        setUserLoading(false);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin đơn hàng",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const handleOrderStatusChanged = (event: CustomEvent) => {
      const { orderId: changedOrderId, status } = event.detail;
      if (changedOrderId === orderId) {
        setOrder((prevOrder): TOrderLaundryResponse | null => {
          if (!prevOrder) return null;
          return { ...prevOrder, status };
        });
        if (status === "Cancelled") {
          toast({
            variant: "destructive",
            title: "Đơn hàng đã bị hủy",
            description: "Tất cả các công việc liên quan đã bị hủy.",
            duration: 5000,
          });
        } else {
          toast({
            title: "Cập nhật trạng thái",
            description: `Đơn hàng ${orderId} đã được cập nhật thành ${status}`,
            variant: "default",
          });
        }
      }
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
  }, [orderId]);

  const updateOrderStatus = (newStatus: string) => {
    setOrder((prevOrder) =>
      prevOrder ? { ...prevOrder, status: newStatus } : prevOrder
    );
  };

  const calculateTotals = () => {
    if (!order)
      return {
        itemsTotal: 0,
        additionalServicesTotal: 0,
        discount: 0,
        grandTotal: 0,
      };

    const itemsByKgTotal = order.orderDetailsByKg.reduce((total, item) => {
      return total + (item.subtotal || 0);
    }, 0);

    const itemsByItemTotal = order.orderDetailsByItem.reduce((total, item) => {
      return total + item.quantity * item.unitPrice;
    }, 0);

    const servicesTotal = order.orderAdditionalServicesResponse.reduce(
      (total, service) => {
        return total + service.price;
      },
      0
    );

    const discount = order.discountAmount || 0;
    const total = itemsByKgTotal + itemsByItemTotal + servicesTotal - discount;

    return {
      itemsTotal: itemsByKgTotal + itemsByItemTotal,
      additionalServicesTotal: servicesTotal,
      discount,
      grandTotal: total,
    };
  };

  const consolidateItems = () => {
    if (!order) return [];

    const itemMap = new Map();

    order.orderDetailsByItem.forEach((item) => {
      const itemKey = item.itemTypeResponse.id;
      if (itemMap.has(itemKey)) {
        const existingItem = itemMap.get(itemKey);
        existingItem.quantity += item.quantity;
        existingItem.subtotal += item.quantity * item.unitPrice;
      } else {
        itemMap.set(itemKey, {
          id: item.id,
          name: item.itemTypeResponse.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.quantity * item.unitPrice,
          itemType: {
            name: item.itemTypeResponse.name,
            itemCode: item.itemTypeResponse.itemCode,
          },
          pricePerItem: item.itemTypeResponse.pricePerItem,
          defaultPrice: item.itemTypeResponse.defaultPrice,
        });
      }
    });

    order.orderDetailsByKg.forEach((item) => {
      const itemKey = item.itemTypeId;
      if (itemMap.has(itemKey)) {
        const existingItem = itemMap.get(itemKey);
        existingItem.quantity += 1;
        existingItem.subtotal += item.subtotal || 0;
        existingItem.weight = (existingItem.weight || 0) + (item.weight || 0);
      } else {
        itemMap.set(itemKey, {
          id: item.id,
          name: item.itemTypeResponse?.name || "Không xác định",
          quantity: 1,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal || 0,
          itemType: {
            name: item.itemTypeResponse?.name || "Không xác định",
            itemCode: item.itemTypeResponse?.itemCode || "",
          },
          weight: item.weight,
          pricePerKg: item.unitPrice,
          defaultPrice: item.itemTypeResponse?.defaultPrice || 0,
        });
      }
    });

    return Array.from(itemMap.values());
  };

  const totals = calculateTotals();
  const consolidatedItems = consolidateItems();

  if (loading) return <LoadingSkeleton />;
  if (!order) return <NotFoundMessage />;

  return (
    <div className="container mx-auto py-4 px-1 sm:px-4 bg-gradient-to-b from-purple-50 via-white to-white min-h-screen">
      <OrderHeader
        order={order}
        onRefresh={fetchOrderDetails}
        refreshing={refreshing}
      />
      {userError && (
        <div className="mb-4 p-3 border rounded-lg border-amber-200 bg-amber-50 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <p className="text-amber-800">
            {userError} (ID người dùng: {order.userId})
          </p>
        </div>
      )}
      {order.status === "Cancelled" && (
        <div className="mb-4 p-3 border rounded-lg border-red-200 bg-red-50 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-800">
            Đơn hàng đã bị hủy. Tất cả các công việc liên quan đã bị khóa.
          </p>
        </div>
      )}
      <div className="mb-6 overflow-hidden rounded-lg shadow-md">
        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
          orientation="vertical"
          className="flex h-full"
        >
          <div className="flex flex-col w-56 h-full bg-gray-50 border-r border-gray-200 rounded-l-lg flex-shrink-0">
            <div className="bg-white px-5 py-3 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Chi tiết</h2>
            </div>
            <div className="px-5 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center mb-3 text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Tạo lúc: {formatDate(order.createdAt)}</span>
              </div>
              <div className="flex items-center mb-3 text-sm text-gray-600">
                <User className="h-4 w-4 mr-2" />
                <span>Khách hàng: {user?.fullName || "Không xác định"}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Package className="h-4 w-4 mr-2" />
                <span>Số lượng: {consolidatedItems.length} sản phẩm</span>
              </div>
            </div>
            <TabsList className="flex flex-col w-full h-auto p-0 bg-transparent">
              <div className="px-3 py-3 border-b border-gray-200">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-1 ml-2">
                  Thông tin đơn hàng
                </p>
                <TabsTrigger
                  value="overview"
                  className="justify-start w-full py-2.5 px-3 mb-1 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:font-medium rounded text-gray-700 text-sm transition-all hover:bg-gray-100"
                >
                  <ShoppingBag className="h-4 w-4 mr-2.5" />
                  Tổng quan
                </TabsTrigger>
                <TabsTrigger
                  value="details"
                  className="justify-start w-full py-2.5 px-3 mb-1 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:font-medium rounded text-gray-700 text-sm transition-all hover:bg-gray-100"
                >
                  <FileText className="h-4 w-4 mr-2.5" />
                  Chi tiết đơn hàng
                </TabsTrigger>
                <TabsTrigger
                  value="tasks"
                  className="justify-start w-full py-2.5 px-3 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:font-medium rounded text-gray-700 text-sm transition-all hover:bg-gray-100"
                >
                  <Clock className="h-4 w-4 mr-2.5" />
                  Tiến trình xử lý
                </TabsTrigger>
              </div>
            </TabsList>
          </div>
          <div className="p-6 bg-white flex-grow rounded-r-lg border-t border-r border-b border-gray-200">
            <TabsContent
              value="overview"
              className="mt-0 animate-in fade-in-50 duration-300"
            >
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <OrderInfo
                    order={order}
                    user={user}
                    isLoading={userLoading}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent
              value="details"
              className="mt-0 animate-in fade-in-50 duration-300"
            >
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <OrderItems
                    items={consolidatedItems}
                    additionalServices={order.orderAdditionalServicesResponse}
                    orderCode={order.orderCode}
                    status={order.status}
                    orderDetailsByItem={order.orderDetailsByItem}
                    orderDetailsByKg={order.orderDetailsByKg}
                    orderAdditionalServicesResponse={
                      order.orderAdditionalServicesResponse
                    }
                    totalAmount={totals.grandTotal}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent
              value="tasks"
              className="mt-0 animate-in fade-in-50 duration-300"
            >
              <OrderTasks
                orderId={order.id}
                currentUser={currentUser}
                orderStatusOverride={mapApiStatusToEnum(order.status)}
                updateOrderStatus={updateOrderStatus}
                onRefresh={fetchOrderDetails}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
