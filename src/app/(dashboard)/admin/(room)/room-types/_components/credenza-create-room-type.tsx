/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import {
  Credenza,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaClose,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RoomTypeCreateSchema,
  TCreateRoomTypeRequest,
} from "@/schema/room-type.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { createRoomType } from "@/apis/room-type";
import { useRouter } from "next/navigation";
import { handleErrorApi } from "@/lib/utils";

export function CredenzaCreateRoomType() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const form = useForm<TCreateRoomTypeRequest>({
    resolver: zodResolver(RoomTypeCreateSchema),
    defaultValues: {
      name: "",
      description: "",
      code: "",
    },
  });

  const onSubmit = async (data: TCreateRoomTypeRequest) => {
    try {
      const response = await createRoomType(data);
      if (response.status === 201) {
        toast({
          title: "Tạo loại phòng thành công",
          description: "Loại phòng đã được tạo thành công.",
        });
        form.reset();
        setIsOpen(false);
        router.refresh();
      }
    } catch (error: any) {
      handleErrorApi({
        error,
      });
    }
  };

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaTrigger asChild>
        <Button variant="default" onClick={() => setIsOpen(true)}>
          Tạo Loại Phòng
        </Button>
      </CredenzaTrigger>
      <CredenzaContent className="max-w-4xl">
        <CredenzaHeader>
          <CredenzaTitle>Tạo Loại Phòng</CredenzaTitle>
          <CredenzaDescription>Nhập thông tin loại phòng</CredenzaDescription>
        </CredenzaHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-6 gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <label className="text-sm font-medium">
                      Tên loại phòng
                    </label>
                    <FormControl>
                      <Input placeholder="Nhập tên loại phòng..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <label className="text-sm font-medium">Mô tả</label>
                    <FormControl>
                      <Input
                        placeholder="Nhập mô tả loại phòng..."
                        {...field}
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
                  <FormItem className="col-span-3">
                    <label className="text-sm font-medium">Mã Loại Phòng</label>
                    <FormControl>
                      <Input placeholder="Nhập mã loại phòng..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <CredenzaFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Đang tạo..." : "Tạo Loại Phòng"}
              </Button>
              <CredenzaClose asChild>
                <Button type="button" variant="outline">
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
