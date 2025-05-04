/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import * as signalR from "@microsoft/signalr";
import { useState, useEffect, useRef } from "react";

export type Notification = {
  message: string;
  type: "all" | "Manager" | "Admin" | "User";
  timestamp: Date;
};

let globalConnection: signalR.HubConnection | null = null;
let connectionCounter = 0;

export const useSignalR = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected" | "error"
  >("disconnected");
  const hasRegisteredListeners = useRef(false);
  const instanceId = useRef(++connectionCounter);

  // Khôi phục thông báo từ localStorage khi khởi tạo
  useEffect(() => {
    const storedNotifications = localStorage.getItem("notifications");
    if (storedNotifications) {
      try {
        setNotifications(JSON.parse(storedNotifications));
      } catch (error) {
        console.error("Failed to parse stored notifications:", error);
      }
    }
  }, []);

  // Lưu thông báo vào localStorage khi có cập nhật
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  const initializeConnection = async () => {
    try {
      if (
        globalConnection &&
        globalConnection.state === signalR.HubConnectionState.Connected
      ) {
        setConnectionId(globalConnection.connectionId || null);
        setConnectionStatus("connected");
        return;
      }

      setConnectionStatus("connecting");
      const accessToken = localStorage.getItem("accessToken") || "";
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl("https://vinlaundry.vinhomesresident.com/vinLaundryHub", {
          accessTokenFactory: () => accessToken,
          transport:
            signalR.HttpTransportType.WebSockets |
            signalR.HttpTransportType.LongPolling,
        })
        .configureLogging(signalR.LogLevel.Debug)
        .withAutomaticReconnect() 
        .build();

      globalConnection = newConnection;
      registerEventListeners(newConnection);

      newConnection.onreconnected((connectionId) => {
        setConnectionId(connectionId || null);
        setConnectionStatus("connected");
        console.log("SignalR reconnected with connectionId:", connectionId);
      });

      newConnection.onreconnecting((error) => {
        setConnectionStatus("connecting");
        console.warn("SignalR reconnecting due to:", error);
      });

      newConnection.onclose((error) => {
        setConnectionStatus("disconnected");
        if (error) {
          console.warn("SignalR connection closed with error:", error);
        } else {
          console.log("SignalR connection closed gracefully");
        }
      });

      await newConnection.start();
      setConnectionId(newConnection.connectionId || null);
      setConnectionStatus("connected");
      console.log("SignalR connection established with connectionId:", newConnection.connectionId);
    } catch (err) {
      console.error("Error establishing SignalR connection:", err);
      setConnectionStatus("error");
    }
  };

  const registerEventListeners = (connection: signalR.HubConnection) => {
    if (hasRegisteredListeners.current) return;
    hasRegisteredListeners.current = true;

    connection.on("ReceiveNotificationToAll", (message: string) => {
      setNotifications((prev) => [
        ...prev,
        { message, type: "all", timestamp: new Date() },
      ]);
    });

    connection.on("ReceiveNotificationToUser", (message: string) => {
      setNotifications((prev) => [
        ...prev,
        { message, type: "Admin", timestamp: new Date() },
      ]);
    });

    connection.on("OrderStatusChanged", (orderId: string, status: string) => {
      console.log(`Received order status change: Order ${orderId} -> ${status}`);
      const event = new CustomEvent("orderStatusChanged", {
        detail: { orderId, status },
      });
      window.dispatchEvent(event);
    });

    connection.on("OrderCreated", (order: any) => {
      console.log(`New order created: ${order.id}`);
      const event = new CustomEvent("orderCreated", {
        detail: { order },
      });
      window.dispatchEvent(event);
      setNotifications((prev) => [
        ...prev,
        {
          message: `Đơn hàng mới #${order.orderCode} đã được tạo`,
          type: "all",
          timestamp: new Date(),
        },
      ]);
    });
  };

  useEffect(() => {
    initializeConnection();

    return () => {
      // Chỉ ngắt kết nối khi hook unmount
      if (globalConnection && instanceId.current === connectionCounter) {
        globalConnection.stop();
        console.log("SignalR connection stopped on cleanup");
      }
    };
  }, []);

  return {
    connection: globalConnection,
    notifications,
    connectionId,
    connectionStatus,
    clearNotifications: () => {
      setNotifications([]);
      localStorage.removeItem("notifications");
    },
  };
};