"use client";
import React from "react";
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
import { ExtraServiceSchema, TExtraServiceUpdateRequest } from "@/schema/extra-service.schema";
import { updateExtraService } from "@/apis/extra-service";

type Props = {
  initialData: TExtraServiceUpdateRequest;
};

export function FormUpdateExtraService({ initialData }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<TExtraServiceUpdateRequest>({
    resolver: zodResolver(ExtraServiceSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: TExtraServiceUpdateRequest) => {
    try {
      const response = await updateExtraService(initialData.id, data);
      if (response.status === 200) {
        toast({
          title: "Cập nhập thành công",
          description: "Đã cập nhật thành công.",
        });
      } else {
        toast({
          title: "Lỗi",
          description: "Không thể cập nhật",
          variant: "destructive",
        });
      }
      router.refresh();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Có lỗi xảy ra khi cập nhật ${error.message}`,
        variant: "destructive",
      });
    }
  };
  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <div className="grid grid-cols-2 gap-4 py-0 px-4 md:px-0 md:py-4">
      {/* Tên */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <Label htmlFor="name">Tên</Label>
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

      <FormField
        control={form.control}
        name="code"
        render={({ field }) => (
          <FormItem>
            <Label htmlFor="code">Mã Code</Label>
            <FormControl>
              <Input
                placeholder="Nhập mã code..."
                {...field}
                disabled={isSubmitting}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Giá */}
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <Label htmlFor="price">Giá</Label>
            <FormControl>
              <Input
                type="number"
                placeholder="Nhập giá..."
                {...field}
                disabled={isSubmitting}
              />
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
              <Input
                placeholder="Nhập trạng thái..."
                {...field}
                disabled={isSubmitting}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Thời gian thêm */}
      <FormField
        control={form.control}
        name="extraTime"
        render={({ field }) => (
          <FormItem>
            <Label htmlFor="extraTime">Thời gian thêm</Label>
            <FormControl>
              <Input
                type="number"
                placeholder="Nhập thời gian thêm..."
                {...field}
                disabled={isSubmitting}
              />
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
    </div>

    <Button type="submit" disabled={isSubmitting}>
      {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
    </Button>
  </form>
</Form>
  );
}
