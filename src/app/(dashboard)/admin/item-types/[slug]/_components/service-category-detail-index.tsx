/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

import {
  ArrowLeft,
  Tag,
  Package,
  FileText,
  Clock,
  Scale,
  CreditCard,
  Image as ImageIcon,
  Info,
  Check,
  Ban,
} from "lucide-react";
import { ItemTypeSchema } from "@/schema/VinLaudry/item-type.schema";
import { getItemTypeById } from "@/apis/laudry/item-type";
import { toast } from "sonner";
import { getAllServiceTypes } from "@/apis/laudry/service-type";
import {
  formatCurrency,
  formatDateTime,
} from "@/app/(dashboard)/manager/order-assignment/_components/order-management/OrderDetailsPopup/utils";

type Props = {
  slug: string;
  keyProps: string;
};

export default function ItemTypeDetailPage({ slug, keyProps }: Props) {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [serviceTypes, setServiceTypes] = useState<
    { id: string; name: string }[]
  >([]);

  const form = useForm<z.infer<typeof ItemTypeSchema>>({
    resolver: zodResolver(ItemTypeSchema),
    defaultValues: {
      id: "",
      itemCode: "",
      name: "",
      description: "",
      category: "",
      defaultPrice: null,
      pricePerItem: null,
      pricePerKg: null,
      estimatedProcessTime: null,
      imageUrl: "",
      status: "Active",
      minWeight: null,
      maxWeight: null,
      standardProcessingTime: null,
      serviceTypeId: "",
      serviceType: "",
    },
  });

  // Fetch item data
  useEffect(() => {
    const fetchItemType = async () => {
      try {
        setLoading(true);
        const response = await getItemTypeById(params.id as string);
        if (response && response.payload) {
          const formattedData = {
            ...response.payload,
            defaultPrice:
              response.payload.defaultPrice !== null
                ? Number(response.payload.defaultPrice)
                : null,
            pricePerItem:
              response.payload.pricePerItem !== null
                ? Number(response.payload.pricePerItem)
                : null,
            pricePerKg:
              response.payload.pricePerKg !== null
                ? Number(response.payload.pricePerKg)
                : null,
            estimatedProcessTime:
              response.payload.estimatedProcessTime !== null
                ? Number(response.payload.estimatedProcessTime)
                : null,
            minWeight:
              response.payload.minWeight !== null
                ? Number(response.payload.minWeight)
                : null,
            maxWeight:
              response.payload.maxWeight !== null
                ? Number(response.payload.maxWeight)
                : null,
            standardProcessingTime:
              response.payload.standardProcessingTime !== null
                ? Number(response.payload.standardProcessingTime)
                : null,
          };
          form.reset(formattedData);
        } else {
          toast.error("Không tìm thấy mặt hàng");
          router.push("/admin/item-types");
        }
      } catch (error) {
        console.error("Error fetching item type:", error);
        toast.error("Đã xảy ra lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    const fetchServiceTypes = async () => {
      try {
        const response = await getAllServiceTypes();
        if (response && response.payload) {
          setServiceTypes(response.payload.items);
        }
      } catch (error) {
        console.error("Error fetching service types:", error);
      }
    };

    if (params.id) {
      fetchItemType();
      fetchServiceTypes();
    }
  }, [params.id, router, form]);

  //   const onSubmit = async (data: z.infer<typeof ItemTypeSchema>) => {
  //     try {
  //       setLoading(true);
  //       await updateItemType(params.id as string, data);
  //       toast.success("Cập nhật mặt hàng thành công");
  //       setIsEditing(false);
  //       router.refresh();
  //     } catch (error) {
  //       console.error("Error updating item type:", error);
  //       toast.error("Đã xảy ra lỗi khi cập nhật");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   const onDelete = async () => {
  //     try {
  //       setIsDeleting(true);
  //       await deleteItemType(params.id as string);
  //       toast.success("Xóa mặt hàng thành công");
  //       router.push("/admin/item-types");
  //     } catch (error) {
  //       console.error("Error deleting item type:", error);
  //       toast.error("Đã xảy ra lỗi khi xóa");
  //     } finally {
  //       setIsDeleting(false);
  //       setOpenDeleteModal(false);
  //     }
  //   };

  const formatWeight = (kg: number | null) => {
    if (kg === null || kg === undefined) return "Chưa thiết lập";
    return `${kg} kg`;
  };

  const getServiceTypeName = (serviceTypeId: string) => {
    const serviceType = serviceTypes.find((type) => type.id === serviceTypeId);
    return serviceType
      ? serviceType.name
      : formValues.serviceType || "Chưa thiết lập";
  };

  const formValues = form.getValues();
  const isActive = formValues.status === "Active";

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
        <div className="grid grid-cols-1 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/admin/item-types")}
              className="h-8 w-8 hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">
              Chi tiết mặt hàng: {formValues.name}
            </h1>
            <div
              className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                isActive
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {isActive ? (
                <span className="flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Hoạt động
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Ban className="h-3 w-3" />
                  Không hoạt động
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* <Button
              variant={isEditing ? "secondary" : "outline"}
              onClick={() => setIsEditing(!isEditing)}
              disabled={loading}
              className="transition-colors"
            >
              {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa"}
            </Button>
            {isEditing && (
              <Button
                variant="default"
                onClick={form.handleSubmit(onSubmit)}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Lưu thay đổi
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={() => setOpenDeleteModal(true)}
              disabled={loading || isDeleting}
              className="transition-colors"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash className="h-4 w-4 mr-2" />
              )}
              Xóa
            </Button> */}
          </div>
        </div>

        <Form {...form}>
          <form className="space-y-8">
            <Tabs defaultValue="basic-info" className="w-full">
              <TabsList className="grid grid-cols-3 max-w-lg mb-6">
                <TabsTrigger
                  value="basic-info"
                  className="flex items-center gap-2"
                >
                  <Info className="h-4 w-4" />
                  Thông tin cơ bản
                </TabsTrigger>
                <TabsTrigger
                  value="pricing"
                  className="flex items-center gap-2"
                >
                  <CreditCard className="h-4 w-4" />
                  Giá & Xử lý
                </TabsTrigger>
                <TabsTrigger
                  value="appearance"
                  className="flex items-center gap-2"
                >
                  <ImageIcon className="h-4 w-4" />
                  Hình ảnh
                </TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}
              <TabsContent value="basic-info" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Tag className="h-5 w-5 text-blue-600" />
                        Thông tin định danh
                      </CardTitle>
                      <CardDescription>
                        Thông tin cơ bản để định danh mặt hàng
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="itemCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mã mặt hàng</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={loading}
                                placeholder="Nhập mã mặt hàng"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tên mặt hàng</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={loading}
                                placeholder="Nhập tên mặt hàng"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Danh mục</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                value={field.value || ""}
                                disabled={loading}
                                placeholder="Nhập danh mục"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="serviceTypeId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Loại dịch vụ</FormLabel>
                            <Select
                              disabled={loading}
                              onValueChange={field.onChange}
                              value={field.value}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn loại dịch vụ" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {serviceTypes.map((type) => (
                                  <SelectItem key={type.id} value={type.id}>
                                    {type.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Right Column */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        Mô tả & Trạng thái
                      </CardTitle>
                      <CardDescription>
                        Thông tin chi tiết về mặt hàng
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mô tả</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                value={field.value || ""}
                                disabled={loading}
                                placeholder="Nhập mô tả chi tiết về mặt hàng"
                                className="min-h-32"
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
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Trạng thái
                              </FormLabel>
                              <FormDescription>
                                {field.value === "Active"
                                  ? "Đang hoạt động"
                                  : "Không hoạt động"}
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value === "Active"}
                                onCheckedChange={(checked) => {
                                  field.onChange(
                                    checked ? "Active" : "Inactive"
                                  );
                                }}
                                disabled={loading}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Pricing Tab */}
              <TabsContent value="pricing" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pricing Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                        Thông tin giá
                      </CardTitle>
                      <CardDescription>
                        Cấu hình giá cho mặt hàng
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="defaultPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Giá mặc định (VND)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value
                                      ? Number(e.target.value)
                                      : null
                                  )
                                }
                                disabled={loading}
                                placeholder="Nhập giá mặc định"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="pricePerItem"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Giá theo món (VND)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  value={field.value ?? ""}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value
                                        ? Number(e.target.value)
                                        : null
                                    )
                                  }
                                  disabled={loading}
                                  placeholder="Nhập giá theo món"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="pricePerKg"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Giá theo kg (VND)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  value={field.value ?? ""}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value
                                        ? Number(e.target.value)
                                        : null
                                    )
                                  }
                                  disabled={loading}
                                  placeholder="Nhập giá theo kg"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Processing Time Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-600" />
                        Thời gian xử lý
                      </CardTitle>
                      <CardDescription>
                        Cấu hình thời gian xử lý cho mặt hàng
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="estimatedProcessTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Thời gian xử lý dự kiến (phút)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value
                                      ? Number(e.target.value)
                                      : null
                                  )
                                }
                                disabled={loading}
                                placeholder="Nhập thời gian xử lý dự kiến"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="standardProcessingTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Thời gian xử lý tiêu chuẩn (phút)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value
                                      ? Number(e.target.value)
                                      : null
                                  )
                                }
                                disabled={loading}
                                placeholder="Nhập thời gian xử lý tiêu chuẩn"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Weight Limits Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scale className="h-5 w-5 text-blue-600" />
                      Giới hạn trọng lượng
                    </CardTitle>
                    <CardDescription>
                      Cấu hình giới hạn trọng lượng cho mặt hàng
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="minWeight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Trọng lượng tối thiểu (kg)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value
                                      ? Number(e.target.value)
                                      : null
                                  )
                                }
                                disabled={loading}
                                placeholder="Nhập trọng lượng tối thiểu"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="maxWeight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Trọng lượng tối đa (kg)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value
                                      ? Number(e.target.value)
                                      : null
                                  )
                                }
                                disabled={loading}
                                placeholder="Nhập trọng lượng tối đa"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Appearance Tab */}
              <TabsContent value="appearance">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-blue-600" />
                      Hình ảnh mặt hàng
                    </CardTitle>
                    <CardDescription>
                      Quản lý hình ảnh hiển thị cho mặt hàng
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL hình ảnh</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value ?? ""}
                              disabled={loading}
                              placeholder="Nhập URL hình ảnh"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Summary Section */}
            <Card>
              <CardHeader className="border-b">
                <CardTitle>Tóm tắt thông tin</CardTitle>
                <CardDescription>
                  Tổng quan về thông tin mặt hàng
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-500">
                      Thông tin cơ bản
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-500 block">
                          Mã mặt hàng:
                        </span>
                        <span className="font-medium">
                          {formValues.itemCode}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 block">
                          Tên mặt hàng:
                        </span>
                        <span>{formValues.name}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 block">
                          Trạng thái:
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            isActive
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {isActive ? "Hoạt động" : "Không hoạt động"}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 block">
                          Danh mục:
                        </span>
                        <span>{formValues.category || "Chưa thiết lập"}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 block">
                          Loại dịch vụ:
                        </span>
                        <span>
                          {getServiceTypeName(formValues.serviceTypeId)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-500">Thông tin giá</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-500 block">
                          Giá mặc định:
                        </span>
                        <span className="font-medium text-blue-600">
                          {formatCurrency(formValues.defaultPrice)}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 block">
                          Giá theo món:
                        </span>
                        <span>{formatCurrency(formValues.pricePerItem)}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 block">
                          Giá theo kg:
                        </span>
                        <span>{formatCurrency(formValues.pricePerKg)}</span>
                      </div>
                    </div>
                  </div>

                  {/* <div className="space-y-4">
                    <h3 className="font-medium text-gray-500">
                      Thông tin xử lý
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-500 block">
                          Thời gian xử lý dự kiến:
                        </span>
                        <span>
                          {formatDateTime(formValues.estimatedProcessTime)}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 block">
                          Thời gian xử lý tiêu chuẩn:
                        </span>
                        <span>
                          {formatDateTime(formValues.standardProcessingTime)}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 block">
                          Trọng lượng tối thiểu:
                        </span>
                        <span>{formatWeight(formValues.minWeight)}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 block">
                          Trọng lượng tối đa:
                        </span>
                        <span>{formatWeight(formValues.maxWeight)}</span>
                      </div>
                    </div>
                  </div>
                </div> */}
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </>
  );
}
