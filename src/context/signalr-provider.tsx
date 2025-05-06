// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react-hooks/exhaustive-deps */
// "use client";

// import * as signalR from "@microsoft/signalr";
// import {
//   createContext,
//   useContext,
//   useEffect,
//   useRef,
//   useState,
//   ReactNode,
// } from "react";
// import { TOrderLaundryResponse } from "@/schema/VinLaudry/laundry-order";

// export type Notification = {
//   message: string;
//   type: "All" | "User" | "Group" | "Manager" | "Admin";
//   timestamp: Date;
// };

// let globalConnection: signalR.HubConnection | null = null;
// let connectionCounter = 0;

// type SignalRContextType = {
//   connection: signalR.HubConnection | null;
//   notifications: Notification[];
//   connectionId: string | null;
//   connectionStatus: "connecting" | "connected" | "disconnected" | "error";
//   clearNotifications: () => void;
// };

// const SignalRContext = createContext<SignalRContextType | undefined>(undefined);

// export const SignalRProvider = ({ children }: { children: ReactNode }) => {
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [connectionId, setConnectionId] = useState<string | null>(null);
//   const [connectionStatus, setConnectionStatus] = useState<
//     "connecting" | "connected" | "disconnected" | "error"
//   >("disconnected");
//   const hasRegisteredListeners = useRef(false);
//   const instanceId = useRef(++connectionCounter);

//   // Load notifications from localStorage on mount
//   useEffect(() => {
//     const storedNotifications = localStorage.getItem("notifications");
//     if (storedNotifications) {
//       try {
//         setNotifications(JSON.parse(storedNotifications));
//       } catch (error) {
//         console.error("Failed to parse stored notifications:", error);
//       }
//     }
//   }, []);

//   // Save notifications to localStorage when they change
//   useEffect(() => {
//     localStorage.setItem("notifications", JSON.stringify(notifications));
//   }, [notifications]);

//   // Helper function to get accessToken and user from localStorage or cookies
//   const getAccessToken = () => {
//     // Prefer localStorage as per your code, fallback to cookies
//     let accessToken = localStorage.getItem("accessToken");
//     if (!accessToken) {
//       accessToken = document.cookie
//         .split("; ")
//         .find((row) => row.startsWith("accessToken="))
//         ?.split("=")[1] ?? null;
//     }
//     if (!accessToken) {
//       throw new Error("No access token found");
//     }
//     return accessToken;
//   };

//   const getUser = () => {
//     const userRaw = document.cookie
//       .split("; ")
//       .find((row) => row.startsWith("user="))
//       ?.split("=")[1];
//     return userRaw ? JSON.parse(userRaw) : null;
//   };

//   // Helper function to refresh accessToken
//   const refreshAccessToken = async () => {
//     try {
//       const refreshToken = document.cookie
//         .split("; ")
//         .find((row) => row.startsWith("refreshToken="))
//         ?.split("=")[1];

//       if (!refreshToken) {
//         throw new Error("No refresh token found");
//       }

//       const response = await fetch("/api/refresh-token", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ refreshToken }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to refresh token");
//       }

//       const { accessToken: newAccessToken } = await response.json();
//       localStorage.setItem("accessToken", newAccessToken);
//       document.cookie = `accessToken=${newAccessToken}; path=/; Secure; HttpOnly`;
//       return newAccessToken;
//     } catch (error) {
//       console.error("[SignalR] Token refresh failed:", error);
//       throw error;
//     }
//   };

//   // Handle notification
//   const handleOrderLaundryNotification = (
//     message: string,
//     type: "All" | "User" | "Group"
//   ) => {
//     console.log(`Received ${type} notification:`, message);
//     setNotifications((prev) => [
//       ...prev,
//       { message, type, timestamp: new Date() },
//     ]);
//   };

//   // Initialize SignalR connection
//   const initializeConnection = async () => {
//     try {
//       if (
//         globalConnection &&
//         globalConnection.state === signalR.HubConnectionState.Connected
//       ) {
//         console.log("Using existing connection", globalConnection.connectionId);
//         setConnectionId(globalConnection.connectionId ?? null); // Coerce undefined to null
//         setConnectionStatus("connected");
//         return;
//       }

//       setConnectionStatus("connecting");
//       console.log("Initializing new SignalR connection");

//       let accessToken = getAccessToken();
//       const user = getUser();

//       // Configure new hub connection with Bearer token and WebSocket transport
//       const newConnection = new signalR.HubConnectionBuilder()
//         .withUrl("https://homeclean.vinhomesresident.com/homeCleanHub", {
//           accessTokenFactory: () => `Bearer ${accessToken}`,
//           skipNegotiation: true,
//           transport: signalR.HttpTransportType.WebSockets,
//           headers: {
//             "x-group-id": user?.groupId || "",
//           },
//         })
//         .configureLogging(signalR.LogLevel.Debug)
//         .withAutomaticReconnect([0, 2000, 10000, 30000])
//         .build();

//       globalConnection = newConnection;
//       registerEventListeners(newConnection);

