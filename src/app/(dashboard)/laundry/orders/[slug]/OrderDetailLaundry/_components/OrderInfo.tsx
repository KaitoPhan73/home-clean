"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingBag,
  Clock,
  User,
  Mail,
  Phone,
  Calendar,
  Tag,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TOrderLaundryResponse } from "@/schema/VinLaudry/laundry-order";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";

interface OrderInfoProps {
  order: TOrderLaundryResponse;
  user: {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    status?: string;
    role?: string;
  } | null;
  isLoading?: boolean;
}

export default function OrderInfo({
  order,
  user,
  isLoading = false,
}: OrderInfoProps) {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "staff":
        return "bg-indigo-100 text-indigo-800";
      case "customer":
        return "bg-cyan-100 text-cyan-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-white border-b border-gray-100">
          <CardTitle className="text-lg text-blue-800 flex items-center">
            <ShoppingBag className="h-5 w-5 mr-2 text-blue-600" />
            Thông tin đơn hàng
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="flex items-start">
                <div className="w-5 h-5 mr-3 mt-1">
                  <Skeleton className="w-5 h-5 rounded" />
                </div>
                <div className="flex-1">
                  <Skeleton className="w-24 h-4 mb-2" />
                  <Skeleton className="w-40 h-6" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-100 to-red-50 border-b border-gray-100 py-4">
        <CardTitle className="text-lg text-blue-800 flex items-center">
          <ShoppingBag className="h-5 w-5 mr-2 text-blue-600" />
          Thông tin đơn hàng
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-8">
            {/* <div className="flex items-start group">
              <ShoppingBag className="h-5 w-5 text-blue-500 mr-3 mt-1 group-hover:text-blue-700 transition-colors" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Loại dịch vụ
                </p>
                <p className="text-base font-semibold text-gray-800">
                  {order.type || "Chưa xác định"}
                </p>
              </div>
            </div> */}

            <div className="flex items-start group mt-2">
              <Tag className="h-5 w-5 text-blue-500 mr-3 mt-1 group-hover:text-blue-700 transition-colors" />
              <div>
                <p className="text-sm font-medium text-gray-500">Mã đơn hàng</p>
                <p className="text-base font-semibold text-gray-800 font-mono">
                  {order.orderCode}
                </p>
              </div>
            </div>

            <div className="flex items-start group">
              <Clock className="h-5 w-5 text-blue-500 mr-3 mt-1 group-hover:text-blue-700 transition-colors" />
              <div>
                <p className="text-sm font-medium text-gray-500">Ngày đặt</p>
                <p className="text-base text-gray-800">
                  {formatDate(order.orderDate)}
                </p>
              </div>
            </div>

            <div className="flex items-start group">
              <Calendar className="h-5 w-5 text-blue-500 mr-3 mt-1 group-hover:text-blue-700 transition-colors" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Ngày giao dự kiến
                </p>
                <p className="text-base text-gray-800">
                  {order.deliveryDate
                    ? formatDate(order.deliveryDate)
                    : "Chưa xác định"}
                </p>
              </div>
            </div>

            <div className="flex items-start group">
              <AlertCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 group-hover:text-blue-700 transition-colors" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Trạng thái đơn hàng
                </p>
                <Badge
                  className={
                    order.status === "Draft"
                      ? "bg-gray-100 text-gray-800"
                      : order.status === "PendingPayment"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "Processing"
                      ? "bg-blue-100 text-blue-800"
                      : order.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : order.status === "Cancelled"
                      ? "bg-red-100 text-red-800"
                      : order.status === "Paid"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-blue-100 text-blue-800"
                  }
                >
                  {order.status === "Draft"
                    ? "Đơn mới"
                    : order.status === "PendingPayment"
                    ? "Chờ thanh toán"
                    : order.status === "Processing"
                    ? "Đang xử lý"
                    : order.status === "Completed"
                    ? "Hoàn thành"
                    : order.status === "Cancelled"
                    ? "Đã hủy"
                    : order.status === "Paid"
                    ? "Đã thanh toán"
                    : order.status}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-4 p-4 rounded-lg bg-blue-50 border border-blue-100">
            <div className="flex items-center mb-2">
              <User className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-blue-800 font-medium">
                Thông tin khách hàng
              </h3>
            </div>

            <div className="flex items-start group">
              <User className="h-5 w-5 text-blue-500 mr-3 mt-1 group-hover:text-blue-700 transition-colors" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Tên khách hàng
                </p>
                <p className="text-base font-semibold text-gray-800">
                  {user?.fullName || order.name || "Không có thông tin"}
                </p>
                {order.userId && !user?.fullName && (
                  <p className="text-xs text-red-500 mt-1">
                    Không thể hiển thị thông tin người dùng (ID:{" "}
                    {order.userId.slice(0, 8)}...)
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start group">
              <Mail className="h-5 w-5 text-blue-500 mr-3 mt-1 group-hover:text-blue-700 transition-colors" />
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-base text-gray-800">
                  {user?.email || "Không có thông tin"}
                </p>
              </div>
            </div>

            <div className="flex items-start group">
              <Phone className="h-5 w-5 text-blue-500 mr-3 mt-1 group-hover:text-blue-700 transition-colors" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Số điện thoại
                </p>
                <p className="text-base text-gray-800">
                  {user?.phoneNumber || "Không có thông tin"}
                </p>
              </div>
            </div>

            {user?.status && (
              <div className="flex items-start group">
                <div className="h-5 w-5 mr-3 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Trạng thái
                  </p>
                  <Badge className={getStatusColor(user.status)}>
                    {user.status}
                  </Badge>
                </div>
                {user?.role && (
                  <div className="flex items-start group">
                    <div className="h-5 w-5 mr-3 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Vai trò
                      </p>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
