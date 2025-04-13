/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useState } from "react";
import {
  Credenza,
  CredenzaTrigger,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
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
  TimesSlotCreateSchema,
  TTimesSlotResponse,
  TTimesSlotUpdateRequest,
} from "@/schema/time-slot.schema";
import { updateTimeSlot } from "@/apis/time-slot";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { statusOptions } from "@/constants/config";
import { TimePicker } from "@/components/ui/time-picker";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  className?: string;
  data: TTimesSlotResponse;
};

export function UpdateTimeSlotCredenza({ className, data }: Props) {
  const { toast } = useToast();
  const { refresh } = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<TTimesSlotUpdateRequest>({
    resolver: zodResolver(TimesSlotCreateSchema),
    defaultValues: data,
  });

  const { isSubmitting } = form.formState;
  const onSubmit = async (formData: TTimesSlotUpdateRequest) => {
    try {
      const response = await updateTimeSlot(data.id, formData); // <- gọi hàm update
      if (response.status === 200) {
        toast({
          title: "Cập nhật thành công",
          description: "Thông tin ca làm việc đã được cập nhật.",
        });
        refresh();
        setIsOpen(false);
      } else {
        toast({
          title: "Lỗi",
          description: "Không thể cập nhật ca.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Đã xảy ra lỗi: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  console.log("data", data);
  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaTrigger asChild className={className}>
        <Button variant="ghost" className="flex h-full gap-2 items-start">
          <Edit className="h-4 w-4" />
          <span>Chỉnh sửa</span>
        </Button>
      </CredenzaTrigger>
      <CredenzaContent className="sm:max-w-[525px]">
        <CredenzaHeader>
          <CredenzaTitle>Tạo Ca</CredenzaTitle>
        </CredenzaHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 px-4 py-4"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <Label>Mã Ca</Label>
                  <FormControl>
                    <Input placeholder="VD: CA_SANG_01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <Label>Mô Tả</Label>
                  <FormControl>
                    <Input placeholder="Nhập mô tả ca..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <Label>Trạng Thái</Label>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tình trạng" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option, index) => (
                          <SelectItem key={index} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Giờ bắt đầu</Label>
                      <FormControl>
                        <TimePicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Giờ kết thúc</Label>
                      <FormControl>
                        <TimePicker
                          value={field.value}
                          onChange={field.onChange}
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
