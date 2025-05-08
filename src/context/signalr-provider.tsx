/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import * as signalR from "@microsoft/signalr";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { TOrderLaundryResponse } from "@/schema/VinLaudry/laundry-order";

export type Notification = {
  message: string;
  type: "all" | "Manager" | "Admin" | "User";
  timestamp: Date;
};

let globalConnection: signalR.HubConnection | null = null;
let connectionCounter = 0;

type SignalRContextType = {
  connection: signalR.HubConnection | null;
  notifications: Notification[];
  connectionId: string | null;
  connectionStatus: "connecting" | "connected" | "disconnected" | "error";
  clearNotifications: () => void;
};

const SignalRContext = createContext<SignalRContextType | undefined>(undefined);

export const SignalRProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected" | "error"
  >("disconnected");
  const hasRegisteredListeners = useRef(false);
  const instanceId = useRef(++connectionCounter);

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
        .withUrl("https://homeclean.vinhomesresident.com/homeCleanHub", {
          accessTokenFactory: () => accessToken,
          transport:
            signalR.HttpTransportType.WebSockets ,
            // signalR.HttpTransportType.LongPolling,
            skipNegotiation:true
        })
        .configureLogging(signalR.LogLevel.Debug)
        .withAutomaticReconnect([0, 2, 1, 3])
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
          console.warn("Connection closed with error:", error);
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

    connection.on("ReceiveNotificationToManager", (message: string) => {
      setNotifications((prev) => [
        ...prev,
        { message, type: "Manager", timestamp: new Date() },
      ]);
    });

    connection.on("OrderStatusChanged", (orderId: string, status: string) => {
      console.log(`Order ${orderId} status changed to ${status}`);
      const event = new CustomEvent("orderStatusChanged", {
        detail: { orderId, status },
      });
      window.dispatchEvent(event);
    });

    connection.on("OrderCreated", (order: TOrderLaundryResponse) => {
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
    const handleTokenChange = () => {
      if (globalConnection?.state === signalR.HubConnectionState.Connected) {
        globalConnection.stop().then(() => {
          initializeConnection();
        });
      } else {
        initializeConnection();
      }
    };

    window.addEventListener("tokenChanged", handleTokenChange);

    initializeConnection();

    return () => {
      window.removeEventListener("tokenChanged", handleTokenChange);
      if (globalConnection && instanceId.current === connectionCounter) {
        globalConnection.stop();
      }
    };
  }, []);

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem("notifications");
  };

  const value = {
    connection: globalConnection,
    notifications,
    connectionId,
    connectionStatus,
    clearNotifications,
  };

  return (
    <SignalRContext.Provider value={value}>{children}</SignalRContext.Provider>
  );
};

export const useSignalRContext = () => {
  const context = useContext(SignalRContext);
  if (context === undefined) {
    throw Error("useSignalRContext must be used within a SignalRProvider");
  }
  return context;
};
