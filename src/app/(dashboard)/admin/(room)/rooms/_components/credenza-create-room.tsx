/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import {
  Credenza,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaClose,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RoomCreateSchema, TCreateRoomRequest } from "@/schema/room.schema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createRoom } from "@/apis/room";
import { useRouter } from "next/navigation";
import { SelectRoomTypeAsync } from "./select-room-type-async";
import { SelectHouseAsync } from "./select-house-async";
import { Switch } from "@/components/ui/switch";
import { handleErrorApi } from "@/lib/utils";

export function CredenzaCreateRoom() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const form = useForm<TCreateRoomRequest>({
    resolver: zodResolver(RoomCreateSchema),
    defaultValues: {
      name: "",
      size: 0,
      furnitureIncluded: false,
      squareMeters: "",
      houseId: "",
      roomTypeId: "",
      code: "",
    },
  });

  const onSubmit = async (data: TCreateRoomRequest) => {
    try {
      const response = await createRoom(data);
      if (response.status === 201) {
        toast({
          title: "Tạo phòng thành công",
          description: "Phòng đã được tạo thành công.",
        });
        form.reset();
        setIsOpen(false);
        router.refresh();
      }
    } catch (error: any) {
      handleErrorApi({
        error,
      });
    }
  };

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaTrigger asChild>
        <Button variant="default" onClick={() => setIsOpen(true)}>
          Tạo Phòng
        </Button>
      </CredenzaTrigger>
      <CredenzaContent className="max-w-4xl">
        <CredenzaHeader>
          <CredenzaTitle>Tạo Phòng</CredenzaTitle>
          <CredenzaDescription>Nhập thông tin phòng</CredenzaDescription>
        </CredenzaHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-6 gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <Label htmlFor="name">Tên phòng</Label>
                    <FormControl>
                      <Input placeholder="Nhập tên phòng..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <Label htmlFor="code">Mã phòng</Label>
                    <FormControl>
                      <Input placeholder="Nhập mã phòng..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <Label htmlFor="size">Kích thước phòng</Label>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Nhập kích thước phòng..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="squareMeters"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <Label htmlFor="squareMeters">Diện tích (m²)</Label>
                    <FormControl>
                      <Input placeholder="Nhập diện tích phòng..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="houseId"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <Label htmlFor="houseId">Chọn căn hộ</Label>
                    <FormControl>
                      <SelectHouseAsync
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="roomTypeId"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <Label htmlFor="roomTypeId">Loại phòng</Label>
                    <SelectRoomTypeAsync
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="furnitureIncluded"
                render={({ field }) => (
                  <FormItem className="col-span-3 flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Có bao gồm nội thất</FormLabel>
                      <FormDescription>
                        Chọn nếu nhà có nội thất
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
            </div>
            <CredenzaFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Đang tạo..." : "Tạo Phòng"}
              </Button>
              <CredenzaClose asChild>
                <Button type="button" variant="outline">
                  Hủy
                </Button>
              </CredenzaClose>
            </CredenzaFooter>
          </form>
        </Form>
      </CredenzaContent>
    </Credenza>
  );
}
