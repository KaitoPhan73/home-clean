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
import { updateHouse } from "@/apis/house";
import { useRouter } from "next/navigation";
import { HouseSchema, TUpdateHouseRequest } from "@/schema/house.schema";
import { SelectBuildingAsync } from "../../../_components/select-building-async";
import { SelectHouseTypeAsync } from "../../../_components/select-house-type-async";
import { Switch } from "@/components/ui/switch";

type Props = {
  initialData: TUpdateHouseRequest;
};

export function FormUpdateHouse({ initialData }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<TUpdateHouseRequest>({
    resolver: zodResolver(HouseSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: TUpdateHouseRequest) => {
    try {
      const response = await updateHouse(initialData.id, data);
      if (response.status === 200) {
        toast({
          title: "Cập nhật nhà thành công",
          description: "Thông tin nhà đã được cập nhật thành công.",
        });
      } else {
        toast({
          title: "Lỗi",
          description: "Không thể cập nhật thông tin nhà",
          variant: "destructive",
        });
      }
      router.refresh();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Có lỗi xảy ra khi cập nhật thông tin nhà: ${error.message}`,
        variant: "destructive",
      });
    }
  };
  const { isSubmitting } = form.formState;
  const fields = [
    { name: "no", label: "Số thứ tự" },
    { name: "numberOfRoom", label: "Số phòng" },
    { name: "status", label: "Trạng thái" },
    { name: "code", label: "Mã nhà" },
    { name: "furnishingStatus", label: "Tình trạng nội thất" },
    { name: "squareMeters", label: "Diện tích (m²)" },
    { name: "orientation", label: "Hướng nhà" },
    { name: "contactTerms", label: "Điều khoản hợp đồng" },
    { name: "occupacy", label: "Tình trạng cư trú" },
  ];
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
        <div className="grid grid-cols-6 gap-4 py-0 px-4 md:px-0 md:py-4">
          {fields.map(({ name, label }) => (
            <FormField
              key={name}
              control={form.control}
              name={name as keyof TUpdateHouseRequest}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <Label htmlFor={name}>{label}</Label>
                  <FormControl>
                    <Input
                      placeholder={`Nhập ${label}...`}
                      {...field}
                      value={
                        typeof field.value === "boolean"
                          ? String(field.value)
                          : field.value
                      }
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <FormField
            control={form.control}
            name="buildingId"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <Label htmlFor="areaId">Chọn tòa</Label>

                <SelectBuildingAsync
                  value={field.value}
                  onChange={field.onChange}
                />

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="houseTypeId"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <Label htmlFor="houseTypeId">Loại nhà</Label>

                <SelectHouseTypeAsync
                  value={field.value}
                  onChange={field.onChange}
                />

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bedroomCount"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <Label htmlFor="bedroomCount">Số phòng ngủ</Label>
                <FormControl>
                  <Input type="number" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bathroomCount"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <Label htmlFor="bathroomCount">Số phòng tắm</Label>
                <FormControl>
                  <Input type="number" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hasBalcony"
            render={({ field }) => (
              <FormItem className="col-span-2 flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Ban công</FormLabel>
                  <FormDescription>Chọn nếu nhà có ban công</FormDescription>
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
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto"
        >
          {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
        </Button>
      </form>
    </Form>
  );
}
