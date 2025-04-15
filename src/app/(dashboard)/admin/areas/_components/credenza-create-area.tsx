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
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateAreaSchema, TCreateAreaRequest } from "@/schema/area.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { createArea } from "@/apis/area";
import { useRouter } from "next/navigation";
import { handleErrorApi } from "@/lib/utils";

type Props = {
  className?: string;
};

export function CredenzaCreateArea({ className }: Props) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const form = useForm<TCreateAreaRequest>({
    resolver: zodResolver(CreateAreaSchema),
    defaultValues: {
      name: "",
      hubId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      code: "",
      description: "",
      address: "",
      contactInfo: "",
      areaType: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: TCreateAreaRequest) => {
    try {
      const response = await createArea(data);
      if (response.status === 201) {
        toast({
          title: "Tạo khu vực thành công",
          description: "Đã tạo thành công.",
        });
        form.reset();
        setIsOpen(false); // Đóng Credenza
        router.refresh(); // Refresh lại trang
      }
    } catch (error: any) {
      handleErrorApi({
        error,
      });
    }
  };

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaTrigger asChild className={className}>
        <Button variant="default" onClick={() => setIsOpen(true)}>
          Tạo Khu Vực
        </Button>
      </CredenzaTrigger>
      <CredenzaContent className="sm:max-w-[425px]">
        <CredenzaHeader>
          <CredenzaTitle>Tạo Khu Vực</CredenzaTitle>
          <CredenzaDescription>Nhập thông tin khu vực mới</CredenzaDescription>
        </CredenzaHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4 py-0 px-4 md:px-0 md:py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="name">Tên Khu Vực</Label>
                    <FormControl>
                      <Input
                        placeholder="Nhập tên khu vực..."
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
                    <Label htmlFor="code">Mã Khu Vực</Label>
                    <FormControl>
                      <Input
                        placeholder="Nhập mã khu vực..."
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
                name="contactInfo"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="contactInfo">Thông Tin Liên Hệ</Label>
                    <FormControl>
                      <Input
                        placeholder="Nhập thông tin liên hệ..."
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
                name="areaType"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="areaType">Loại Khu Vực</Label>
                    <FormControl>
                      <Input
                        placeholder="Nhập loại khu vực..."
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
                name="address"
                render={({ field }) => (
                  <FormItem className="col-span-2">
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
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <Label htmlFor="description">Mô Tả</Label>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập mô tả khu vực..."
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <CredenzaFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang cập nhập..." : "Cập nhập"}
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
