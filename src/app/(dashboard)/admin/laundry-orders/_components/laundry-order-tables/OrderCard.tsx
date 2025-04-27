import React from "react";
import { Badge } from "@/components/ui/badge";
import { CalendarRange, Package2, User } from "lucide-react";
import { LaundryOrderCellAction } from "@/app/(dashboard)/admin/laundry-orders/_components/laundry-order-tables/cell-action";
import { TOrderLaundryResponse } from "@/schema/VinLaudry/laundry-order";
import { formattedDateTime } from "@/lib/formatter";

const statusConfig = {
  Draft: {
    color: "bg-amber-50 text-amber-700 border-amber-200",
    iconColor: "text-amber-600",
    icon: <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5"></span>,
    label: "Đơn mới",
    bgColor: "bg-amber-50",
  },
  Paid: {
    color: "bg-blue-50 text-blue-700 border-blue-200",
    iconColor: "text-blue-600",
    icon: <span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></span>,
    label: "Đã thanh toán",
    bgColor: "bg-blue-50",
  },
  Completed: {
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    iconColor: "text-emerald-600",
    icon: <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>,
    label: "Hoàn thành",
    bgColor: "bg-emerald-50",
  },
  Processing: {
    color: "bg-purple-50 text-purple-700 border-purple-200",
    iconColor: "text-purple-600",
    icon: <span className="w-2 h-2 rounded-full bg-purple-500 mr-1.5"></span>,
    label: "Đang xử lý",
    bgColor: "bg-purple-50",
  },
  PendingPayment: {
    color: "bg-orange-50 text-orange-700 border-orange-200",
    iconColor: "text-orange-600",
    icon: <span className="w-2 h-2 rounded-full bg-orange-500 mr-1.5"></span>,
    label: "Chờ thanh toán",
    bgColor: "bg-orange-50",
  },
  Cancelled: {
    color: "bg-rose-50 text-rose-700 border-rose-200",
    iconColor: "text-rose-600",
    icon: <span className="w-2 h-2 rounded-full bg-rose-500 mr-1.5"></span>,
    label: "Đã hủy",
    bgColor: "bg-rose-50",
  },
};

export const OrderCard = ({ order }: { order: TOrderLaundryResponse }) => {
  const status = order.status as keyof typeof statusConfig;
  const statusData = statusConfig[status] || {
    color: "bg-gray-50 text-gray-700 border-gray-200",
    iconColor: "text-gray-500",
    icon: <span className="w-2 h-2 rounded-full bg-gray-500 mr-1.5"></span>,
    label: order.status,
    bgColor: "bg-gray-50",
  };

  const formattedAmount = order.totalAmount
    ? new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(order.totalAmount)
    : "Chưa thanh toán";

  return (
    <div
      className={`relative rounded-lg p-4 border border-gray-100 hover:shadow-md transition-all duration-200 flex flex-col h-full ${statusData.bgColor}`}
    >
      {/* Nút Xem chi tiết luôn ở góc phải trên */}
      <div className="absolute top-2 right-2">
        <LaundryOrderCellAction data={order} />
      </div>

      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-900 hover:text-blue-600 cursor-pointer transition-colors">
              #{order.orderCode}
            </span>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <CalendarRange size={14} className="mr-1" />
            {formattedDateTime(order.createdAt)}
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-center mb-2">
          <Package2 size={14} className="text-gray-400 mr-2 flex-shrink-0" />
          <span className="text-sm text-gray-700 truncate">{order.name}</span>
        </div>
        <div className="flex items-center">
          <User size={14} className="text-gray-400 mr-2 flex-shrink-0" />
          <span className="text-xs text-gray-700 truncate">{order.userId}</span>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
        <Badge
          variant="outline"
          className={`px-2 py-0.5 text-xs font-medium flex items-center ${statusData.color}`}
        >
          {statusData.icon}
          {statusData.label}
        </Badge>
        <span className="text-sm font-semibold text-emerald-600">
          {formattedAmount}
        </span>
      </div>
    </div>
  );
};
