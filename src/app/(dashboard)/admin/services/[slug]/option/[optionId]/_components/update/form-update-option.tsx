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
import { OptionSchema, TOptionUpdateRequest } from "@/schema/option.schema";
import { updateOption } from "@/apis/option";

type Props = {
  initialData: TOptionUpdateRequest;
};

export function FormUpdateOption({ initialData }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<TOptionUpdateRequest>({
    resolver: zodResolver(OptionSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: TOptionUpdateRequest) => {
    try {
      const response = await updateOption(initialData.id, data);
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

          {/* Mã Code */}
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

          {/* Ghi chú */}
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="note">Ghi chú</Label>
                <FormControl>
                  <Input
                    placeholder="Nhập ghi chú..."
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

          {/* Số lượng tối đa */}
          <FormField
            control={form.control}
            name="maxQuantity"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="maxQuantity">Số lượng tối đa</Label>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Nhập số lượng tối đa..."
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Giảm giá */}
          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="discount">Giảm giá</Label>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Nhập giảm giá..."
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Bắt buộc */}
          <FormField
            control={form.control}
            name="isMandatory"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="isMandatory">Bắt buộc</Label>
                <FormControl>
                  <Input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
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
