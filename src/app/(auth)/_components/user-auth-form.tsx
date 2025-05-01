/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { checkLoginManager, checkLoginManagerLaudry } from "@/apis/authencation";
import { useRouter } from "next/navigation";
import authClient from "@/apis/clients/auth";
import { setUser } from "@/redux/User/userSlice";
import { useDispatch } from "react-redux";
import { z } from "zod";

// Toast component
const CompactToast = ({ 
  message, 
  type = "success"
}: { 
  message: string; 
  type: "success" | "error";
}) => {
  return (
    <div className="flex items-center space-x-2 py-1">
      {type === "success" ? 
        <CheckCircle className="text-blue-600 flex-shrink-0" size={16} /> : 
        <AlertCircle className="text-blue-600 flex-shrink-0" size={16} />
      }
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

// Authentication Form Schema
const AuthSchema = z
  .object({
    phoneNumber: z.string().min(1, {
      message: "Số điện thoại không được trống.",
    }),
    password: z.string().min(1, {
      message: "Mật khẩu không được trống.",
    }),
  })
  .strict();

type TAuthRequest = z.infer<typeof AuthSchema>;

interface CombinedManagerAuthFormProps {
  setIsSubmitting: (isSubmitting: boolean) => void;
}

const CombinedManagerAuthForm = ({ setIsSubmitting }: CombinedManagerAuthFormProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const form = useForm<TAuthRequest>({
    resolver: zodResolver(AuthSchema),
    defaultValues: {
      phoneNumber: "",
      password: "",
    },
  });

  useEffect(() => {
    const savedPhone = localStorage.getItem("user_phone");
    const savedPassword = localStorage.getItem("user_password");
    const savedRememberMe = localStorage.getItem("user_remember") === "true";
    
    if (savedPhone && savedPassword && savedRememberMe) {
      form.setValue("phoneNumber", savedPhone);
      form.setValue("password", savedPassword);
      setRememberMe(true);
    }
  }, [form]);

  const togglePasswordVisibility = () => {
    if (!form.formState.isSubmitting) {
      setShowPassword(!showPassword);
    }
  };

  const handleRememberMeChange = (checked: boolean) => {
    if (!form.formState.isSubmitting) {
      setRememberMe(checked);
    }
  };

  const onSubmit = async (data: TAuthRequest) => {
    setIsSubmitting(true);
    try {
      if (rememberMe) {
        localStorage.setItem("user_phone", data.phoneNumber);
        localStorage.setItem("user_password", data.password);
        localStorage.setItem("user_remember", "true");
      } else {
        localStorage.removeItem("user_phone");
        localStorage.removeItem("user_password");
        localStorage.removeItem("user_remember");
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

      // Try cleaning API first
      try {
        const cleaningResponse = await checkLoginManager({
          phoneNumber: data.phoneNumber,
          password: data.password
        }, { signal: controller.signal });

        clearTimeout(timeoutId);

        if (cleaningResponse?.status === 200) {
          const userData = cleaningResponse.payload;
          await authClient.auth(userData);
          dispatch(setUser(userData));

          let redirectUrl = "/homeplus";
          let message = "Đang chuyển đến trang chính";

          if (userData.role?.toLowerCase() === "admin") {
            redirectUrl = "/admin/buildings";
            message = "Đang chuyển đến trang quản lí";
          } else if (userData.role?.toLowerCase() === "manager") {
            redirectUrl = "/manager/groups";
            message = "Đang chuyển đến trang quản lý dịch vụ";
          } else if (userData.role?.toLowerCase() === "staff") {
            redirectUrl = "/homeplus";
            message = "Đang chuyển đến trang HomePlus";
          }

          toast({
            title: "Đăng nhập thành công",
            description: <CompactToast message={message} type="success" />,
            duration: 2500,
          });

          router.push(redirectUrl);
          return;
        }
      } catch (error) {
        console.log("Cleaning login failed, trying laundry...");
      }

      try {
        const laundryResponse = await checkLoginManagerLaudry({
          phoneNumber: data.phoneNumber,
          password: data.password
        }, { signal: controller.signal });

        clearTimeout(timeoutId);

        if (laundryResponse?.status === 200) {
          const userData = laundryResponse.payload;
          await authClient.auth(userData);
          
          const positionUserData = {
            ...userData,
            position: "ManageLaundry",
          };
          dispatch(setUser(positionUserData));

          let redirectUrl = "/laundry/orders";
          let message = "Đang chuyển đến trang quản lý dịch vụ giặt sấy";

          if (userData.role?.toLowerCase() === "admin") {
            redirectUrl = "/admin/laundry";
            message = "Đang chuyển đến trang quản lí giặt sấy";
          }

          toast({
            title: "Đăng nhập thành công",
            description: <CompactToast message={message} type="success" />,
            duration: 2500,
          });

          router.push(redirectUrl);
          return;
        }
      } catch (error) {
        console.log("Laundry login failed");
      }

      clearTimeout(timeoutId);
      throw new Error("Đăng nhập thất bại");
      
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Đăng nhập thất bại",
        description: <CompactToast message="Vui lòng kiểm tra lại thông tin đăng nhập" type="error" />,
        duration: 2500,
      });
    } finally {
      setIsSubmitting(false);
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
                  disabled={form.formState.isSubmitting}
                  className="focus-visible:ring-blue-500"
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
                    disabled={form.formState.isSubmitting}
                    className="pr-10 focus-visible:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-500"
                    disabled={form.formState.isSubmitting}
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
              disabled={form.formState.isSubmitting}
              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
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
            className={`text-blue-600 hover:text-blue-500 hover:underline transition-colors ${form.formState.isSubmitting ? "pointer-events-none opacity-50" : ""}`}
          >
            Quên mật khẩu?
          </a>
        </div>

        {/* Submit Button with Spinner */}
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Đăng nhập"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CombinedManagerAuthForm;