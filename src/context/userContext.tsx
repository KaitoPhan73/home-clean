"use client";
import { loadUserFromStorage } from "@/redux/User/userSlice";
import store, { AppDispatch } from "@/redux/store";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const dispatch = store.dispatch as AppDispatch;
    dispatch(loadUserFromStorage());

    // Check initial auth state
    const checkAuth = () => {
      const hasUser = localStorage.getItem("user");
      const hasToken = localStorage.getItem("accessToken");

      if (hasUser && hasToken) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.push("/logout");
      }
    };

    // Check khi component mount
    checkAuth();

    // Listen to localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user" || e.key === "accessToken") {
        checkAuth();
      }
    };

    // Listen to custom event for same-tab changes
    const handleCustomStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("localStorageChange", handleCustomStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "localStorageChange",
        handleCustomStorageChange
      );
    };
  }, [router]);

  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
