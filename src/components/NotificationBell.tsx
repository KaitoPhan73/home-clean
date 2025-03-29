/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSignalR } from "@/hooks/useNotifications";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface OrderNotification {
  Type: string;
  Data: {
    OrderId: string;
    ServiceName: string;
    BuildingName: string;
    HouseNumber: string;
    RoomNumber: string | null;
  };
  timestamp: Date;
  type: "all" | "Manager" | "Admin" | "User";
}

const NotificationComponent = () => {
  const { notifications, connectionStatus, connectionId } = useSignalR();
  const [unreadCount, setUnreadCount] = useState(0);

  const parsedNotifications: OrderNotification[] = notifications
    .map((notif) => ({
      ...JSON.parse(notif.message),
      timestamp: notif.timestamp,
      type: notif.type,
    }))
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const playNotificationSound = () => {
    const audio = new Audio("/audios/mixkit-dog-barking-twice-1.wav");
    audio.play().catch((error) => console.log("Lỗi phát âm thanh:", error));
  };

  useEffect(() => {
    if (notifications.length > unreadCount) {
      playNotificationSound();
    }
    setUnreadCount(notifications.length);
  }, [notifications.length]);

  const markAsRead = () => {
    setUnreadCount(0);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -right-1 -top-1 h-4 w-4 p-0 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="start">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-lg">Thông báo</h4>
            <Button variant="ghost" size="sm" onClick={markAsRead}>
              Đánh dấu đã đọc
            </Button>
          </div>

          {/* Connection Status */}
          <div className="text-xs text-gray-500">
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
            </div>
            {connectionId && (
              <div className="mt-1">
                ID: <span className="font-mono">{connectionId.slice(0, 8)}...</span>
              </div>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-72 overflow-y-auto space-y-3 pr-2">
            {parsedNotifications.length > 0 ? (
              parsedNotifications.map((notification, index) => (
                <div
                  key={index}
                  className="bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-sm">
                        {notification.Data.ServiceName}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          notification.type === "all"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {notification.type === "all" ? "Tất cả" : "User"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      {notification.Data.BuildingName}
                    </p>
                    <p className="text-xs">
                      <span className="font-medium">Order ID:</span> {notification.Data.OrderId}
                    </p>
                    <p className="text-xs">
                      <span className="font-medium">Số nhà:</span> {notification.Data.HouseNumber}
                    </p>
                    {notification.Data.RoomNumber && (
                      <p className="text-xs">
                        <span className="font-medium">Số phòng:</span> {notification.Data.RoomNumber}
                      </p>
                    )}
                    <div className="flex justify-end">
                      <p className="text-xs text-gray-500">
                        {formatTimeAgo(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 py-4 text-center">
                Không có thông báo mới
              </p>
            )}
          </div>
        </div>
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