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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { TServiceResponse } from "@/schema/service.schema";
import { THouseTypeResponse } from "@/schema/house-type.schema";
import { ServiceInHouseTypeCreateSchema, TServiceInHouseTypeCreateRequest } from "@/schema/service-in-house-type.schema";
import { createServiceInHouseTypes } from "@/apis/service-in-house-types";

type Props = {
  className?: string;
  services: TServiceResponse[];
  houseTypes: THouseTypeResponse[];
  token?: string;
  data?: any;
};

export function CredenzaCreateServiceInHouseTypes({ className, services, houseTypes, token }: Props) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const form = useForm<TServiceInHouseTypeCreateRequest>({
    resolver: zodResolver(ServiceInHouseTypeCreateSchema),
    defaultValues: {
      name: "",
      code: "",
      price: 0,
      serviceId: "",
      houseTypeId: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: TServiceInHouseTypeCreateRequest) => {
    try {
      // Pass token to the API call
      const response = await createServiceInHouseTypes(data, token);
      
      if (response.status === 200) {
        toast({
          title: "Thành công",
          description: "Dịch vụ trong loại nhà đã được tạo thành công.",
          className: "bg-green-50 text-green-700 border-green-200",
        });
        form.reset();
        router.refresh();
        setIsOpen(false);
      } else {
        throw new Error("Tạo không thành công");
      }
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Có lỗi xảy ra khi tạo dịch vụ.",
        variant: "destructive",
        className: "bg-red-50 text-red-700 border-red-200",
      });
    }
  };

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaTrigger asChild className={className}>
        <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white">
          Tạo Dịch Vụ Mới
        </Button>
      </CredenzaTrigger>
      <CredenzaContent className="sm:max-w-[500px] bg-white rounded-xl shadow-lg">
        <CredenzaHeader className="border-b pb-4">
          <CredenzaTitle className="text-xl font-semibold text-gray-800">
            Tạo Dịch Vụ Trong Loại Nhà
          </CredenzaTitle>
          <CredenzaDescription className="text-gray-500">
            Điền thông tin để tạo một dịch vụ mới
          </CredenzaDescription>
        </CredenzaHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
            {/* Thông tin cơ bản */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Thông tin cơ bản</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Tên</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập tên dịch vụ..."
                          {...field}
                          disabled={isSubmitting}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Mã Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập mã code..."
                          {...field}
                          disabled={isSubmitting}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Thông tin giá và liên kết */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Thông tin giá và liên kết</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Giá (VND)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Nhập giá..."
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          disabled={isSubmitting}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="serviceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Dịch Vụ</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder="Chọn dịch vụ..." />
                          </SelectTrigger>
                          <SelectContent>
                            {services?.map((service) => (
                              <SelectItem key={service.id} value={service.id}>
                                {service.name} ({service.code})
                              </SelectItem>
                            )) || <SelectItem value="">Không có dịch vụ</SelectItem>}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="houseTypeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Loại Nhà</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder="Chọn loại nhà..." />
                          </SelectTrigger>
                          <SelectContent>
                            {houseTypes?.map((houseType) => (
                              <SelectItem key={houseType.id} value={houseType.id}>
                                {houseType.no || houseType.id} ({houseType.code})
                              </SelectItem>
                            )) || <SelectItem value="">Không có loại nhà</SelectItem>}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <CredenzaFooter className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? "Đang tạo..." : "Tạo Dịch Vụ"}
              </Button>
              <CredenzaClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Hủy
                </Button>
              </CredenzaClose>
            </CredenzaFooter>
          </form>
        </Form>
      </CredenzaContent>
    </Credenza>
  );
}