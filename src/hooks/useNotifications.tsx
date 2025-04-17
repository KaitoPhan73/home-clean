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
  const isTabActive = useRef(true);

  // Khôi phục thông báo từ localStorage khi khởi tạo
  useEffect(() => {
    const storedNotifications = localStorage.getItem("notifications");
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    }
  }, []);

  // Lưu thông báo vào localStorage khi có cập nhật
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  const initializeConnection = async () => {
    if (!isTabActive.current) return; // Không kết nối nếu tab không active

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
        .withUrl("https://homeclean.vinhomesresident.com/homeCleanHub", {
          accessTokenFactory: () => accessToken,
          transport:
            signalR.HttpTransportType.WebSockets |
            signalR.HttpTransportType.LongPolling,
        })
        .configureLogging(signalR.LogLevel.Debug)
        .withAutomaticReconnect([0, 2, 1, 3]) // Giảm tần suất reconnect
        .build();

      globalConnection = newConnection;
      registerEventListeners(newConnection);

      newConnection.onreconnected((connectionId) => {
        setConnectionId(connectionId || null);
        setConnectionStatus("connected");
      });

      newConnection.onreconnecting((error) => {
        setConnectionStatus("connecting");
        console.warn("Reconnecting due to:", error);
      });

      newConnection.onclose((error) => {
        setConnectionStatus("disconnected");
        if (error) {
          console.warn("Connection closed with error:", error); // Chỉ log, không crash
        } else {
          console.log("Connection closed gracefully");
        }
      });

      await newConnection.start();
      setConnectionId(newConnection.connectionId || null);
      setConnectionStatus("connected");
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
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      isTabActive.current = !document.hidden;
      if (isTabActive.current) {
        if (
          globalConnection?.state === signalR.HubConnectionState.Disconnected
        ) {
          initializeConnection();
        }
      } else {
        if (globalConnection?.state === signalR.HubConnectionState.Connected) {
          globalConnection.stop(); // Ngắt kết nối khi tab inactive
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    initializeConnection();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (globalConnection && instanceId.current === connectionCounter) {
        globalConnection.stop(); // Chỉ stop nếu đây là instance cuối cùng
      }
    };
  }, []);

  return {
    connection: globalConnection,
    notifications,
    connectionId,
    connectionStatus,
    clearNotifications: () => setNotifications([]),
  };
};
