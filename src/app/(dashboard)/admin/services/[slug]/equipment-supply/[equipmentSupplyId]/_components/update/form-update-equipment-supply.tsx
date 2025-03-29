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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import {
  EquipmentSupplySchema,
  TEquipmentSupplyUpdateRequest,
} from "@/schema/equipment-supply.schema";
import { updateEquipmentSupply } from "@/apis/equipment-supply";
import { Switch } from "@/components/ui/switch";

type Props = {
  initialData: TEquipmentSupplyUpdateRequest;
};

export function FormUpdateEquipmentSupply({ initialData }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<TEquipmentSupplyUpdateRequest>({
    resolver: zodResolver(EquipmentSupplySchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: TEquipmentSupplyUpdateRequest) => {
    try {
      const response = await updateEquipmentSupply(initialData.id, data);
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
        <div className="grid grid-cols-12 gap-4 py-0 px-4 md:px-0 md:py-4">
          {/* Tên */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="col-span-3">
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
              <FormItem className="col-span-3">
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

          {/* Ảnh */}
          <FormField
            control={form.control}
            name="urlImage"
            render={({ field }) => (
              <FormItem className="col-span-6">
                <Label htmlFor="urlImage">Hình Ảnh</Label>
                <FormControl>
                  <Input
                    placeholder="Nhập URL hình ảnh..."
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
              <FormItem className="col-span-8 flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Trạng Thái</FormLabel>
                  <FormDescription>
                    Chọn để kích hoạt hoặc vô hiệu hóa trạng thái
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value === "Active"}
                    onCheckedChange={(checked) =>
                      field.onChange(checked ? "Active" : "Inactive")
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Ngày tạo */}
          <FormField
            control={form.control}
            name="createdAt"
            render={({ field }) => (
              <FormItem className="col-span-6">
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
              <FormItem className="col-span-6">
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
