/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedUsername = localStorage.getItem("admin_username");
    const savedPassword = localStorage.getItem("admin_password");
    const savedRememberMe = localStorage.getItem("admin_remember") === "true";
    
    if (savedUsername && savedPassword && savedRememberMe) {
      form.setValue("username", savedUsername);
      form.setValue("password", savedPassword);
      setRememberMe(true);
    }
  }, []);

  const form = useForm<TLoginAdminRequest>({
    resolver: zodResolver(LoginAdminSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRememberMeChange = (checked: boolean) => {
    setRememberMe(checked);
  };

  const onSubmit = async (data: TLoginAdminRequest) => {
    try {
      if (rememberMe) {
        localStorage.setItem("admin_username", data.username);
        localStorage.setItem("admin_password", data.password);
        localStorage.setItem("admin_remember", "true");
      } else {
        localStorage.removeItem("admin_username");
        localStorage.removeItem("admin_password");
        localStorage.removeItem("admin_remember");
      }

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
        {/* Username */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên Đăng Nhập</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập tên đăng nhập..."
                  {...field}
                  disabled={isSubmitting}
                  className="focus-visible:ring-red-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password with toggle visibility */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu..."
                    {...field}
                    disabled={isSubmitting}
                    className="pr-10 focus-visible:ring-red-500"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-500"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Remember Me and Forgot Password on the same line */}
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="admin-remember-me"
              checked={rememberMe}
              onCheckedChange={handleRememberMeChange}
              className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
            />
            <label
              htmlFor="admin-remember-me"
              className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Ghi nhớ mật khẩu
            </label>
          </div>
          <a
            href="#"
            className="text-red-600 hover:text-red-500 hover:underline transition-colors"
          >
            Quên mật khẩu?
          </a>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập Admin"}
        </Button>
      </form>
    </Form>
  );
};

export default AdminAuthForm;