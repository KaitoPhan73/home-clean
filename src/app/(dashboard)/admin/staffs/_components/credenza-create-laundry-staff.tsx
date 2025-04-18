/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import {
  Credenza,
  CredenzaTrigger,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaClose,
} from "@/components/ui/credenza";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createEmployee } from "@/apis/laudry/employee";
import { CreateEmployeeSchema } from "@/schema/VinLaudry/employee.schema";
import { z } from "zod";
import { User, Phone, Mail, Shield, MapPin, Lock } from "lucide-react";

type TCreateEmployeeRequest = z.infer<typeof CreateEmployeeSchema>;

type Props = {
  className?: string;
  accessToken?: string;
  onClose?: () => void;
  isOpen?: boolean;
};

export function CredenzaCreateLaudryStaff({
  className,
  accessToken,
  onClose,
  isOpen = true,
}: Props) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<TCreateEmployeeRequest>({
    resolver: zodResolver(CreateEmployeeSchema),
    defaultValues: {
      fullName: "",
      phone: "09",
      email: "@gmail.com",
      role: "Staff",
      address: "",
      password: "Password123!",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: TCreateEmployeeRequest) => {
    try {
      const response = await createEmployee({
        ...data,
        _token: accessToken,
      });

      if (response.status === 201) {
        toast({
          title: "Tạo nhân viên giặt sấy thành công",
          description: "Nhân viên giặt sấy đã được thêm vào hệ thống.",
          variant: "success",
        });
        form.reset();
        router.refresh();
        handleClose();
      } else {
        toast({
          title: "Lỗi",
          description: "Không thể tạo nhân viên giặt sấy",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Có lỗi xảy ra khi tạo nhân viên giặt sấy: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <Credenza open={isOpen} onOpenChange={() => handleClose()}>
      <CredenzaContent className="sm:max-w-[600px]">
        <CredenzaHeader>
          <CredenzaTitle className="text-2xl font-bold text-center">
            Tạo Nhân Viên Giặt Sấy
          </CredenzaTitle>
          <CredenzaDescription className="text-center text-gray-500">
            Điền thông tin để thêm nhân viên giặt sấy mới vào hệ thống
          </CredenzaDescription>
        </CredenzaHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 px-1 py-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-blue-500" />
                      Họ và tên
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nguyễn Văn A"
                        {...field}
                        disabled={isSubmitting}
                        className="focus-visible:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-blue-500" />
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@gmail.com"
                        {...field}
                        disabled={isSubmitting}
                        className="focus-visible:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-blue-500" />
                      Số điện thoại
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0912345678"
                        {...field}
                        disabled={isSubmitting}
                        className="focus-visible:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Lock className="h-4 w-4 mr-2 text-blue-500" />
                      Mật khẩu
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Nhập mật khẩu"
                        {...field}
                        disabled={isSubmitting}
                        className="focus-visible:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-blue-500" />
                      Vai trò
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger className="focus:ring-blue-500">
                          <SelectValue placeholder="Chọn vai trò" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Staff">Nhân viên</SelectItem>
                        <SelectItem value="Manager">Quản lý</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                      Địa chỉ
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                        {...field}
                        disabled={isSubmitting}
                        className="focus-visible:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <CredenzaFooter className="gap-3 pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 transition-colors w-full md:w-auto"
              >
                {isSubmitting ? "Đang xử lý..." : "Tạo nhân viên"}
              </Button>
              <CredenzaClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="w-full md:w-auto"
                >
                  Hủy bỏ
                </Button>
              </CredenzaClose>
            </CredenzaFooter>
          </form>
        </Form>
      </CredenzaContent>
    </Credenza>
  );
}
