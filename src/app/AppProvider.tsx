/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import React, { createContext, useContext, useState } from "react";

// const AppContext = createContext({
//   sessionToken: "",
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   setSessionToken: (sessionToken: string) => {}
// });

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// export const useAppContext = () => {
//   const context = useContext(AppContext);
//   if (!context) {
//     throw new Error("useAppContext must be used within an AppProvider");
//   }
//   return context;
// };

// export default function AppProvider({
//   children,
//   initialSessionToken = ''
// }: {
//   children: React.ReactNode;
//   initialSessionToken?: string;
// }) {
//   const [sessionToken, setSessionToken] = useState(initialSessionToken);
//   return (
//     <AppContext.Provider value={{ sessionToken, setSessionToken }}>
//       {children}
//     </AppContext.Provider>
//   );
// }

"use client";

import { SignalRProvider } from "@/context/signalr-provider";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Tạo context để quản lý session token
const AppContext = createContext({
  sessionToken: "",
  setSessionToken: (sessionToken: string) => {}
});

// Hook để sử dụng AppContext
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

type AppProviderProps = {
  children: ReactNode;
  initialSessionToken?: string;
};

export default function AppProvider({
  children,
  initialSessionToken = ''
}: AppProviderProps) {
  const [sessionToken, setSessionToken] = useState(initialSessionToken);

  // Đồng bộ token vào localStorage khi token thay đổi
  useEffect(() => {
    if (sessionToken && typeof window !== 'undefined') {
      const currentToken = localStorage.getItem('accessToken');
      if (currentToken !== sessionToken) {
        localStorage.setItem('accessToken', sessionToken);
        // Trigger custom event để thông báo token đã thay đổi
        window.dispatchEvent(new Event('tokenChanged'));
      }
    }
  }, [sessionToken]);

  // Đồng bộ initial token từ server components
  useEffect(() => {
    if (initialSessionToken && initialSessionToken !== sessionToken) {
      setSessionToken(initialSessionToken);
    }
  }, [initialSessionToken]);

  return (
    <AppContext.Provider value={{ sessionToken, setSessionToken }}>
      <SignalRProvider>
        {children}
      </SignalRProvider>
    </AppContext.Provider>
  );
}

