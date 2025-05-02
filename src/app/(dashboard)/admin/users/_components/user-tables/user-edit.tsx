/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TUpdateUserRequest, TUserResponse } from "@/schema/user.schema";
import { THouseResponse } from "@/schema/house.schema";
import { UserUpdateSchema } from "@/schema/user.schema";
import { getAllHouses } from "@/apis/house";
import { updateUser } from "@/apis/vinwallet/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { X, User, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import { handleErrorApi } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface UserEditPopupProps {
  user: TUserResponse;
  onClose: () => void;
}

export const UserEditPopup: React.FC<UserEditPopupProps> = ({
  user,
  onClose,
}) => {
  const [houses, setHouses] = useState<THouseResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<TUpdateUserRequest>({
    resolver: zodResolver(UserUpdateSchema),
    defaultValues: {
      fullName: user.fullName || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      houseId: user.houseId || "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const houseRes = await getAllHouses();
        setHouses(houseRes.payload.items || []);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        toast.error("Không thể tải danh sách nhà.");
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (values: TUpdateUserRequest) => {
    try {
      setLoading(true);
      await updateUser(user.id, values);
      toast.success("Cập nhật người dùng thành công!");
      router.refresh();
      onClose();
    } catch (error: any) {
      handleErrorApi({ error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-blue-50 p-4 flex items-center justify-between border-b">
          <div className="flex items-center gap-3">
            <User className="text-blue-500" size={24} />
            <h2 className="text-xl font-bold text-gray-800">
              Chỉnh Sửa Người Dùng
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Content with Scroll */}
        <div className="p-6 overflow-y-auto flex-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase">
                  Thông Tin Cá Nhân
                </h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User className="text-blue-500" size={16} />
                          Họ và Tên
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập họ và tên"
                            {...field}
                            className="rounded-md"
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
                        <FormLabel className="flex items-center gap-2">
                          <Mail className="text-red-500" size={16} />
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập email"
                            {...field}
                            className="rounded-md"
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
                        <FormLabel className="flex items-center gap-2">
                          <Phone className="text-green-500" size={16} />
                          Số Điện Thoại
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập số điện thoại"
                            {...field}
                            className="rounded-md"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Address Information Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase">
                  Thông Tin Địa Chỉ
                </h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="houseId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="text-orange-500" size={16} />
                          Mã Nhà
                        </FormLabel>
                        <FormControl>
                          {houses.length === 0 ? (
                            <Skeleton className="w-full h-[40px] rounded-md" />
                          ) : (
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="rounded-md">
                                <SelectValue placeholder="Chọn mã nhà" />
                              </SelectTrigger>
                              <SelectContent>
                                {houses.map((house) => (
                                  <SelectItem key={house.id} value={house.id}>
                                    {house.numberOfRoom} ({house.code})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                  className="rounded-md"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  {loading ? "Đang lưu..." : "Lưu"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};
