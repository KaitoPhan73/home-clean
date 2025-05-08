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
import { updateStaff } from "@/apis/staff";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  StaffUpdateSchema,
  TStaffResponse,
  TStaffUpdateRequest,
} from "@/schema/staff.schema";
import { handleErrorApi } from "@/lib/utils";

type Props = {
  initialData: TStaffResponse;
};
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  } catch (error: any) {
    console.log("Error formatting date:", error);
    return dateString;
  }
};
export function FormUpdateStaff({ initialData }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const defaultValues: TStaffUpdateRequest = {
    fullName: initialData.fullName,
    phoneNumber: initialData.phoneNumber,
    email: initialData.email,
    gender: initialData.gender as "Male" | "Female" | "Other",
    dateOfBirth: formatDate(initialData.dateOfBirth), // Format date here
    address: initialData.address,
    status: initialData.status as "Active" | "Inactive",
    groupId: initialData.groupId,
    password: "", // optional field
  };
  const form = useForm<TStaffUpdateRequest>({
    resolver: zodResolver(StaffUpdateSchema),
    defaultValues,
  });

  const onSubmit = async (data: TStaffUpdateRequest) => {
    try {
      const response = await updateStaff(initialData.id, data);
      if (response.status === 200) {
        toast({
          title: "Cập nhật thành công",
          description: "Đã cập nhật thông tin nhân viên thành công.",
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
            name="gender"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="gender">Giới Tính</Label>
                <Select
                  disabled={isSubmitting}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Male">Nam</SelectItem>
                    <SelectItem value="Female">Nữ</SelectItem>
                    <SelectItem value="Other">Khác</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="dateOfBirth">Ngày Sinh</Label>
                <FormControl>
                  <Input type="date" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="address">Địa Chỉ</Label>
                <FormControl>
                  <Input
                    placeholder="Nhập địa chỉ..."
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

        <div className="flex justify-end gap-4 mt-4">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => router.back()}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
