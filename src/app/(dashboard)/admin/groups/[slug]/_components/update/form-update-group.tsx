/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { Suspense } from "react";
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
import { updateGroup } from "@/apis/group";
import { useRouter } from "next/navigation";
import {
  GroupUpdateSchema,
  TGroupResponse,
  TUpdateGroupRequest,
} from "@/schema/group.schema";
import { ResponsiveComboBoxManagerAsync } from "@/components/features/updateCombobox/responsive-combobox-manager-async";
import { ResponsiveComboBoxAreaAsync } from "@/components/features/updateCombobox/responsive-combobox-area-async";
import { ResponsiveComboBoxServiceAsync } from "@/components/features/updateCombobox/responsive-combobox-service-async";
import { ResponsiveComboBoxClusterAsync } from "@/components/features/updateCombobox/responsive-combobox-cluster-async";
import { TServiceResponse } from "@/schema/service.schema";
import { TAreaResponse } from "@/schema/area.schema";
import { TClusterResponse } from "@/schema/cluster.schema";
import { TManagerResponse } from "@/schema/manager.schema";
import { handleErrorApi } from "@/lib/utils";

type Props = {
  initialData: TGroupResponse;
  services: TServiceResponse[];
  areas: TAreaResponse[];
  clusters: TClusterResponse[];
  managers?: TManagerResponse[];
  currentManagers?: TManagerResponse[];
};

export function FormUpdateGroup({
  initialData,
  areas,
  clusters,
  services,
  managers,
  currentManagers,
}: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<TUpdateGroupRequest>({
    resolver: zodResolver(GroupUpdateSchema),
    defaultValues: {
      ...initialData,
      serviceId: initialData.serviceIds[0],
    },
  });

  const onSubmit = async (data: TUpdateGroupRequest) => {
    try {
      const response = await updateGroup(initialData.id, data);
      if (response.status === 200) {
        toast({
          title: "Cập nhật thành công",
          description: "Đã cập nhật thông tin nhóm thành công.",
        });
        router.refresh();
      }
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };

  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-0 px-4 md:px-0 md:py-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="name">Tên Nhóm</Label>
                <FormControl>
                  <Input
                    placeholder="Nhập tên nhóm..."
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
                <Label htmlFor="code">Mã Nhóm</Label>
                <FormControl>
                  <Input
                    placeholder="Nhập mã nhóm..."
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
            name="areaId"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="areaId">Khu Vực</Label>
                <FormControl>
                  <ResponsiveComboBoxAreaAsync
                    value={field.value}
                    onChange={field.onChange}
                    className="w-full"
                    data={areas}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="managerId"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="managerId">Quản Lý</Label>
                <FormControl>
                  <ResponsiveComboBoxManagerAsync
                    value={field.value}
                    onChange={field.onChange}
                    className="w-full"
                    data={managers}
                    currentData={currentManagers}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="serviceId"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="serviceIds">Dịch Vụ</Label>
                <Suspense fallback={<div>Loading...</div>}>
                  <FormControl>
                    <ResponsiveComboBoxServiceAsync
                      value={field.value}
                      onChange={field.onChange}
                      className="w-full"
                      data={services}
                    />
                  </FormControl>
                </Suspense>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="clusterIds"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="clusterIds">Cụm</Label>
                <FormControl>
                  <ResponsiveComboBoxClusterAsync
                    value={field.value}
                    onChange={(values) => field.onChange(values)}
                    className="w-full"
                    isMultiSelect
                    data={clusters}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end mt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
