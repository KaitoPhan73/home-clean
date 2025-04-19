/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { GroupCreateSchema, TGroupCreateRequest } from "@/schema/group.schema";
import { createGroup } from "@/apis/group";
import { getAllClusters } from "@/apis/cluster";
import { getAllServices } from "@/apis/service";
import { getAllAreas } from "@/apis/area";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Users, Building, Map, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getAllManagers } from "@/apis/manager";
import { handleErrorApi } from "@/lib/utils";

export function CredenzaCreateGroup({ className }: { className?: string }) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [areaOptions, setAreaOptions] = useState<
    { id: string; name: string }[]
  >([]);
  const [managerOptions, setManagerOptions] = useState<
    { id: string; name: string }[]
  >([]);
  const [serviceOptions, setServiceOptions] = useState<
    { id: string; name: string }[]
  >([]);
  const [clusterOptions, setClusterOptions] = useState<
    { id: string; name: string }[]
  >([]);

  // Trạng thái để hiển thị các mục đã chọn
  const [selectedClusters, setSelectedClusters] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const form = useForm<TGroupCreateRequest>({
    resolver: zodResolver(GroupCreateSchema),
    defaultValues: {
      name: "",
      code: "",
      areaId: "",
      managerId: "",
      clusterIds: [],
      serviceId: "",
    },
  });

  // Lấy dữ liệu khi mở form
  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  // Theo dõi các giá trị đã chọn
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "clusterIds" || name === undefined) {
        setSelectedClusters(
          (value.clusterIds || []).filter(
            (id): id is string => id !== undefined
          )
        );
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [
        areasResponse,
        managersResponse,
        servicesResponse,
        clustersResponse,
      ] = await Promise.all([
        getAllAreas(),
        getAllManagers(),
        getAllServices(),
        getAllClusters(),
      ]);

      if (areasResponse?.payload?.items) {
        setAreaOptions(areasResponse.payload.items);
      }

      if (managersResponse?.payload?.items) {
        setManagerOptions(
          managersResponse.payload.items.map((manager) => ({
            id: manager.id,
            name: manager.fullName, // Đổi từ fullName thành name
          }))
        );
      }

      if (servicesResponse?.payload?.items) {
        setServiceOptions(servicesResponse.payload.items);
      }

      if (clustersResponse?.payload?.items) {
        setClusterOptions(clustersResponse.payload.items);
      }
    } catch (error: any) {
      const errorMessage = JSON.parse(error.message);
      toast({
        title: "Lỗi",
        description: `Có lỗi xảy ra: ${errorMessage.description}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: TGroupCreateRequest) => {
    try {
      setIsLoading(true);
      console.log("Submitting form data:", data);

      const formattedData = {
        ...data,
        clusterIds:
          data.clusterIds && data.clusterIds.length > 0
            ? (data.clusterIds as [string, ...string[]])
            : undefined,
      };

      const response = await createGroup(formattedData);

      if (response.status === 201) {
        toast({
          title: "Thành công",
          description: "Nhóm đã được tạo thành công.",
        });
        form.reset();
        setIsOpen(false);
      }
    } catch (error: any) {
      handleErrorApi({
        error,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm trợ giúp để lấy tên từ id
  const getNameById = (id: string, options: { id: string; name: string }[]) => {
    const option = options.find((opt) => opt.id === id);
    return option ? option.name : id;
  };

  // Xóa một cluster đã chọn
  const removeCluster = (id: string) => {
    const newValues = selectedClusters.filter((clusterId) => clusterId !== id);
    form.setValue("clusterIds", newValues, { shouldValidate: true });
  };

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaTrigger asChild className={className}>
        <Button variant="default" className="flex items-center gap-1">
          <Plus size={16} />
          <span>Tạo Nhóm</span>
        </Button>
      </CredenzaTrigger>
      <CredenzaContent className="sm:max-xl-[100px]">
        <div className="max-h-[90vh] overflow-y-auto px-2">
          <CredenzaHeader className="pb-4">
            <CredenzaTitle className="text-xl font-bold flex items-center gap-2">
              <Users className="h-5 w-5" /> Tạo Nhóm Mới
            </CredenzaTitle>
            <CredenzaDescription>
              Điền thông tin để tạo nhóm mới trong hệ thống
            </CredenzaDescription>
          </CredenzaHeader>
          <Separator className="my-2" />

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 py-4"
            >
              <div className="grid grid-cols-6 sm:grid-cols-2 gap-5">
                {/* Thông tin cơ bản */}
                <Card className="p-4 col-span-1 sm:col-span-2 bg-slate-50">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Building className="h-4 w-4" /> Thông tin cơ bản
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Tên Nhóm</Label>
                          <FormControl>
                            <Input {...field} placeholder="Nhập tên nhóm..." />
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
                          <Label>Mã Nhóm</Label>
                          <FormControl>
                            <Input {...field} placeholder="Nhập mã nhóm..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>

                {/* Khu vực và quản lý */}
                <Card className="p-4 col-span-1 sm:col-span-2 bg-slate-50">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Map className="h-4 w-4" /> Vị trí & Quản lý
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="areaId"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Khu vực</Label>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isLoading}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Chọn khu vực" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {areaOptions.length === 0 ? (
                                <SelectItem value="loading" disabled>
                                  Không có dữ liệu khu vực
                                </SelectItem>
                              ) : (
                                areaOptions.map((area) => (
                                  <SelectItem key={area.id} value={area.id}>
                                    {area.name}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="managerId"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Quản Lí</Label>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isLoading}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Chọn quản lí" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {managerOptions.length === 0 ? (
                                <SelectItem value="loading" disabled>
                                  Không có dữ liệu quản lý
                                </SelectItem>
                              ) : (
                                managerOptions.map((manager) => (
                                  <SelectItem
                                    key={manager.id}
                                    value={manager.id}
                                  >
                                    {manager.name}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="serviceId"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Dịch Vụ</Label>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isLoading}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Chọn loại dịch vụ" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {serviceOptions.length === 0 ? (
                                <SelectItem value="loading" disabled>
                                  Không có dữ liệu quản lý
                                </SelectItem>
                              ) : (
                                serviceOptions.map((service) => (
                                  <SelectItem
                                    key={service.id}
                                    value={service.id}
                                  >
                                    {service.name}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>

                {/* Cụm khu vực */}
                <Card className="p-4 col-span-1 sm:col-span-2 bg-slate-50">
                  <FormField
                    control={form.control}
                    name="clusterIds"
                    render={() => (
                      <FormItem>
                        <Label className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          Cụm Khu Vực
                        </Label>

                        {/* Hiển thị các cluster đã chọn */}
                        <div className="flex flex-wrap gap-2 mb-2 min-h-8">
                          {selectedClusters.length > 0 ? (
                            selectedClusters.map((id) => (
                              <Badge
                                key={id}
                                variant="secondary"
                                className="flex items-center gap-1 bg-blue-100"
                              >
                                {getNameById(id, clusterOptions)}
                                <X
                                  size={14}
                                  className="cursor-pointer hover:text-red-500 transition-colors"
                                  onClick={() => removeCluster(id)}
                                />
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500 italic">
                              Chưa chọn cụm nào
                            </span>
                          )}
                        </div>

                        <div className="border rounded-md bg-white p-2 max-h-40 overflow-y-auto shadow-sm">
                          {clusterOptions.length === 0 ? (
                            <div className="text-sm text-center py-2 text-gray-500">
                              {isLoading
                                ? "Đang tải..."
                                : "Không có dữ liệu cụm khu vực"}
                            </div>
                          ) : (
                            clusterOptions.map((cluster) => (
                              <div
                                key={cluster.id}
                                className="flex items-center space-x-2 my-1.5 hover:bg-slate-100 p-1 rounded"
                              >
                                <Checkbox
                                  id={`cluster-${cluster.id}`}
                                  checked={selectedClusters.includes(
                                    cluster.id
                                  )}
                                  onCheckedChange={(checked) => {
                                    const currentValue =
                                      form.getValues("clusterIds") || [];
                                    const newValue = checked
                                      ? [...currentValue, cluster.id]
                                      : currentValue.filter(
                                          (id) => id !== cluster.id
                                        );
                                    form.setValue("clusterIds", newValue, {
                                      shouldValidate: true,
                                    });
                                  }}
                                  disabled={isLoading}
                                />
                                <Label
                                  htmlFor={`cluster-${cluster.id}`}
                                  className="cursor-pointer text-sm flex-1"
                                >
                                  {cluster.name}
                                </Label>
                              </div>
                            ))
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1.5">
                          Chọn một hoặc nhiều cụm khu vực
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Card>
              </div>

              <Separator className="my-2" />

              <CredenzaFooter className="gap-2 pt-2">
                <Button type="submit" disabled={isLoading} className="min-w-24">
                  {isLoading ? "Đang xử lý..." : "Tạo Nhóm"}
                </Button>
                <CredenzaClose asChild>
                  <Button variant="outline" type="button">
                    Đóng
                  </Button>
                </CredenzaClose>
              </CredenzaFooter>
            </form>
          </Form>
        </div>
      </CredenzaContent>
    </Credenza>
  );
}
