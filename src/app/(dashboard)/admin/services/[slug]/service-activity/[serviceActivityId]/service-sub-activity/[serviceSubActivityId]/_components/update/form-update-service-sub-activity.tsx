/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
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
import { SubServiceActivitySchema, TServiceSubActivityUpdateRequest } from "@/schema/service-sub-activity.schema";
import { updateSubServiceActivity } from "@/apis/service-sub-activity";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getServiceActivityById } from "@/apis/service-activity";

type Props = {
  initialData: TServiceSubActivityUpdateRequest;
  onClose: () => void;
};

export function FormUpdateServiceSubActivity({ initialData, onClose }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<TServiceSubActivityUpdateRequest>({
    resolver: zodResolver(SubServiceActivitySchema),
    defaultValues: initialData,
  });

  const [serviceActivityName, setServiceActivityName] = useState("Đang tải...");
  const [serviceActivities, setServiceActivities] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchServiceActivity = async () => {
      try {
        const response = await getServiceActivityById(initialData.serviceActivityId);
        if (response?.payload) {
          setServiceActivityName(response.payload.name || "Không tìm thấy Công việc chính");
          setServiceActivities([response.payload]); // Lưu lại danh sách nếu cần
        }
      } catch (error) {
        console.error("Lỗi khi lấy Công việc chính:", error);
        setServiceActivityName("Lỗi tải Công việc chính");
      }
    };

    if (initialData.serviceActivityId) {
      fetchServiceActivity();
    }
  }, [initialData.serviceActivityId]);

  const onSubmit = async (data: TServiceSubActivityUpdateRequest) => {
    try {
      const response = await updateSubServiceActivity(initialData.id, data);
      if (response.status === 200) {
        toast({ title: "Cập nhật thành công", description: "Đã cập nhật thành công." });
        onClose();        
      } else {
        toast({ title: "Lỗi", description: "Không thể cập nhật", variant: "destructive" });
      }
      router.refresh();
    } catch (error: any) {
      toast({ title: "Lỗi", description: `Có lỗi xảy ra khi cập nhật ${error.message}`, variant: "destructive" });
    }
  };
  
  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4 py-0 px-4 md:px-0 md:py-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="name">Tên</Label>
                <FormControl>
                  <Input placeholder="Nhập tên..." {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Mã Code */}
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="code">Mã Code</Label>
                <FormControl>
                  <Input placeholder="Nhập mã code..." {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Trạng thái */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="status">Trạng Thái</Label>
                <FormControl>
                  <Input placeholder="Nhập trạng thái..." {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Ngày tạo */}
          <FormField
            control={form.control}
            name="createdAt"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="createdAt">Ngày Tạo</Label>
                <FormControl>
                  <Input type="datetime-local" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Ngày cập nhật */}
          <FormField
            control={form.control}
            name="updatedAt"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="updatedAt">Ngày Cập Nhật</Label>
                <FormControl>
                  <Input type="datetime-local" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Công việc chính (Select thay vì Input) */}
          <FormField
            control={form.control}
            name="serviceActivityId"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="serviceActivityId">Công việc chính</Label>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder={serviceActivityName} />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceActivities.map((activity) => (
                        <SelectItem key={activity.id} value={activity.id}>
                          {activity.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
        </Button>
      </form>
    </Form>
  );
}
