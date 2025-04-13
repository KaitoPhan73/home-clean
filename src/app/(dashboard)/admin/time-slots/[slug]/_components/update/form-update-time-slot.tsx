"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import {
  TimesSlotSchema,
  TTimesSlotUpdateRequest,
} from "@/schema/time-slot.schema";
import { updateTimeSlot } from "@/apis/time-slot";

type Props = {
  initialData: TTimesSlotUpdateRequest;
};

export function FormUpdateTimeSlot({ initialData }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<TTimesSlotUpdateRequest>({
    resolver: zodResolver(TimesSlotSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: TTimesSlotUpdateRequest) => {
    try {
      const response = await updateTimeSlot(initialData.id, data);
      if (response.status === 200) {
        toast({
          title: "Cập nhập thành công",
          description: "Đã cập nhật thành công.",
        });
      } else {
        toast({
          title: "Lỗi",
          description: "Không thể cập nhật ca làm việc",
          variant: "destructive",
        });
      }
      router.refresh();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Có lỗi xảy ra khi cập nhật ca làm việc ${error.message}`,
        variant: "destructive",
      });
    }
  };
  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4 py-0 px-4 md:px-0 md:py-4">
          {/* ID */}
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="id">ID</Label>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Giờ bắt đầu */}
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="startTime">Giờ Bắt Đầu</Label>
                <FormControl>
                  <Input
                    type="time"
                    value={field.value ? String(field.value) : ""} // Chuyển giá trị thành chuỗi nếu có
                    onChange={(e) => field.onChange(e.target.value)}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="endTime">Giờ Kết Thúc</Label>
                <FormControl>
                  <Input
                    type="time"
                    value={field.value ? String(field.value) : ""}
                    onChange={(e) => field.onChange(e.target.value)}
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
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
        </Button>
      </form>
    </Form>
  );
}
