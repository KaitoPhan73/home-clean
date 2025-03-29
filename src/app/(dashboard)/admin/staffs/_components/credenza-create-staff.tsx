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
import { ServiceCategoryCreateSchema, TServiceCategoryCreateRequest } from "@/schema/service-category.schema";
import { createServiceCategory } from "@/apis/service-category";
import { useRouter } from "next/navigation";

type Props = {
  className?: string;
};

export function CredenzaCreateServiceCategory({ className }: Props) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const route = useRouter();
  const form = useForm<TServiceCategoryCreateRequest>({
    resolver: zodResolver(ServiceCategoryCreateSchema),
    defaultValues: {
      name: "",
      code: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: TServiceCategoryCreateRequest) => {
    try {
      const response = await createServiceCategory(data);
      if (response.status === 201) {
        toast({
          title: "Tạo loại dịch vụ thành công",
          description: "Loại dịch vụ đã được tạo thành công.",
        });
        form.reset();
        route.refresh();
        setIsOpen(false); // Đóng Credenza
      } else {
        toast({
          title: "Lỗi",
          description: "Không thể tạo loại dịch vụ",
          variant: "destructive",
        });
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Có lỗi xảy ra khi tạo khu vực ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaTrigger asChild className={className}>
        <Button variant="default">Tạo Loại Dịch Vụ</Button>
      </CredenzaTrigger>
      <CredenzaContent className="sm:max-w-[425px]">
        <CredenzaHeader>
          <CredenzaTitle>Tạo Loại Dịch Vụ</CredenzaTitle>
          <CredenzaDescription>Tạo một loại dịch vụ mới</CredenzaDescription>
        </CredenzaHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4 py-0 px-4 md:px-0 md:py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="name">Tên Loại Dịch Vụ</Label>
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
                    <Label htmlFor="code">Mã Dịch Vụ</Label>
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
              
            </div>
            <CredenzaFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang cập nhập..." : "Cập nhập Khu Vực"}
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
