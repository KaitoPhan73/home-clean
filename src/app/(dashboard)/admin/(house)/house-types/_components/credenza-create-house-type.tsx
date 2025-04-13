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
import {
  HouseTypeCreateSchema,
  TCreateHouseTypeRequest,
} from "@/schema/house-type.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { createHouseType } from "@/apis/house-type";
import { useRouter } from "next/navigation";
import { handleErrorApi } from "@/lib/utils";

type Props = {
  className?: string;
};

export function CredenzaCreateHouseType({ className }: Props) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const form = useForm<TCreateHouseTypeRequest>({
    resolver: zodResolver(HouseTypeCreateSchema),
    defaultValues: {
      no: "",
      code: "",
      description: "",
      number: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: TCreateHouseTypeRequest) => {
    try {
      const response = await createHouseType(data);
      if (response.status === 201) {
        toast({
          title: "Tạo thành công",
          description: "Đã được tạo thành công.",
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

  const fields = [
    { name: "no", label: "Số thứ tự" },
    { name: "number", label: "Số loại nhà" },
    { name: "code", label: "Mã loại nhà" },
    { name: "description", label: "Mô tả" },
  ];

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaTrigger asChild className={className}>
        <Button variant="default" onClick={() => setIsOpen(true)}>
          Tạo Loại Căn Hộ
        </Button>
      </CredenzaTrigger>
      <CredenzaContent className="sm:max-w-[425px]">
        <CredenzaHeader>
          <CredenzaTitle>Tạo Loại Căn Hộ</CredenzaTitle>
          <CredenzaDescription>Vui lòng nhập thông tin</CredenzaDescription>
        </CredenzaHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4 py-0 px-4 md:px-0 md:py-4">
              {fields.map(({ name, label }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name as keyof TCreateHouseTypeRequest}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <Label htmlFor={name}>{label}</Label>
                      <FormControl>
                        <Input
                          placeholder={`Nhập ${label}...`}
                          {...field}
                          value={
                            typeof field.value === "boolean"
                              ? String(field.value)
                              : field.value
                          }
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <CredenzaFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang Tạo..." : "Tạo"}
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
