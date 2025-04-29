/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
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
  ServiceCreateSchema,
  TServiceCreateRequest,
} from "@/schema/service.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { createService } from "@/apis/service";
import { Textarea } from "@/components/ui/textarea";
import { getAllServiceCategories } from "@/apis/service-category";
import { handleErrorApi } from "@/lib/utils";

type Props = {
  className?: string;
};

export function CredenzaCreateService({ className }: Props) {
  const [serviceCategories, setServiceCategories] = useState<
    { id: string; name: string }[]
  >([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false); // Để kiểm soát đóng Credenza
  const form = useForm<TServiceCreateRequest>({
    resolver: zodResolver(ServiceCreateSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      discount: 0,
      prorityLevel: 0,
      duration: 0,
      maxCapacity: 0,
      serviceCode: "",
      serviceCategoryId: "",
      code: "",
      base64Image: "",
    },
  });

  const { isSubmitting } = form.formState;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useEffect(() => {
    const fetchServiceCategories = async () => {
      try {
        const response = await getAllServiceCategories();
        setServiceCategories(response.payload.items);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục dịch vụ:", error);
      }
    };

    fetchServiceCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Lấy phần base64 sau "data:image/jpeg;base64,"
        const base64Data = base64String.split(",")[1];

        // Cập nhật giá trị base64Image trong form
        form.setValue("base64Image", base64Data);

        // Hiển thị preview ảnh
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: TServiceCreateRequest) => {
    try {
      const response = await createService(data);
      if (response.status === 201) {
        toast({
          title: "Tạo dịch vụ thành công",
          description: "Dịch vụ đã được tạo thành công.",
        });
        form.reset();
        setImagePreview(null);
        setIsOpen(false); // Đóng Credenza
      } else {
        toast({
          title: "Lỗi",
          description: "Không thể tạo dịch vụ",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaTrigger asChild className={className}>
        <Button variant="default">Tạo Dịch Vụ</Button>
      </CredenzaTrigger>
      <CredenzaContent className="sm:max-w-[500px]">
        <CredenzaHeader>
          <CredenzaTitle>Tạo Dịch Vụ</CredenzaTitle>
          <CredenzaDescription>Tạo một dịch vụ mới</CredenzaDescription>
        </CredenzaHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="max-h-[70vh] overflow-y-auto px-4 md:px-0">
              {/* Thông tin cơ bản */}
              <div className="mb-6">
                <h3 className="text-lg font-medium border-b pb-2 mb-4">
                  Thông tin cơ bản
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="name">Tên Dịch Vụ</Label>
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
                    name="description"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <Label htmlFor="description">Mô Tả</Label>
                        <FormControl>
                          <Textarea
                            placeholder="Nhập mô tả dịch vụ..."
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Thông tin giá và ưu đãi */}
              <div className="mb-6">
                <h3 className="text-lg font-medium border-b pb-2 mb-4">
                  Giá và ưu đãi
                </h3>
                <div className="grid grid-cols-2 gap-4">
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
                  <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="discount">Giảm Giá (%)</Label>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Nhập % giảm giá..."
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Thông tin dịch vụ */}
              <div className="mb-6">
                <h3 className="text-lg font-medium border-b pb-2 mb-4">
                  Thông tin dịch vụ
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="prorityLevel"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="prorityLevel">Mức Độ Ưu Tiên</Label>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Nhập mức độ ưu tiên..."
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
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="duration">Thời Lượng (giờ)</Label>
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
                  <FormField
                    control={form.control}
                    name="maxCapacity"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="maxCapacity">Số Lượng Tối Đa</Label>
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
                  <FormField
                    control={form.control}
                    name="serviceCode"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="serviceCode">Mã Dịch Vụ Hệ Thống</Label>
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
                    name="serviceCategoryId"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <Label htmlFor="serviceCategoryId">
                          Danh Mục Dịch Vụ
                        </Label>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn danh mục dịch vụ" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {serviceCategories.length > 0 ? (
                              serviceCategories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                >
                                  {category.name}
                                </SelectItem>
                              ))
                            ) : (
                              <div className="p-2 text-gray-500">
                                Không có danh mục dịch vụ
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Hình ảnh */}
              <div className="mb-6">
                <h3 className="text-lg font-medium border-b pb-2 mb-4">
                  Hình ảnh dịch vụ
                </h3>
                <FormField
                  control={form.control}
                  name="base64Image"
                  render={() => (
                    <FormItem>
                      <Label htmlFor="base64Image">Tải lên ảnh dịch vụ</Label>
                      <FormControl>
                        <div className="flex flex-col space-y-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            disabled={isSubmitting}
                          />
                          {imagePreview && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-500 mb-1">
                                Preview:
                              </p>
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="max-h-40 rounded-md object-contain"
                              />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <CredenzaFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang tạo..." : "Tạo Dịch Vụ"}
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
