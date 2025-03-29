/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
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
import {
  ServiceSubActivityCreateSchema,
  TServiceSubActivityCreateRequest,
} from "@/schema/service-sub-activity.schema";
import { createServiceSubActivity } from "@/apis/service-sub-activity";
import { getServiceActivityById } from "@/apis/service-activity";
import { useRouter } from "next/navigation";

type Props = {
  className?: string;
};

export function CredenzaCreateServiceSubActivity({ className }: Props) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [selectedServiceActivityName, setSelectedServiceActivityName] = useState("");
  const [selectedServiceActivityId, setSelectedServiceActivityId] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const parts = window.location.pathname.split("/");
      const serviceActivityId = parts[parts.length - 1]; // Lấy giá trị cuối từ URL
      setSelectedServiceActivityId(serviceActivityId);
    }
  }, []);

  const form = useForm<TServiceSubActivityCreateRequest>({
    resolver: zodResolver(ServiceSubActivityCreateSchema),
    defaultValues: {
      name: "",
      code: "",
      serviceActivityId: "",
    },
  });

  useEffect(() => {
    if (selectedServiceActivityId) {
      form.setValue("serviceActivityId", selectedServiceActivityId);
    }
  }, [selectedServiceActivityId]);

  useEffect(() => {
    const fetchServiceActivity = async () => {
      if (!selectedServiceActivityId) return;

      try {
        const response = await getServiceActivityById(selectedServiceActivityId);
        if (response?.payload) {
          setSelectedServiceActivityName(response.payload.name);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin công việc chính:", error);
      }
    };

    fetchServiceActivity();
  }, [selectedServiceActivityId]);

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: TServiceSubActivityCreateRequest) => {

    try {
      const response = await createServiceSubActivity(data);
      if (response.status === 201) {
        toast({
          title: "Tạo thành công",
          description: "Dịch vụ đã được tạo thành công.",
        });
        form.reset();
        setIsOpen(false);
        router.refresh();
      } else {
        toast({
          title: "Lỗi",
          description: "Không thể tạo dịch vụ",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Có lỗi xảy ra: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaTrigger asChild className={className}>
        <Button variant="default">Tạo Dịch Vụ</Button>
      </CredenzaTrigger>
      <CredenzaContent className="sm:max-w-[500px]">
        <CredenzaHeader>
          <CredenzaTitle>Tạo Dịch Vụ</CredenzaTitle>
          <CredenzaDescription>Thêm dịch vụ mới</CredenzaDescription>
        </CredenzaHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4 py-0 px-4 md:px-0 md:py-4">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="name">Tên Dịch Vụ</Label>
                    <FormControl>
                      <Input
                        placeholder="Nhập tên..."
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Code */}
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="code">Mã</Label>
                    <FormControl>
                      <Input
                        placeholder="Nhập mã..."
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Service Activity ID */}
              <FormField
                control={form.control}
                name="serviceActivityId"
                render={() => (
                  <FormItem>
                    <Label>Công Việc Chính</Label>
                    <FormControl>
                      <Input value={selectedServiceActivityName} disabled />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <CredenzaFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang tạo..." : "Tạo"}
              </Button>
              <CredenzaClose asChild>
                <Button type="button" variant="secondary">
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
