/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { updateManager } from "@/apis/manager";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ManagerUpdateSchema,
  TManagerResponse,
  TUpdateManagerRequest,
} from "@/schema/manager.schema";
import { handleErrorApi } from "@/lib/utils";

type Props = {
  initialData: TManagerResponse;
};

export function FormUpdateManager({ initialData }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<TUpdateManagerRequest>({
    resolver: zodResolver(ManagerUpdateSchema),
    defaultValues: { ...initialData, password: "" },
  });

  const onSubmit = async (data: TUpdateManagerRequest) => {
    console.log("data", data);
    try {
      const response = await updateManager(initialData.id, data);
      if (response.status === 200) {
        toast({
          title: "Cập nhật thành công",
          description: "Đã cập nhật thông tin quản lý thành công.",
        });
        router.refresh();
      }
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };

  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-0 px-4 md:px-0 md:py-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="fullName">Họ và Tên</Label>
                <FormControl>
                  <Input
                    placeholder="Nhập họ và tên..."
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="code">Mã Quản Lý</Label>
                <FormControl>
                  <Input
                    placeholder="Nhập mã quản lý..."
                    {...field}
                    disabled={true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="phoneNumber">Số Điện Thoại</Label>
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

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="email">Email</Label>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Nhập email..."
                    {...field}
                    disabled={isSubmitting}
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
                <Label htmlFor="password">Mật khẩu</Label>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Nhập mật khẩu mới..."
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="status">Trạng Thái</Label>
                <Select
                  disabled={isSubmitting}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Active">Hoạt động</SelectItem>
                    <SelectItem value="Inactive">Không hoạt động</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end mt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
