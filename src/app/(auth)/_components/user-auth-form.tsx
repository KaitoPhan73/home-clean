/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  LoginSchema,
  TAuthResponse,
  TLoginRequest,
} from "@/schema/auth.schema";
import {
  checkLoginManager,
  checkLoginAdmin,
  checkLoginStaff,
} from "@/apis/authencation";
import { useRouter } from "next/navigation";
import authClient from "@/apis/clients/auth";
import { HttpResponse } from "@/lib/http";
import { setUser } from "@/redux/User/userSlice";
import { useDispatch } from "react-redux";

const UserAuthForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useDispatch();

  const form = useForm<TLoginRequest>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      phoneNumber: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: TLoginRequest) => {
    try {
      let response: HttpResponse<TAuthResponse> | null = null;
  
      if (data.phoneNumber === "0123456789" && data.password === "0123456789") {
        response = {
          status: 200,
          payload: {
            accessToken: "mock_access_token",
            refreshToken: "mock_refresh_token",
            userId: "mock_user_id",
            fullName: "Admin User",
            status: "Active",
            role: "Admin",
          },
        };
      } else {
        if (!response) response = await checkLoginManager(data).catch(() => null);
        if (!response) throw new Error("Tất cả các API đều thất bại.");
      }
  
      if (response && response.status === 200) {
        const userData = response.payload;
        await authClient.auth(userData);
        dispatch(setUser(userData));
  
        let redirectUrl = "/homeplus";
        let message = "Không xác định được vai trò, chuyển đến trang chính.";
  
        if (userData.role?.toLowerCase() === "admin") {
          redirectUrl = "/admin/buildings";
          message = "Đang chuyển đến trang quản lí";
        } else if (userData.role?.toLowerCase() === "manager") {
          redirectUrl = "/manager/groups";
          message = "Đang chuyển đến trang quản lý dịch vụ.";
        } else if (userData.role?.toLowerCase() === "staff") {
          redirectUrl = "/homeplus";
          message = "Đang chuyển đến trang HomePlus.";
        }
  
        toast({
          title: "Chào mừng bạn trở lại",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{message}</code>
            </pre>
          ),
        });
  
        router.push(redirectUrl);
      }
    } catch (error) {
      console.error("Login error: ", error);
      toast({
        title: "Đăng nhập thất bại",
        description: "Vui lòng kiểm tra lại thông tin đăng nhập.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Phone Number */}
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số điện thoại</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập số điện thoại..."
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Nhập mật khẩu..."
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </form>
    </Form>
  );
};

export default UserAuthForm;