//       newConnection.onreconnected((connectionId) => {
//         console.log("Connection successfully reconnected with ID:", connectionId);
//         setConnectionId(connectionId ?? null);
//         setConnectionStatus("connected");
//       });

//       newConnection.onreconnecting((error) => {
//         setConnectionStatus("connecting");
//         console.warn("Reconnecting due to:", error);
//       });

//       newConnection.onclose((error) => {
//         setConnectionStatus("disconnected");
//         if (error) {
//           console.error("Connection closed with error:", error);
//         } else {
//           console.log("Connection closed gracefully");
//         }
//       });

//       try {
//         await newConnection.start();
//         console.log("Connection started successfully with ID:", newConnection.connectionId);
//         setConnectionId(newConnection.connectionId ?? null);
//         setConnectionStatus("connected");
//       } catch (error: any) {
//         if (error.message?.includes("401")) {
//           console.log("[SignalR] Token expired, attempting refresh");
//           accessToken = await refreshAccessToken();
//           // Rebuild connection with new token
//           globalConnection = null; // Reset to force new connection
//           await initializeConnection();
//         } else {
//           throw error;
//         }
//       }
//     } catch (err) {
//       console.error("Error establishing SignalR connection:", err);
//       setConnectionStatus("error");
//       setTimeout(initializeConnection, 5000);
//     }
//   };

//   // Register event listeners
//   const registerEventListeners = (connection: signalR.HubConnection) => {
//     if (hasRegisteredListeners.current) {
//       console.log("Event listeners already registered, skipping registration");
//       return;
//     }

//     console.log("Registering SignalR event listeners");
//     hasRegisteredListeners.current = true;

//     connection.on("ReceiveNotificationToAll", (args: string) => {
//       console.log("ReceiveNotificationToAll received:", args);
//       handleOrderLaundryNotification(args, "All");
//     });

//     connection.on("ReceiveNotificationToUser", (args: string) => {
//       console.log("ReceiveNotificationToUser received:", args);
//       handleOrderLaundryNotification(args, "User");
//     });

//     connection.on("LaundryOrderToUser", (args: string) => {
//       console.log("ReceiveNotificationToGroup received:", args);
//       handleOrderLaundryNotification(args, "Group");
//     });

//     connection.on("ReceiveNotificationToManager", (message: string) => {
//       console.log("Manager notification received:", message);
//       setNotifications((prev) => [
//         ...prev,
//         { message, type: "Manager", timestamp: new Date() },
//       ]);
//     });

//     connection.on("OrderStatusChanged", (orderId: string, status: string) => {
//       console.log(`Order ${orderId} status changed to ${status}`);
//       const event = new CustomEvent("orderStatusChanged", {
//         detail: { orderId, status },
//       });
//       window.dispatchEvent(event);
//     });

//     connection.on("OrderCreated", (order: TOrderLaundryResponse) => {
//       console.log(`New order created:`, order);
//       const event = new CustomEvent("orderCreated", {
//         detail: { order },
//       });
//       window.dispatchEvent(event);
//       setNotifications((prev) => [
//         ...prev,
//         {
//           message: `Đơn hàng mới #${order.orderCode} đã được tạo`,
//           type: "All",
//           timestamp: new Date(),
//         },
//       ]);
//     });
//   };

//   // Effect for connection setup and cleanup
//   useEffect(() => {
//     const handleTokenChange = () => {
//       console.log("Token changed, reconnecting SignalR");
//       if (globalConnection?.state === signalR.HubConnectionState.Connected) {
//         globalConnection.stop().then(() => {
//           initializeConnection();
//         });
//       } else {
//         initializeConnection();
//       }
//     };

//     window.addEventListener("tokenChanged", handleTokenChange);

//     console.log("Initial SignalR connection setup");
//     initializeConnection();

//     return () => {
//       console.log("Cleaning up SignalR connection");
//       window.removeEventListener("tokenChanged", handleTokenChange);
//       if (globalConnection && instanceId.current === connectionCounter) {
//         console.log("Stopping SignalR connection on unmount");
//         globalConnection.stop().catch((err) =>
//           console.error("Error stopping connection:", err)
//         );
//       }
//     };
//   }, []);

//   // Clear notifications
//   const clearNotifications = () => {
//     console.log("Clearing all notifications");
//     setNotifications([]);
//     localStorage.removeItem("notifications");
//   };

//   const value = {
//     connection: globalConnection,
//     notifications,
//     connectionId,
//     connectionStatus,
//     clearNotifications,
//   };

//   return (
//     <SignalRContext.Provider value={value}>{children}</SignalRContext.Provider>
//   );
// };

// export const useSignalRContext = () => {
//   const context = useContext(SignalRContext);
//   if (context === undefined) {
//     throw new Error("useSignalRContext must be used within a SignalRProvider");
//   }
//   return context;
// };


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
            signalR.HttpTransportType.WebSockets |
            signalR.HttpTransportType.LongPolling,
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
      // Chỉ ngắt kết nối khi component unmount hoàn toàn
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
    throw new Error("useSignalRContext must be used within a SignalRProvider");
  }
  return context;
};