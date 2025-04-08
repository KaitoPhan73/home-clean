/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/role-supports-aria-props */
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Clipboard, Clock, CheckCircle, XCircle, Loader, ChevronDown, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TaskCard } from "./TaskCard";
import { TOrderResponse } from "@/schema/order.schema";

// Định nghĩa các trạng thái có sẵn
export type BoardStatus = "Draft" | "Pending" | "Accepted" | "Completed" | "Cancelled";

// Pre-load users and houses caching để tăng tốc
const userCache = new Map();
const houseCache = new Map();

export const useTaskBoard = (orders: TOrderResponse[]) => {
  const [boardData, setBoardData] = useState<Record<BoardStatus, TOrderResponse[]>>({
    Draft: [],
    Pending: [],
    Accepted: [],
    Completed: [],
    Cancelled: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Sử dụng useMemo để tính toán board data khi orders thay đổi
  useEffect(() => {
    if (orders.length === 0) {
      setBoardData({
        Draft: [],
        Pending: [],
        Accepted: [],
        Completed: [],
        Cancelled: [],
      });
      return;
    }
    
    setIsLoading(true);
    
    // Xử lý phân loại đơn hàng theo trạng thái
    const newBoardData: Record<BoardStatus, TOrderResponse[]> = {
      Draft: [],
      Pending: [],
      Accepted: [],
      Completed: [],
      Cancelled: [],
    };
    
    orders.forEach((order) => {
      const status = order.status as BoardStatus;
      if (newBoardData[status]) {
        newBoardData[status].push(order);
      } else {
        // Fallback nếu trạng thái không khớp
        newBoardData.Draft.push(order);
      }
    });
    
    // Cập nhật state
    setBoardData(newBoardData);
    setIsLoading(false);
  }, [orders]);
  
  const moveOrder = useCallback((orderId: string, fromStatus: BoardStatus, toStatus: BoardStatus) => {
    console.log(`Moving order ${orderId} from ${fromStatus} to ${toStatus}`);
    // Trong ứng dụng thực tế, bạn sẽ gọi API để cập nhật trạng thái
  }, []);
  
  return { boardData, moveOrder, isLoading };
};

// Cấu hình hiển thị cho mỗi trạng thái
const statusConfig: Record<
  BoardStatus,
  { label: string; icon: React.ReactNode; color: string; borderColor: string }
> = {
  Draft: { 
    label: "Đơn mới", 
    icon: <Clipboard size={18} />, 
    color: "text-gray-600",
    borderColor: "border-gray-500"
  },
  Pending: { 
    label: "Chờ xử lý", 
    icon: <Clock size={18} />, 
    color: "text-yellow-600",
    borderColor: "border-yellow-500"
  },
  Accepted: { 
    label: "Đang thực hiện", 
    icon: <Loader size={18} />, 
    color: "text-blue-600",
    borderColor: "border-blue-500"
  },
  Completed: { 
    label: "Hoàn thành", 
    icon: <CheckCircle size={18} />, 
    color: "text-green-600",
    borderColor: "border-green-500"
  },
  Cancelled: { 
    label: "Đã hủy", 
    icon: <XCircle size={18} />, 
    color: "text-red-600",
    borderColor: "border-red-500"
  },
};

interface TaskBoardProps {
  orders: (TOrderResponse & { userFullName?: string; houseNo?: string })[];
  groupId?: string;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ orders, groupId }) => {
  const { boardData, moveOrder, isLoading } = useTaskBoard(orders);
  const [activeStatus, setActiveStatus] = useState<BoardStatus>("Draft");
  const [displayCount, setDisplayCount] = useState<number>(9);
  
  // Tất cả các trạng thái có thể có
  const allStatuses: BoardStatus[] = ["Draft", "Pending", "Accepted", "Completed", "Cancelled"];
  
  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 9);
  };

  // Hiển thị trạng thái loading khi đang tải dữ liệu
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex flex-col items-center">
          <RefreshCw className="animate-spin h-8 w-8 text-blue-500 mb-2" />
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex bg-white rounded-lg border border-gray-200 shadow-sm h-[calc(100vh-12rem)] overflow-hidden">
      {/* Sidebar with tabs */}
      <div className="w-64 border-r border-gray-200 flex flex-col bg-gray-50">
        {allStatuses.map((status) => {
          const config = statusConfig[status];
          const count = boardData[status]?.length || 0;
          const isActive = activeStatus === status;
          
          return (
            <button
              key={status}
              onClick={() => {
                setActiveStatus(status);
                setDisplayCount(9); // Reset khi chuyển tab
              }}
              className={cn(
                "flex items-center justify-between px-4 py-3 text-left transition-colors",
                "hover:bg-gray-100 border-l-4",
                isActive 
                  ? `${config.borderColor} bg-gray-100` 
                  : "border-l-transparent"
              )}
              aria-selected={isActive}
            >
              <div className="flex items-center gap-3">
                <span className={config.color}>{config.icon}</span>
                <span className="font-medium text-gray-800">{config.label}</span>
              </div>
              <span className="bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs font-medium">
                {count}
              </span>
            </button>
          );
        })}
      </div>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
            <span className={statusConfig[activeStatus].color}>
              {statusConfig[activeStatus].icon}
            </span>
            {statusConfig[activeStatus].label}
            <span className="text-sm text-gray-500 ml-2">
              ({boardData[activeStatus]?.length || 0} đơn hàng)
            </span>
          </h2>
        </div>
        
        {/* Orders grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {!boardData[activeStatus] || boardData[activeStatus].length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100">
                {statusConfig[activeStatus].icon}
              </div>
              <p className="mt-2">Không có đơn hàng nào</p>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {boardData[activeStatus]?.slice(0, displayCount).map((order) => (
                  <TaskCard 
                    key={order.id} 
                    order={order} 
                    groupId={groupId} 
                  />
                ))}
              </div>
              
              {boardData[activeStatus]?.length > displayCount && (
                <div className="flex justify-center mt-6">
                  <Button 
                    onClick={handleLoadMore}
                    variant="outline" 
                    className="flex items-center gap-1 px-4 py-2"
                  >
                    Xem thêm <ChevronDown size={16} />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};