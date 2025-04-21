/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from "react";
import { useSignalR } from "@/hooks/useNotifications";
import { Bell, Check, X, ChevronLeft, ShoppingCart, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

// Define the different notification types
interface BaseNotification {
  timestamp: Date;
  type: "all" | "Manager" | "Admin" | "User";
  isRead?: boolean;
}

interface OrderNotification extends BaseNotification {
  notificationType: "order";
  Type: string;
  Data: {
    OrderId: string;
    ServiceName: string;
    BuildingName: string;
    HouseNumber: string;
    RoomNumber: string | null;
  };
}

interface CancellationNotification extends BaseNotification {
  notificationType: "cancellation";
  options: {
    body: {
      cancellationReason: string;
      refundMethod: string;
      cancelledBy: string;
    }
  };
  orderId?: string; // Optional field to link the cancellation to an order
}

type Notification = OrderNotification | CancellationNotification;

const NotificationComponent = () => {
  const { notifications, connectionStatus, connectionId } = useSignalR();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Parse notifications with proper types
  const parsedNotifications = useMemo(() => {
    return notifications.map((notif) => {
      try {
        const parsed = JSON.parse(notif.message);
        
        // Determine notification type based on content
        if (parsed.options && parsed.options.body && parsed.options.body.cancellationReason) {
          return {
            notificationType: "cancellation",
            options: parsed.options,
            timestamp: notif.timestamp,
            type: notif.type,
            isRead: false
          } as CancellationNotification;
        } else if (parsed.Data && parsed.Data.OrderId) {
          return {
            notificationType: "order",
            ...parsed,
            timestamp: notif.timestamp,
            type: notif.type,
            isRead: false
          } as OrderNotification;
        }
        
        // Fallback if structure doesn't match expected types
        return null;
      } catch (e) {
        console.error("Error parsing notification:", e);
        return null;
      }
    })
    .filter((notif): notif is Notification => notif !== null)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [notifications]);

  const unreadNotifications = useMemo(() => 
    parsedNotifications.filter(notif => !notif.isRead), 
    [parsedNotifications]
  );

  const playNotificationSound = () => {
    const audio = new Audio("/audios/mixkit-dog-barking-twice-1.wav");
    audio.play().catch((error) => console.log("Lỗi phát âm thanh:", error));
  };

  useEffect(() => {
    if (notifications.length > unreadCount) {
      playNotificationSound();
      // Kích hoạt animation khi có thông báo mới
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 2000);
    }
    setUnreadCount(unreadNotifications.length);
  }, [notifications.length, unreadNotifications.length]);

  const markAllAsRead = () => {
    parsedNotifications.forEach(notif => {
      notif.isRead = true;
    });
    setUnreadCount(0);
  };

  const markAsRead = (index: number) => {
    if (parsedNotifications[index]) {
      parsedNotifications[index].isRead = true;
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const handleNotificationClick = (notification: Notification, index: number) => {
    setSelectedNotification(notification);
    markAsRead(index);
  };

  const handlePopoverOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSelectedNotification(null);
    }
  };

  const backToList = () => {
    setSelectedNotification(null);
  };

  const renderNotificationContent = (notification: Notification) => {
    if (notification.notificationType === "order") {
      return (
        <div className="space-y-3 p-4">
          <div className="flex items-center space-x-2">
            <Avatar className="h-10 w-10 bg-blue-100">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </Avatar>
            <div>
              <h3 className="font-semibold">Đơn hàng mới</h3>
              <p className="text-sm text-gray-500">{formatTimeAgo(notification.timestamp)}</p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Dịch vụ:</span>
              <span>{notification.Data.ServiceName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Địa điểm:</span>
              <span>{notification.Data.BuildingName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Số nhà:</span>
              <span>{notification.Data.HouseNumber}</span>
            </div>
            {notification.Data.RoomNumber && (
              <div className="flex justify-between">
                <span className="font-medium">Số phòng:</span>
                <span>{notification.Data.RoomNumber}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-normal">ID đơn hàng:</span>
              <span className="font-mono text-sm">{notification.Data.OrderId}</span>
            </div>
          </div>
        </div>
      );
    } else if (notification.notificationType === "cancellation") {
      return (
        <div className="space-y-3 p-4">
          <div className="flex items-center space-x-2">
            <Avatar className="h-10 w-10 bg-red-100">
              <X className="h-6 w-6 text-red-600" />
            </Avatar>
            <div>
              <h3 className="font-semibold">Hủy đơn hàng</h3>
              <p className="text-sm text-gray-500">{formatTimeAgo(notification.timestamp)}</p>
            </div>
          </div>
          
          <div className="bg-red-50 p-3 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Lý do hủy:</span>
              <span>{notification.options.body.cancellationReason}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Phương thức hoàn tiền:</span>
              <span>{notification.options.body.refundMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">ID người hủy:</span>
              <span className="font-mono text-sm truncate max-w-32">{notification.options.body.cancelledBy}</span>
            </div>
          </div>
          
          <div className="flex space-x-2 pt-2">
            <Button className="w-full">Xem chi tiết</Button>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderNotificationItem = (notification: Notification, index: number) => {
    const isUnread = !notification.isRead;
    
    if (notification.notificationType === "order") {
      return (
        <div
          key={index}
          className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition-colors ${isUnread ? 'bg-blue-50' : ''}`}
          onClick={() => handleNotificationClick(notification, index)}
        >
          <div className="flex items-start gap-3">
            <Avatar className={`h-10 w-10 ${isUnread ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <ShoppingCart className={`h-6 w-6 ${isUnread ? 'text-blue-600' : 'text-gray-500'}`} />
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <p className={`font-medium text-sm truncate ${isUnread ? 'text-blue-800' : ''}`}>
                  {notification.Data.ServiceName}
                </p>
                <span className="text-xs text-gray-500">
                  {formatTimeAgo(notification.timestamp)}
                </span>
              </div>
              <p className="text-xs text-gray-600 truncate">
                {notification.Data.BuildingName}, Nhà: {notification.Data.HouseNumber}
                {notification.Data.RoomNumber ? `, Phòng: ${notification.Data.RoomNumber}` : ''}
              </p>
              <p className="text-xs truncate">
                <span className="text-gray-500">Order ID:</span> {notification.Data.OrderId}
              </p>
            </div>
            {isUnread && <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>}
          </div>
        </div>
      );
    } else if (notification.notificationType === "cancellation") {
      return (
        <div
          key={index}
          className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition-colors ${isUnread ? 'bg-red-50' : ''}`}
          onClick={() => handleNotificationClick(notification, index)}
        >
          <div className="flex items-start gap-3">
            <Avatar className={`h-10 w-10 ${isUnread ? 'bg-red-100' : 'bg-gray-100'}`}>
              <AlertTriangle className={`h-6 w-6 ${isUnread ? 'text-red-600' : 'text-gray-500'}`} />
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <p className={`font-medium text-sm truncate ${isUnread ? 'text-red-800' : ''}`}>
                  Hủy đơn hàng
                </p>
                <span className="text-xs text-gray-500">
                  {formatTimeAgo(notification.timestamp)}
                </span>
              </div>
              <p className="text-xs text-gray-600 truncate">
                Lý do: {notification.options.body.cancellationReason}
              </p>
              <p className="text-xs truncate">
                <span className="text-gray-500">Phương thức hoàn tiền:</span> {notification.options.body.refundMethod}
              </p>
            </div>
            {isUnread && <div className="w-2 h-2 rounded-full bg-red-600 mt-2"></div>}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Popover open={isOpen} onOpenChange={handlePopoverOpenChange}>
      <PopoverTrigger asChild>
        <div className="relative">
          <motion.div
            animate={isAnimating ? {
              rotate: [0, -10, 10, -10, 10, -5, 5, 0]
            } : {}}
            transition={{ duration: 0.5 }}
          >
            <Button 
              variant="ghost" 
              size="icon" 
              className={`relative ${unreadCount > 0 ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-100' : ''}`}
            >
              <Bell className="h-5 w-5" />
            </Button>
          </motion.div>
          
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ 
                scale: isAnimating ? [1, 1.2, 1] : 1, 
                opacity: 1 
              }}
              transition={{ duration: 0.3 }}
              className="absolute -right-1 -top-1"
            >
              <Badge 
                className="h-5 min-w-5 p-0 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white shadow-md"
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            </motion.div>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 md:w-96 p-0 shadow-lg rounded-xl" align="end">
        {selectedNotification ? (
          <div className="max-h-96">
            <div className="flex items-center p-3 border-b">
              <Button variant="ghost" size="icon" onClick={backToList} className="mr-2">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h3 className="font-semibold text-lg">Chi tiết thông báo</h3>
            </div>
            <ScrollArea className="max-h-80">
              {renderNotificationContent(selectedNotification)}
            </ScrollArea>
          </div>
        ) : (
          <div className="max-h-96">
            <div className="flex justify-between items-center p-3 border-b">
              <h3 className="font-semibold text-lg">Thông báo</h3>
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                <Check className="h-3 w-3 mr-1" /> Đánh dấu đã đọc
              </Button>
            </div>
            
            {/* Luôn sử dụng ScrollArea với chiều cao cố định khi có từ 3 thông báo trở lên */}
            <div className={`${parsedNotifications.length >= 3 ? 'h-72' : 'max-h-72'} overflow-auto`}>
              {parsedNotifications.length > 0 ? (
                parsedNotifications.map((notification, index) => 
                  renderNotificationItem(notification, index)
                )
              ) : (
                <div className="text-center p-8 text-gray-500">
                  <p>Không có thông báo nào</p>
                </div>
              )}
            </div>
            
            <div className="text-xs text-gray-500 p-2 border-t">
              <div className="flex items-center">
                <span>Trạng thái: </span>
                <span
                  className={`ml-1 px-2 py-0.5 rounded-full font-medium ${
                    connectionStatus === "connected"
                      ? "bg-green-100 text-green-800"
                      : connectionStatus === "connecting"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {connectionStatus === "connected"
                    ? "Đã kết nối"
                    : connectionStatus === "connecting"
                    ? "Đang kết nối"
                    : "Ngắt kết nối"}
                </span>
                {connectionId && (
                <div className="mt-1 ml-40">
                  ID: <span className="font-mono">{connectionId.slice(0, 2)}...</span>
                </div>
              )}
              </div>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "vừa xong";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ trước`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} ngày trước`;
  return date.toLocaleDateString();
};

export default NotificationComponent;