"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Clock, User, Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TOrderLaundryResponse } from "@/schema/VinLaudry/laundry-order";

interface OrderInfoProps {
  order: TOrderLaundryResponse;
  user: {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    status?: string;
    role?: string;
  } | null;
}

export default function OrderInfo({ order, user }: OrderInfoProps) {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <CardTitle className="text-lg text-blue-800 flex items-center">
          <ShoppingBag className="h-5 w-5 mr-2 text-blue-600" />
          Thông tin đơn hàng
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Thông tin đơn hàng */}
          <div className="space-y-4">
            <div className="flex items-start">
              <ShoppingBag className="h-5 w-5 text-blue-500 mr-3 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-500">Loại dịch vụ</p>
                <p className="text-base font-semibold text-gray-800">{order.type || "Chưa xác định"}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-blue-500 mr-3 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-500">Ngày đặt</p>
                <p className="text-base text-gray-800">{formatDate(order.orderDate)}</p>
              </div>
            </div>
          </div>
          {/* Thông tin khách hàng */}
          <div className="space-y-4">
            <div className="flex items-start">
              <User className="h-5 w-5 text-blue-500 mr-3 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-500">Tên khách hàng</p>
                <p className="text-base font-semibold text-gray-800">{user?.fullName || order.name}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Mail className="h-5 w-5 text-blue-500 mr-3 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-base text-gray-800">{user?.email || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Phone className="h-5 w-5 text-blue-500 mr-3 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
                <p className="text-base text-gray-800">{user?.phoneNumber || "N/A"}</p>
              </div>
            </div>
            {user?.status && (
              <div className="flex items-start">
                <div className="h-5 w-5 mr-3 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Trạng thái</p>
                  <Badge className="bg-green-100 text-green-800">{user.status}</Badge>
                </div>
              </div>
            )}
            {user?.role && (
              <div className="flex items-start">
                <div className="h-5 w-5 mr-3 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Vai trò</p>
                  <Badge className="bg-blue-100 text-blue-800">{user.role}</Badge>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}