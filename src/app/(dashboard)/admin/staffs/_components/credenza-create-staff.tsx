/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
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
import { StaffCreateSchema, TStaffCreateRequest } from "@/schema/staff.schema";
import { createStaff } from "@/apis/staff";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TGroupResponse } from "@/schema/group.schema";
import { getAllGroups } from "@/apis/group";

type Props = {
  className?: string;
};

export function CredenzaCreateStaff({ className }: Props) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [groups, setGroups] = useState<TGroupResponse[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const router = useRouter();

  const form = useForm<TStaffCreateRequest>({
    resolver: zodResolver(StaffCreateSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      gender: "Male",
      dateOfBirth: "",
      address: "",
      hireDate: "",
      jobPosition: "",
      code: "",
      groupId: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  useEffect(() => {
    const fetchGroups = async () => {
      if (isOpen) {
        try {
          setIsLoadingGroups(true);
          const response = await getAllGroups();
          if (response.payload.items) {
            setGroups(response.payload.items);
          }
        } catch (error: any) {
          const errorMessage = JSON.parse(error.message);
          toast({
            title: "Lỗi",
            description: `Có lỗi xảy ra: ${errorMessage.description}`,
            variant: "destructive",
          });
        } finally {
          setIsLoadingGroups(false);
        }
      }
    };

    fetchGroups();
  }, [isOpen, toast]);

  const onSubmit = async (data: TStaffCreateRequest) => {
    try {
      const response = await createStaff(data);
      if (response.status === 200) {
        toast({
          title: "Tạo nhân viên thành công",
          description: "Nhân viên đã được tạo thành công.",
        });
        form.reset();
        router.refresh();
        setIsOpen(false);
      } else {
        toast({
          title: "Lỗi",
          description: "Không thể tạo nhân viên",
          variant: "destructive",
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Có lỗi xảy ra khi tạo nhân viên: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaTrigger asChild className={className}>
        <Button variant="default">Tạo Nhân Viên</Button>
      </CredenzaTrigger>
      <CredenzaContent className="sm:max-w-[600px]">
        <CredenzaHeader>
          <CredenzaTitle>Tạo Nhân Viên</CredenzaTitle>
          <CredenzaDescription>Tạo một nhân viên mới</CredenzaDescription>
        </CredenzaHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4 py-0 px-4 md:px-0 md:py-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="fullName">Họ Tên</Label>
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
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="code">Mã Nhân Viên</Label>
                    <FormControl>
                      <Input
                        placeholder="Nhập mã nhân viên..."
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
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="phoneNumber">Số Điện Thoại</Label>
                    <FormControl>
                      <Input
                        placeholder="Nhập số điện thoại..."
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
                    <Label htmlFor="email">Email</Label>
                    <FormControl>
                      <Input
                        placeholder="Nhập email..."
                        {...field}
                        disabled={isSubmitting}
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="gender">Giới Tính</Label>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Nam</SelectItem>
                        <SelectItem value="Female">Nữ</SelectItem>
                        <SelectItem value="Other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="dateOfBirth">Ngày Sinh</Label>
                    <FormControl>
                      <Input type="date" {...field} disabled={isSubmitting} />
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
                name="hireDate"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="hireDate">Ngày Tuyển Dụng</Label>
                    <FormControl>
                      <Input type="date" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jobPosition"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="jobPosition">Vị Trí Công Việc</Label>
                    <FormControl>
                      <Input
                        placeholder="Nhập vị trí công việc..."
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
                name="groupId"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="groupId">Nhóm</Label>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting || isLoadingGroups}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isLoadingGroups ? "Đang tải..." : "Chọn nhóm"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {groups.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="password">Mật Khẩu</Label>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Nhập mật khẩu..."
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
              <Button type="submit" disabled={isSubmitting || isLoadingGroups}>
                {isSubmitting ? "Đang tạo..." : "Tạo Nhân Viên"}
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
