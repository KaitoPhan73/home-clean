/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useRef, useState } from "react";
import { useDrag } from "react-dnd";
import { TOrderResponse } from "@/schema/order.schema";
import OrderDetailsPopup from "@/app/(dashboard)/manager/order-assignment/_components/order-management/OrderDetailsPopup/OrderDetailsPopup";
import { User, MapPin, Clock, DollarSign, Tag, Coins, Hash, RefreshCw, Star } from "lucide-react";
import { formatDateTime } from "@/app/(dashboard)/manager/order-assignment/_components/order-management/OrderDetailsPopup/utils";
import { useSignalRContext } from "@/context/signalr-provider";
import { toast } from "sonner";

const getStatusColor = (status: string): string => {
  switch (status) {
    case "Draft":
      return "bg-gray-100 border-gray-300";
    case "Pending":
      return "bg-yellow-50 border-yellow-300";
    case "Accepted":
      return "bg-blue-50 border-blue-300";
    case "InProgress":
      return "bg-purple-50 border-purple-300";
    case "Completed":
      return "bg-green-50 border-green-300";
    case "Cancelled":
      return "bg-red-50 border-red-300";
    default:
      return "bg-gray-100 border-gray-300";
  }
};

const getPriorityColor = (priority: string): string => {
  switch (priority?.toLowerCase()) {
    case "high":
      return "text-white bg-red-500";
    case "medium":
      return "text-white bg-orange-500";
    case "low":
      return "text-white bg-green-500";
    default:
      return "text-white bg-gray-500";
  }
};

const formatOrderCode = (code: string): string => {
  if (code.startsWith("RE")) {
    return code;
  }
  
  if (code.length > 12) {
    const shortCode = code.slice(-12);
    return shortCode;
  }
  
  return code;
};

const isReorderCode = (code: string): boolean => {
  return code.startsWith("RE");
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
  const [isUpdated, setIsUpdated] = useState(false);
  const { connection } = useSignalRContext();
  const isReorder = order.code ? isReorderCode(order.code) : false;

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
  
  // Generate the formatted code
  const displayCode = order.code ? formatOrderCode(order.code) : "N/A";

  useEffect(() => {
    if (isUpdated) {
      const timer = setTimeout(() => {
        setIsUpdated(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isUpdated]);

  useEffect(() => {
    const handleOrderStatusChanged = (event: CustomEvent) => {
      const { orderId, status } = event.detail;
      if (orderId === order.id && status !== order.status) {
        toast.success(`Đơn hàng ${order.id} đã được cập nhật sang trạng thái ${status}`);
        setIsUpdated(true);
        if (onRefresh) onRefresh();
      }
    };
  
    window.addEventListener('orderStatusChanged', handleOrderStatusChanged as EventListener);
    
    return () => {
      window.removeEventListener('orderStatusChanged', handleOrderStatusChanged as EventListener);
    };
  }, [order.id, order.status, onRefresh]);

  return (
    <div
      ref={ref}
      onClick={handleClick}
      className={`p-4 border rounded-lg ${statusClass} hover:shadow-lg transition-shadow cursor-pointer flex flex-col min-h-[200px] w-full ${isUpdated ? 'ring-2 ring-blue-400 animate-pulse' : ''} ${
        isReorder ? 'reorder-card relative overflow-hidden' : ''
      }`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {/* Add the glowing animation elements for reorder items */}
      {isReorder && (
        <>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent reorder-glow-top"></div>
          <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-blue-300 to-transparent reorder-glow-right"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent reorder-glow-bottom"></div>
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-blue-300 to-transparent reorder-glow-left"></div>
        </>
      )}
      
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          {isReorder ? (
            <RefreshCw className="h-4 w-4 text-blue-500" />
          ) : (
            <Hash className="h-4 w-4 text-gray-500" />
          )}
          <span className={`font-bold ${isReorder ? 'text-blue-600' : 'text-gray-700'}`}>
            {displayCode}
          </span>
        </div>
        <div
          className={`text-xs font-semibold px-2 py-1 rounded-full ${priorityClass}`}
        >
          {order.priorityLevel || "Trung bình"}
        </div>
      </div>

      <div className="h-px bg-gray-200 w-full my-2"></div>

      <div className="flex-1 space-y-2.5 text-sm text-gray-800">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
          <span className="text-gray-500 min-w-[80px] flex-shrink-0">Khách hàng:</span>
          <span className="font-medium truncate">
            {order.userFullName || "Không xác định"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
          <span className="text-gray-500 min-w-[80px] flex-shrink-0">Địa chỉ:</span>
          <span className="font-medium truncate">
            {order.houseNo || order.address || "Không có địa chỉ"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
          <span className="text-gray-500 min-w-[80px] flex-shrink-0">Thời gian:</span>
          <span className="font-medium truncate">{formatDateTime(order.createdAt)}</span>
        </div>

        {order.serviceType && (
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <span className="text-gray-500 min-w-[80px] flex-shrink-0">Dịch vụ:</span>
            <span className="font-medium truncate">{order.serviceType}</span>
          </div>
        )}
      </div>

      <div className="h-px bg-gray-200 w-full mt-3 mb-2"></div>

      <div className="mt-1 pt-1 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-600 bg-gray-200 px-2 py-1 rounded">
          {order.status}
        </span>
        {order.totalAmount && (
          <div className="flex items-center text-green-600 text-sm font-semibold">
            {order.totalAmount.toLocaleString("vi-VN")} <Star className="h-4 w-4 mr-1 ml-1" />
          </div>
        )}
      </div>

      {isPopupOpen && (
        <OrderDetailsPopup
          order={order}
          onClose={handleClose}
          onRefresh={onRefresh}
          isOpen={isPopupOpen}
          groupId={groupId}
        />
      )}

      <style jsx>{`
        @keyframes glowTop {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes glowRight {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes glowBottom {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes glowLeft {
          0% { transform: translateY(100%); }
          100% { transform: translateY(-100%); }
        }
        
        .reorder-glow-top {
          animation: glowTop 3s infinite;
        }
        .reorder-glow-right {
          animation: glowRight 3s infinite;
          animation-delay: 0.75s;
        }
        .reorder-glow-bottom {
          animation: glowBottom 3s infinite;
          animation-delay: 1.5s;
        }
        .reorder-glow-left {
          animation: glowLeft 3s infinite;
          animation-delay: 2.25s;
        }
      `}</style>
    </div>
  );
};

export default TaskCard;