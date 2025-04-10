/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState } from "react";
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
import { Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { checkLoginManagerLaudry } from "@/apis/authencation";
import { useRouter } from "next/navigation";
import authClient from "@/apis/clients/auth";
import { setUser } from "@/redux/User/userSlice";
import { useDispatch } from "react-redux";
import { LoginLaundrySchema, TLoginLaundryRequest } from "@/schema/VinLaudry/auth-laudry";

// Compact toast notification
const CompactLaundryToast = ({ 
  message, 
  type = "success" 
}: { 
  message: string; 
  type: "success" | "error"; 
}) => {
  return (
    <div className="flex items-center space-x-2 py-1">
      {type === "success" ? 
        <CheckCircle className="text-indigo-600 flex-shrink-0" size={16} /> : 
        <AlertCircle className="text-indigo-600 flex-shrink-0" size={16} />
      }
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

const LaundryAuthForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  React.useEffect(() => {
    const savedPhone = localStorage.getItem("laundry_phone");
    const savedPassword = localStorage.getItem("laundry_password");
    const savedRememberMe = localStorage.getItem("laundry_remember") === "true";
    
    if (savedPhone && savedPassword && savedRememberMe) {
      form.setValue("phone", savedPhone);
      form.setValue("password", savedPassword);
      setRememberMe(true);
    }
  }, []);

  const form = useForm<TLoginLaundryRequest>({
    resolver: zodResolver(LoginLaundrySchema),
    defaultValues: {
      phone: "",
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

  const onSubmit = async (data: TLoginLaundryRequest) => {
    try {
      if (rememberMe) {
        localStorage.setItem("laundry_phone", data.phone);
        localStorage.setItem("laundry_password", data.password);
        localStorage.setItem("laundry_remember", "true");
      } else {
        localStorage.removeItem("laundry_phone");
        localStorage.removeItem("laundry_password");
        localStorage.removeItem("laundry_remember");
      }

      const response = await checkLoginManagerLaudry(data).catch(() => null);
      if (!response) throw new Error("API đăng nhập thất bại.");

      if (response && response.status === 200) {
        const userData = response.payload;
        await authClient.auth(userData);
        const positionUserData = {
          ...userData,
          position: "ManageLaundry",
        }
        dispatch(setUser(positionUserData));

        let redirectUrl = "/homeplus";
        let message = "Chuyển đến trang chính";

        if (userData.role?.toLowerCase() === "admin") {
          redirectUrl = "/admin/laundry";
          message = "Đang chuyển đến trang quản lí giặt ủi";
        } else if (userData.role?.toLowerCase() === "manager") {
          redirectUrl = "/laundry/orders";
          message = "Đang chuyển đến trang quản lý dịch vụ giặt ủi";
        } 
        
        toast({
          title: "Đăng nhập thành công",
          description: <CompactLaundryToast message={message} type="success" />,
          duration: 2500,
        });

        router.push(redirectUrl);
      }
    } catch (error) {
      console.error("Login laundry error: ", error);
      toast({
        title: "Đăng nhập thất bại",
        description: <CompactLaundryToast 
          message="Vui lòng kiểm tra lại thông tin đăng nhập" 
          type="error" 
        />,
        duration: 2500,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Phone Number */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số điện thoại</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập số điện thoại..."
                  {...field}
                  disabled={isSubmitting}
                  className="focus-visible:ring-indigo-500"
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
                    className="pr-10 focus-visible:ring-indigo-500"
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
              id="remember-me"
              checked={rememberMe}
              onCheckedChange={handleRememberMeChange}
              className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
            />
            <label
              htmlFor="remember-me"
              className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
             Ghi nhớ mật khẩu
            </label>
          </div>
          <a
            href="#"
            className="text-indigo-600 hover:text-indigo-500 hover:underline transition-colors"
          >
            Quên mật khẩu?
          </a>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập dịch vụ giặt ủi"}
        </Button>
      </form>
    </Form>
  );
};

export default LaundryAuthForm;