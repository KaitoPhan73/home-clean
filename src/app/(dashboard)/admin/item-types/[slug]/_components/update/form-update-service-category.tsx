"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import {
  ServiceCategorySchema,
  TUpdateServiceCategoryRequest,
} from "@/schema/service-category.schema";
import { updateServiceCategory } from "@/apis/service-category";
import { statusOptions } from "@/constants/config";

type Props = {
  initialData: TUpdateServiceCategoryRequest;
};

export function FormUpdateServiceCategory({ initialData }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<TUpdateServiceCategoryRequest>({
    resolver: zodResolver(ServiceCategorySchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: TUpdateServiceCategoryRequest) => {
    try {
      const response = await updateServiceCategory(initialData.id, data);
      if (response.status === 200) {
        toast({
          title: "Cập nhập thành công",
          description: "Đã cập nhật thành công.",
        });
      } else {
        toast({
          title: "Lỗi",
          description: "Không thể cập nhật loại dịch vụ",
          variant: "destructive",
        });
      }
      router.refresh();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Có lỗi xảy ra khi cập nhật loại dịch vụ ${error.message}`,
        variant: "destructive",
      });
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
                    placeholder="Nhập mã dịch vụ..."
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
            name="status"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="status">Trạng thái</Label>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
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
          
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Đang cập nhập..." : "Cập nhập"}
        </Button>
      </form>
    </Form>
  );
}
