"use client";
import React from "react";
import {
  Credenza,
  CredenzaTrigger,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaClose,
} from "@/components/ui/credenza"; // Import from Credenza
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
  ServiceCategorySchema,
  TUpdateServiceCategoryRequest,
} from "@/schema/service-category.schema";
type Props = {
  className?: string;
  initialData: TUpdateServiceCategoryRequest; // Data passed to update form
};

export function CredenzaUpdateServiceCategory({
  className,
  initialData,
}: Props) {
  const { toast } = useToast();
  const form = useForm<TUpdateServiceCategoryRequest>({
    resolver: zodResolver(ServiceCategorySchema),
    defaultValues: initialData, // Setting mock data as the default form values
  });

  const onSubmit = async (data: TUpdateServiceCategoryRequest) => {
    console.log("Updated data: ", data); // Log the updated data
    toast({
      title: "Cập nhật dịch vụ thành công",
    });
    form.reset(); // Reset form after successful submit
  };

  return (
    <Credenza>
      <CredenzaTrigger asChild className={className}>
        <Button variant="default">Cập Nhật Dịch Vụ</Button>
      </CredenzaTrigger>
      <CredenzaContent className="sm:max-w-[425px]">
        <CredenzaHeader>
          <CredenzaTitle>Cập Nhật Dịch Vụ</CredenzaTitle>
          <CredenzaDescription>Cập nhật thông tin dịch vụ</CredenzaDescription>
        </CredenzaHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Tên Dịch Vụ
                </Label>
                <div className="col-span-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Tên dịch vụ..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Trạng Thái
                </Label>
                <div className="col-span-3">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Trạng thái..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="code" className="text-right">
                    Mã Dịch Vụ
                  </Label>
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Mã dịch vụ..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
            <CredenzaFooter>
              <Button type="submit">Cập Nhật</Button>
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
