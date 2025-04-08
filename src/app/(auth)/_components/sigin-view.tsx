/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import UserAuthForm from "./user-auth-form";
import AdminAuthForm from "@/app/(auth)/_components/admin-auth-form";
import LaundryAuthForm from "@/app/(auth)/_components/laundry-auth-form";
import { ModeToggle } from "@/components/mode-toggle";
import Image from "next/image";
import { UserIcon, ShieldIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SignInViewPage() {
  const [activeRole, setActiveRole] = useState<"user" | "admin">("user");
  const [activeUserTab, setActiveUserTab] = useState<"cleaning" | "laundry">("cleaning");
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.classList.add("loaded");
    }
  }, []);

  const getTabDescription = () => {
    if (activeRole === "admin") {
      return "Đăng nhập tài khoản Admin.";
    } else {
      if (activeUserTab === "laundry") {
        return "Đăng nhập tài khoản quản lí Giặt Đồ của bạn.";
      } else {
        return "Đăng nhập tài khoản quản lí Dịch Vụ của bạn.";
      }
    }
  };

  const toggleRole = (role: "user" | "admin") => {
    if (!isAnimating && role !== activeRole) {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveRole(role);
        setTimeout(() => {
          setIsAnimating(false);
        }, 300);
      }, 300);
    }
  };

  const handleUserTabChange = (tab: string) => {
    setActiveUserTab(tab as "cleaning" | "laundry");
  };

  return (
    <div className="relative h-screen flex flex-col lg:grid lg:grid-cols-12 lg:gap-0 overflow-y-auto bg-gray-100">
      {/* Header for theme toggle */}
      <div className="absolute top-2 right-2 z-50 flex items-center gap-2">
        <ModeToggle />
      </div>

      {/* Background image section */}
      <div className="relative hidden lg:flex h-full flex-col bg-muted lg:col-span-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/30 z-10" />
        <Image
          src="/image/login-img.jpg"
          alt="Background"
          className="absolute inset-0 h-full w-full object-cover transition-all duration-500"
          width={2000}
          height={2080}
          priority
        />
      </div>

      <div
        ref={containerRef}
        className="flex h-full items-center justify-center p-4 lg:p-6 lg:col-span-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto flex w-full flex-col justify-center space-y-3 sm:max-w-[550px] bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 border border-gray-200">          <div className="flex justify-center mb-2">
            <Image
              src="/image/homeplus-logo.png"
              alt="Home Plus Logo"
              width={140}
              height={48}
              className="mb-2"
            />
          </div>

          <div className="flex items-center justify-between">
            <motion.div
              key={`title-${activeRole}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col space-y-2"
            >
              <h1 className="text-2xl font-semibold tracking-tight text-gray-800">
                {activeRole === "admin" ? "Đăng nhập Admin" : "Chào mừng đến HomePlus & Vinlaundry"}  
              </h1>
              <p className="text-sm text-gray-600">{getTabDescription()}</p>
            </motion.div>

            <div
              onClick={() => toggleRole(activeRole === "user" ? "admin" : "user")}
              className={`flex items-center justify-center w-12 h-12 rounded-full cursor-pointer transition-all duration-300 ${
                activeRole === "admin"
                  ? "bg-red-100 text-red-500"
                  : "bg-blue-100 text-blue-500"
              } hover:shadow-md`}
            >
              <motion.div
                animate={{ rotate: isAnimating ? 180 : 0 }}
                transition={{ duration: 0.5 }}
              >
                {activeRole === "admin" ? (
                  <ShieldIcon size={24} />
                ) : (
                  <UserIcon size={24} />
                )}
              </motion.div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeRole === "admin" ? (
              <motion.div
                key="admin-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AdminAuthForm />
              </motion.div>
            ) : (
              <motion.div
                key="user-tabs-container"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Tabs
                  value={activeUserTab}
                  onValueChange={handleUserTabChange}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100 rounded-md p-1">
                    <TabsTrigger
                      value="cleaning"
                      className="text-sm text-gray-700 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      Dọn dẹp
                    </TabsTrigger>
                    <TabsTrigger
                      value="laundry"
                      className="text-sm text-gray-700 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      Giặt đồ
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="cleaning" className="mt-0">
                    <UserAuthForm />
                  </TabsContent>

                  <TabsContent value="laundry" className="mt-0">
                    <LaundryAuthForm />
                  </TabsContent>
                </Tabs>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom links */}
          <div className="mt-4">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <span>
                {activeRole === "user" ? "Chưa có tài khoản?" : "Đăng nhập thường?"}
              </span>
              <Link
                href={activeRole === "user" ? "/register" : "#"}
                className={`font-medium ${
                  activeRole === "user"
                    ? "text-blue-600 hover:text-blue-500"
                    : "text-red-600 hover:text-red-500"
                }`}
                onClick={
                  activeRole === "user" ? undefined : () => toggleRole("user")
                }
              >
                {activeRole === "user" ? "Liên hệ" : "Người dùng"}
              </Link>
            </div>
          </div>

          <p className="px-2 text-center text-xs text-gray-500">
            Bằng cách tiếp tục, bạn đồng ý với{" "}
            <Link
              href="/terms"
              className="underline underline-offset-2 hover:text-blue-600"
            >
              Điều khoản
            </Link>{" "}
            và{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-2 hover:text-blue-600"
            >
              Bảo mật
            </Link>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
}