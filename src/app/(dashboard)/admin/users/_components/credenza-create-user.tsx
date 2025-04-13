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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { UserCreateSchema, TCreateUserRequest } from "@/schema/user.schema";
import { useRouter } from "next/navigation";

import { ResponsiveComboBoxBuildingAsync } from "@/components/features/responsive-combobox-building-async";
import { ResponsiveComboBoxHouseAsync } from "@/components/features/responsive-combobox-house-async";
import { createUser } from "@/apis/vinwallet/user";

type Props = {
  className?: string;
};

export function CredenzaCreateUser({ className }: Props) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const form = useForm<TCreateUserRequest>({
    resolver: zodResolver(UserCreateSchema),
    defaultValues: {
      fullName: "",
      username: "",
      password: "",
      buildingCode: "",
      houseCode: "",
      email: "",
      phoneNumber: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: TCreateUserRequest) => {
    try {
      const response = await createUser(data);
      if (response.status === 201) {
        toast({
          title: "Tạo người dùng thành công",
          description: "Người dùng đã được tạo.",
        });
        form.reset();
        router.refresh();
        setIsOpen(false);
      } else {
        toast({
          title: "Lỗi",
          description: "Không thể tạo người dùng",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      const errorMessage = JSON.parse(error.message);
      toast({
        title: "Lỗi",
        description: `Có lỗi xảy ra: ${errorMessage.description}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaTrigger asChild className={className}>
        <Button variant="default">Tạo người dùng</Button>
      </CredenzaTrigger>
      <CredenzaContent className="sm:max-w-[600px]">
        <CredenzaHeader>
          <CredenzaTitle>Tạo Người Dùng</CredenzaTitle>
          <CredenzaDescription>
            Nhập thông tin người dùng mới
          </CredenzaDescription>
        </CredenzaHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4 px-4 md:px-0 py-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="fullName">Họ và tên</Label>
                    <FormControl>
                      <Input
                        placeholder="Nhập họ tên..."
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
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="username">Tên đăng nhập</Label>
                    <FormControl>
                      <Input
                        placeholder="Tên đăng nhập..."
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
                        placeholder="*******"
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
                name="buildingCode"
                render={({ field }) => (
                  <FormItem>
                    <Label>Mã Tòa Nhà</Label>
                    <FormControl>
                      <ResponsiveComboBoxBuildingAsync
                        value={field.value}
                        onChange={field.onChange}
                        className="w-full"
                        portal={false}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="houseCode"
                render={({ field }) => (
                  <FormItem>
                    <Label>Mã Nhà</Label>
                    <FormControl>
                      <ResponsiveComboBoxHouseAsync
                        value={field.value}
                        onChange={field.onChange}
                        className="w-full"
                        portal={false}
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
                    <Label>Số điện thoại</Label>
                    <FormControl>
                      <Input
                        placeholder="0123456789"
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
                    <Label>Email</Label>
                    <FormControl>
                      <Input
                        placeholder="example@email.com"
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
                {isSubmitting ? "Đang tạo..." : "Tạo người dùng"}
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
