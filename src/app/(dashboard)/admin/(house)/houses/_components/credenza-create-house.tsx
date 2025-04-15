/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
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
import { HouseCreateSchema, TCreateHouseRequest } from "@/schema/house.schema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createHouse } from "@/apis/house";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { SelectHouseTypeAsync } from "./select-house-type-async";
import { handleErrorApi } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getAllBuildings } from "@/apis/building"; // 👉 API gọi toàn bộ tòa nhà

type Props = {
  className?: string;
};

type Building = {
  _id: string;
  name: string;
};

export function CredenzaCreateHouse({ className }: Props) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const router = useRouter();

  const form = useForm<TCreateHouseRequest>({
    resolver: zodResolver(HouseCreateSchema),
    defaultValues: {
      no: "",
      numberOfRoom: "",
      status: "",
      code: "",
      bedroomCount: 0,
      bathroomCount: 0,
      hasBalcony: false,
      furnishingStatus: "",
      squareMeters: "",
      orientation: "",
      contactTerms: "",
      occupacy: "",
      buildingId: "",
      houseTypeId: "",
    },
  });

  const fetchBuildings = async () => {
    try {
      const res = await getAllBuildings();
      setBuildings(
        res.payload.items.map((item: any) => ({
          _id: item.id,
          name: item.name,
        }))
      ); // tuỳ theo response API của bạn
    } catch (error) {
      console.error("Lỗi lấy danh sách tòa nhà:", error);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  const onSubmit = async (data: TCreateHouseRequest) => {
    try {
      const response = await createHouse(data);
      if (response.status === 201) {
        toast({
          title: "Tạo nhà thành công",
          description: "Nhà đã được tạo thành công.",
        });
        form.reset();
        setIsOpen(false);
        router.refresh();
      }
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };

  const fields = [
    { name: "no", label: "Số thứ tự" },
    { name: "numberOfRoom", label: "Số phòng" },
    { name: "code", label: "Mã nhà" },
    { name: "squareMeters", label: "Diện tích (m²)" },
    { name: "orientation", label: "Hướng nhà" },
    { name: "contactTerms", label: "Điều khoản hợp đồng" },
  ];

  const { isSubmitting } = form.formState;

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaTrigger asChild className={className}>
        <Button variant="default" onClick={() => setIsOpen(true)}>
          Tạo Căn Hộ
        </Button>
      </CredenzaTrigger>
      <CredenzaContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <CredenzaHeader>
          <CredenzaTitle>Tạo Nhà</CredenzaTitle>
          <CredenzaDescription>Nhập thông tin nhà</CredenzaDescription>
        </CredenzaHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Accordion
              type="multiple"
              defaultValue={["basic-info", "technical-info", "status-info"]}
            >
              {/* Accordion 1: Thông tin cơ bản */}
              <AccordionItem value="basic-info">
                <AccordionTrigger>Thông tin cơ bản</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-6 gap-4 py-4">
                    {fields.slice(0, 3).map(({ name, label }) => (
                      <FormField
                        key={name}
                        control={form.control}
                        name={name as keyof TCreateHouseRequest}
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <Label htmlFor={name}>{label}</Label>
                            <FormControl>
                              <Input
                                placeholder={`Nhập ${label}...`}
                                {...field}
                                value={field.value?.toString()}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                    <div className="col-span-6 grid grid-cols-6 gap-4">
                      <FormField
                        control={form.control}
                        name="buildingId"
                        render={({ field }) => (
                          <FormItem className="col-span-3">
                            <Label htmlFor="buildingId">Chọn tòa</Label>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn tòa nhà" />
                              </SelectTrigger>
                              <SelectContent
                                className="max-h-60 overflow-auto"
                                onCloseAutoFocus={(e) => {
                                  e.preventDefault(); // tránh focus thẻ đầu tiên
                                  setTimeout(() => {
                                    const el = document.querySelector(
                                      `[data-radix-select-item-value="${field.value}"]`
                                    );
                                    el?.scrollIntoView({ block: "nearest" });
                                  }, 0);
                                }}
                              >
                                {buildings.map((building) => (
                                  <SelectItem
                                    key={building._id}
                                    value={building._id}
                                    data-radix-select-item-value={building._id}
                                  >
                                    {building.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="houseTypeId"
                        render={({ field }) => (
                          <FormItem className="col-span-3">
                            <Label htmlFor="houseTypeId">Loại nhà</Label>
                            <SelectHouseTypeAsync
                              value={field.value}
                              onChange={field.onChange}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Accordion 2: Thông số kỹ thuật */}
              <AccordionItem value="technical-info">
                <AccordionTrigger>Thông số kỹ thuật</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-6 gap-4 py-4">
                    {fields.slice(3).map(({ name, label }) => (
                      <FormField
                        key={name}
                        control={form.control}
                        name={name as keyof TCreateHouseRequest}
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <Label htmlFor={name}>{label}</Label>
                            <FormControl>
                              <Input
                                placeholder={`Nhập ${label}...`}
                                {...field}
                                value={field.value?.toString()}
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
                      name="bedroomCount"
                      render={({ field }) => (
                        <FormItem className="col-span-1">
                          <Label htmlFor="bedroomCount">Số phòng ngủ</Label>
                          <FormControl>
                            <Input
                              type="number"
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
                      name="bathroomCount"
                      render={({ field }) => (
                        <FormItem className="col-span-1">
                          <Label htmlFor="bathroomCount">Số phòng tắm</Label>
                          <FormControl>
                            <Input
                              type="number"
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
                      name="hasBalcony"
                      render={({ field }) => (
                        <FormItem className="col-span-2 flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Ban công</FormLabel>
                            <FormDescription>
                              Chọn nếu nhà có ban công
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
                </AccordionContent>
              </AccordionItem>

              {/* Accordion 3: Tình trạng */}
              <AccordionItem value="status-info">
                <AccordionTrigger>Tình trạng nhà</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-6 gap-4 py-4">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <Label htmlFor="status">Tình trạng nhà</Label>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn tình trạng" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Active">Hoạt động</SelectItem>
                              <SelectItem value="Inactive">
                                Không hoạt động
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="occupacy"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <Label htmlFor="occupacy">Tình trạng cư trú</Label>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn tình trạng" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Active">
                                Đang cư trú
                              </SelectItem>
                              <SelectItem value="Inactive">
                                Không cư trú
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="furnishingStatus"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <Label htmlFor="furnishingStatus">
                            Tình trạng nội thất
                          </Label>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn tình trạng" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Active">Rất tốt</SelectItem>
                              <SelectItem value="Inactive">
                                Không tốt
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <CredenzaFooter className="mt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang tạo..." : "Tạo Nhà"}
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
