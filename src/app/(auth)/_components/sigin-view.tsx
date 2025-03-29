"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import UserAuthForm from "./user-auth-form";
import AdminAuthForm from "@/app/(auth)/_components/admin-auth-form";
import { ModeToggle } from "@/components/mode-toggle";
import Image from "next/image";
import { UserIcon, ShieldIcon } from "lucide-react";

export default function SignInViewPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleForm = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsAdmin(!isAdmin);
        setTimeout(() => {
          setIsAnimating(false);
        }, 300);
      }, 300);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.classList.add("loaded");
    }
  }, []);

  return (
    <div className="relative h-screen flex flex-col lg:grid lg:grid-cols-12 lg:gap-0">
      {/* Header for logo - visible on all screens */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-4">
        <ModeToggle />
      </div>

      {/* Background image section - 6 cols */}
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

        {/* Logo and tagline positioned at top left of image area */}
        <div className="relative z-20 p-8">
          <div className="flex flex-col items-start">
            <Image
              src="/image/homeplus-logo.svg"
              alt="Home Plus Logo"
              width={180}
              height={60}
              className="mb-3"
            />
            <span className="text-xl font-bold text-white mt-2">
              DỊCH VỤ CHO MỌI NHU CẦU CỦA BẠN
            </span>
          </div>
        </div>

        {/* Quote at bottom of image area */}
        <div className="mt-auto relative z-20 p-8">
          <blockquote className="space-y-2">
            <p className="text-lg text-white">
              &ldquo;Chúng tôi mang đến dịch vụ chất lượng, tiện lợi dành cho
              ngôi nhà của bạn.&rdquo;
            </p>
            <footer className="text-sm text-white/70">Homeplus Team</footer>
          </blockquote>
        </div>
      </div>

      {/* Form section - 6 cols */}
      <div
        ref={containerRef}
        className="flex h-full items-center justify-center p-4 lg:p-8 lg:col-span-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]"
        >
          <div className="flex items-center justify-between">
            <motion.div
              key={`title-${isAdmin}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col space-y-2"
            >
              <h1 className="text-2xl font-semibold tracking-tight">
                {isAdmin ? "Đăng nhập Admin" : "Chào mừng bạn quay trở lại"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isAdmin
                  ? "Vui lòng đăng nhập vào tài khoản Admin."
                  : "Vui lòng đăng nhập vào tài khoản của bạn."}
              </p>
            </motion.div>

            {/* Toggle icon */}
            <div
              onClick={toggleForm}
              className={`flex items-center justify-center w-12 h-12 rounded-full cursor-pointer transition-all duration-300 ${
                isAdmin
                  ? "bg-red-100 text-red-500"
                  : "bg-blue-100 text-blue-500"
              } hover:shadow-md`}
            >
              <motion.div
                animate={{ rotate: isAnimating ? 180 : 0 }}
                transition={{ duration: 0.5 }}
              >
                {isAdmin ? <ShieldIcon size={20} /> : <UserIcon size={20} />}
              </motion.div>
            </div>
          </div>

          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-3 text-muted-foreground">
              Đăng nhập với form
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`form-${isAdmin}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {isAdmin ? <AdminAuthForm /> : <UserAuthForm />}
            </motion.div>
          </AnimatePresence>

          <div className="mt-6">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {isAdmin ? "Không phải Admin?" : "Chưa có tài khoản?"}
              </span>
              <Link
                href={isAdmin ? "#" : "/register"}
                className={`text-sm font-medium ${
                  isAdmin
                    ? "text-blue-600 hover:text-blue-500"
                    : "text-primary hover:text-primary/90"
                }`}
                onClick={isAdmin ? toggleForm : undefined}
              >
                {isAdmin ? "Đăng nhập Người dùng" : "Liên hệ với chúng tôi"}
              </Link>
            </div>
          </div>

          <p className="px-4 text-center text-xs text-muted-foreground">
            Bằng cách tiếp tục, bạn đồng ý với{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Điều khoản dịch vụ
            </Link>{" "}
            và{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Chính sách bảo mật
            </Link>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
}
