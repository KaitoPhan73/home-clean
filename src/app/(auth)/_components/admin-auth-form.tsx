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
  LoginAdminSchema,
  TAuthResponse,
  TLoginAdminRequest,
} from "@/schema/auth.schema";
import { checkLoginAdmin } from "@/apis/authencation";
import { useRouter } from "next/navigation";
import authClient from "@/apis/clients/auth";
import { HttpResponse } from "@/lib/http";
import { setUser } from "@/redux/User/userSlice";
import { useDispatch } from "react-redux";

const AdminAuthForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useDispatch();

  const form = useForm<TLoginAdminRequest>({
    resolver: zodResolver(LoginAdminSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: TLoginAdminRequest) => {
    try {
      // Gọi API để xác thực tài khoản Admin
      const response: HttpResponse<TAuthResponse> = await checkLoginAdmin(data);

      if (response && response.status === 200) {
        const userData = response.payload;
        await authClient.auth(userData);
        dispatch(setUser(userData));

        let redirectUrl = "/homeplus";
        let message = "Không xác định được vai trò, chuyển đến trang chính.";

        if (userData.role?.toLowerCase() === "admin") {
          redirectUrl = "/admin/buildings";
          message = "Đang chuyển đến trang quản lý.";
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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên Đăng Nhập</FormLabel>
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

export default AdminAuthForm;
