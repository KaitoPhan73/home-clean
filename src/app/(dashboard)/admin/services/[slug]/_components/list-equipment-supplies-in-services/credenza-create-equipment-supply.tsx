/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { useEffect, useState } from "react";
import {
  Credenza,
  CredenzaTrigger,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaClose,
} from "@/components/ui/credenza";
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
import {
  EquipmentSupplyCreateSchema,
  TEquipmentSupplyCreateRequest,
} from "@/schema/equipment-supply.schema";
import { createEquipmentSupply } from "@/apis/equipment-supply";
import { getAllServices } from "@/apis/service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

type Props = {
  className?: string;
};

export function CredenzaCreateEquipmentSupply({ className }: Props) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [services, setServices] = useState<{ id: string; name: string }[]>([]);
  const [selectedServiceName, setSelectedServiceName] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const parts = window.location.pathname.split("/");
      const serviceId = parts[parts.length - 1]; // Lấy giá trị cuối cùng từ URL
      setSelectedServiceId(serviceId);
      form.setValue("serviceId", serviceId);
    }
  }, []);

  const form = useForm<TEquipmentSupplyCreateRequest>({
    resolver: zodResolver(EquipmentSupplyCreateSchema),
    defaultValues: {
      name: "",
      base64Image: "",
      serviceId: "",
      code: "",
    },
  });

  const convertImageToBase64 = async (imageUrl: string): Promise<string> => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(",")[1]); // Loại bỏ phần "data:image/png;base64,"
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const { isSubmitting } = form.formState;

  useEffect(() => {
    const fetchAllServices = async () => {
      try {
        const response = await getAllServices();
        const service = response.payload.items.find(
          (s) => s.id === selectedServiceId
        );
        if (service) {
          setSelectedServiceName(service.name);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách dịch vụ:", error);
      }
    };

    if (selectedServiceId) {
      fetchAllServices();
    }
  }, [selectedServiceId]);

  const onSubmit = async (data: TEquipmentSupplyCreateRequest) => {
    try {
      const response = await createEquipmentSupply(data);
      if (response.status === 201) {
        toast({
          title: "Tạo thiết bị thành công",
          description: "Thiết bị đã được tạo thành công.",
        });
        form.reset();
        setIsOpen(false);
        router.refresh();
      } else {
        toast({
          title: "Lỗi",
          description: "Không thể tạo thiết bị",
          variant: "destructive",
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Có lỗi xảy ra: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaTrigger asChild className={className}>
        <Button variant="default">Tạo Thiết Bị</Button>
      </CredenzaTrigger>
      <CredenzaContent className="sm:max-w-[500px]">
        <CredenzaHeader>
          <CredenzaTitle>Tạo Thiết Bị</CredenzaTitle>
          <CredenzaDescription>Thêm thiết bị hỗ trợ mới</CredenzaDescription>
        </CredenzaHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4 py-0 px-4 md:px-0 md:py-4">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="name">Tên Thiết Bị</Label>
                    <FormControl>
                      <Input
                        placeholder="Nhập tên thiết bị..."
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Code */}
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="code">Mã Thiết Bị</Label>
                    <FormControl>
                      <Input
                        placeholder="Nhập mã thiết bị..."
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
                name="base64Image"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="base64Image">Ảnh Thiết Bị</Label>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        disabled={isSubmitting}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                field.onChange(
                                  reader.result?.toString().split(",")[1]
                                ); // Lấy phần base64
                              };
                              reader.readAsDataURL(file);
                            } catch (error) {
                              console.error("Lỗi khi chuyển đổi ảnh:", error);
                            }
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    {field.value && (
                      <div className="mt-2">
                        <img
                          src={`data:image/png;base64,${field.value}`}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-md border"
                        />
                      </div>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serviceId"
                render={() => (
                  <FormItem>
                    <Label>Tên Dịch Vụ</Label>
                    <FormControl>
                      <Input value={selectedServiceName} disabled />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <CredenzaFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang tạo..." : "Tạo Thiết Bị"}
              </Button>
              <CredenzaClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsOpen(false)}
                >
                  Đóng
                </Button>
              </CredenzaClose>
            </CredenzaFooter>
          </form>
        </Form>
      </CredenzaContent>
    </Credenza>
  );
}
