/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useRef, useState } from "react";
import { useDrag } from "react-dnd";
import { TOrderResponse } from "@/schema/order.schema";
import OrderDetailsPopup from "@/app/(dashboard)/manager/order-assignment/_components/order-management/OrderDetailsPopup/OrderDetailsPopup";
import { User, MapPin, Clock, DollarSign, Tag, Coins } from "lucide-react";
import { formatDateTime } from "@/app/(dashboard)/manager/order-assignment/_components/order-management/OrderDetailsPopup/utils";

const getStatusColor = (status: string): string => {
  switch (status) {
    case "Draft": return "bg-gray-100 border-gray-300";
    case "Pending": return "bg-yellow-50 border-yellow-300";
    case "Accepted": return "bg-blue-50 border-blue-300";
    case "Completed": return "bg-green-50 border-green-300";
    case "Cancelled": return "bg-red-50 border-red-300";
    default: return "bg-gray-100 border-gray-300";
  }
};

const getPriorityColor = (priority: string): string => {
  switch (priority?.toLowerCase()) {
    case "high": return "text-white bg-red-500";
    case "medium": return "text-white bg-orange-500";
    case "low": return "text-white bg-green-500";
    default: return "text-white bg-gray-500";
  }
};

interface TaskCardProps {
  order: TOrderResponse & { userFullName?: string; houseNo?: string };
  onRefresh?: () => void;
  groupId?: string;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  order,
  onRefresh,
  groupId,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: "ORDER",
    item: order,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const handleClick = () => {
    if (!isDragging) setIsPopupOpen(true);
  };

  const handleClose = () => {
    setIsPopupOpen(false);
  };

  drag(ref);

  const statusClass = getStatusColor(order.status);
  const priorityClass = getPriorityColor(order.priorityLevel || "medium");

  return (
    <div
      ref={ref}
      onClick={handleClick}
      className={`p-4 border rounded-lg ${statusClass} hover:shadow-lg transition-shadow cursor-pointer flex flex-col min-h-[180px] w-full`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className={`text-xs font-semibold px-2 py-1 rounded-full ${priorityClass}`}>
          {order.priorityLevel || "Trung bình"}
        </div>
      </div>

      {/* Main Info */}
      <div className="flex-1 space-y-2 text-sm text-gray-800">
        {/* Khách hàng */}
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <span className="text-gray-500 min-w-[90px]">Khách hàng:</span>
          <span className="font-medium">{order.userFullName || "Không xác định"}</span>
        </div>

        {/* Địa chỉ */}
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="text-gray-500 min-w-[90px]">Địa chỉ:</span>
          <span className="font-medium truncate">
            {order.houseNo || order.address || "Không có địa chỉ"}
          </span>
        </div>

        {/* Thời gian */}
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="text-gray-500 min-w-[90px]">Thời gian:</span>
          <span className="font-medium">{formatDateTime(order.createdAt)}</span>
        </div>

        {/* Dịch vụ */}
        {order.serviceType && (
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-500" />
            <span className="text-gray-500 min-w-[90px]">Dịch vụ:</span>
            <span className="font-medium">{order.serviceType}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2 border-t border-gray-200 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-600 bg-gray-200 px-2 py-1 rounded">
          {order.status}
        </span>
        {order.totalAmount && (
          <div className="flex items-center text-green-600 text-sm font-semibold">
            <Coins className="h-4 w-4 mr-1" />
            {order.totalAmount.toLocaleString("vi-VN")} Point
          </div>
        )}
      </div>

      {/* Popup */}
      {isPopupOpen && (
        <OrderDetailsPopup
          order={order}
          onClose={handleClose}
          onRefresh={onRefresh}
          isOpen={isPopupOpen}
          groupId={groupId}
        />
      )}
    </div>
  );
};

export default TaskCard;