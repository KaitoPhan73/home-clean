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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { statusOptions } from "@/constants/config";
import { ServiceSchema, TUpdateServiceRequest } from "@/schema/service.schema";
import { updateService } from "@/apis/service";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  initialData: TUpdateServiceRequest;
};

export function FormUpdateService({ initialData }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<TUpdateServiceRequest>({
    resolver: zodResolver(ServiceSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: TUpdateServiceRequest) => {
    try {
      const response = await updateService(initialData.id, data);
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
        <div className="grid grid-cols-6 gap-4 py-0 px-4 md:px-0 md:py-4">
          {/* Tên Loại Dịch Vụ */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <Label htmlFor="name">Tên Loại Dịch Vụ</Label>
                <FormControl>
                  <Input
                    placeholder="Nhập tên dịch vụ..."
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Mã Dịch Vụ */}
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="col-span-2">
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

          {/* Giá Dịch Vụ */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <Label htmlFor="price">Giá Dịch Vụ</Label>
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

          {/* Giảm giá */}
          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <Label htmlFor="discount">Giảm giá (%)</Label>
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

          {/* Cấp độ ưu tiên */}
          <FormField
            control={form.control}
            name="prorityLevel"
            render={({ field }) => (
              <FormItem className="col-span-2"> 
                <Label htmlFor="prorityLevel">Cấp độ ưu tiên</Label>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Nhập cấp độ ưu tiên..."
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Thời lượng */}
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <Label htmlFor="duration">Thời lượng (phút)</Label>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Nhập thời lượng..."
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
            name="maxCapacity"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <Label htmlFor="maxCapacity">Số lượng tối đa</Label>
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

          {/* Mã Code Dịch Vụ */}
          <FormField
            control={form.control}
            name="serviceCode"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <Label htmlFor="serviceCode">Mã Code Dịch Vụ</Label>
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

          {/* Trạng thái */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="col-span-2">
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

          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="col-span-3 flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Dịch Vụ Nổi Bật</FormLabel>
                  <FormDescription>
                    Chọn nếu dịch vụ này là nổi bật
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isAvailable"
            render={({ field }) => (
              <FormItem className="col-span-3 flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Dịch Vụ Có Sẵn</FormLabel>
                  <FormDescription>
                    Chọn nếu dịch vụ này là có sẵn
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-6">
                <Label htmlFor="description">Mô tả dịch vụ</Label>
                <FormControl>
                  <Textarea
                    placeholder="Nhập mô tả..."
                    {...field}
                    disabled={isSubmitting}
                    className="min-h-[100px] resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Nút Cập nhật */}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
        </Button>
      </form>
    </Form>
  );
}
