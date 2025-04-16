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
import { useRouter } from "next/navigation";
import { handleErrorApi } from "@/lib/utils";
import { AdditionalServiceCreateSchema, TAdditionalServiceCreateRequest } from "@/schema/VinLaudry/additional-service.schema";
import { Textarea } from "@/components/ui/textarea";
import { getCookie } from "cookies-next";
import { createAdditionalServiceAction } from "@/apis/laudry/addtitional-service";

type Props = {
  className?: string;
};

export function CredenzaCreateAdditionalService({ className }: Props) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const form = useForm<TAdditionalServiceCreateRequest>({
    resolver: zodResolver(AdditionalServiceCreateSchema),
    defaultValues: {
      serviceCode: "",
      name: "",
      description: "Mô tả dịch vụ mới",
      price: 1000,
      processingTimeAdjustment: 0,
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: TAdditionalServiceCreateRequest) => {
    try {
      const accessToken = getCookie("accessToken");
      if (!accessToken) {
        throw new Error("Không tìm thấy accessToken");
      }

      const response = await createAdditionalServiceAction(data);
      if (response.status === 201) {
        toast({
          title: "Tạo dịch vụ bổ sung thành công",
          description: "Dịch vụ bổ sung đã được tạo thành công.",
        });
        form.reset();
        router.refresh();
        setIsOpen(false);
      }
    } catch (error) {
      handleErrorApi({
        error: error as Error,
      });
    }
  };

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaTrigger asChild className={className}>
        <Button variant="default">Tạo Dịch Vụ Bổ Sung</Button>
      </CredenzaTrigger>
      <CredenzaContent className="sm:max-w-[500px]">
        <CredenzaHeader>
          <CredenzaTitle>Tạo Dịch Vụ Bổ Sung</CredenzaTitle>
          <CredenzaDescription>Thêm một dịch vụ bổ sung mới vào hệ thống</CredenzaDescription>
        </CredenzaHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4 py-0 px-4 md:px-0 md:py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="name">Tên Dịch Vụ</Label>
                    <FormControl>
                      <Input
                        placeholder="Nhập tên dịch vụ..."
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
                name="serviceCode"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="serviceCode">Mã Dịch Vụ</Label>
                    <FormControl>
                      <Input
                        placeholder="Nhập mã dịch vụ..."
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
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="price">Điểm</Label>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Nhập số điểm..."
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="processingTimeAdjustment"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="processingTimeAdjustment">Thời Gian Xử Lý (phút)</Label>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Nhập thời gian xử lý thêm..."
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="description">Mô Tả</Label>
                      <FormControl>
                        <Textarea
                          placeholder="Nhập mô tả dịch vụ..."
                          className="resize-none"
                          rows={3}
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <CredenzaFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang tạo..." : "Tạo Dịch Vụ"}
              </Button>
              <CredenzaClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsOpen(false)}
                >
                  Đóng
                </Button>
              </CredenzaClose>
            </CredenzaFooter>
          </form>
        </Form>
      </CredenzaContent>
    </Credenza>
  );
}