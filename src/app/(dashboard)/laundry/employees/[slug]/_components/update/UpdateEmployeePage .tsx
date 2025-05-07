/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, UserCog, ArrowLeft, Save } from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { getEmployeeProfileById, updateEmployee } from "@/apis/laudry/employee";
import { TUpdateEmployeeRequest, UpdateEmployeeSchema } from "@/schema/VinLaudry/employee.schema";
import { getEmployeeById } from "@/apis/laudry/employee";
import { handleErrorApi } from "@/lib/utils";

interface UpdateEmployeePageProps {
  slug: string;
  accessToken?: string;
}

const UpdateEmployeePage = ({ slug, accessToken }: UpdateEmployeePageProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [employee, setEmployee] = useState<TUpdateEmployeeRequest | null>(null);

  const form = useForm<TUpdateEmployeeRequest>({
    resolver: zodResolver(UpdateEmployeeSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      address: "",
    }
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await getEmployeeProfileById(slug, accessToken);
        setEmployee(data.payload);
        form.reset({
          fullName: data.payload.fullName,
          phone: data.payload.phone,
          email: data.payload.email,
          address: data.payload.address,
        });
        setLoading(false);
      } catch (error : any) {
        handleErrorApi({
          error,
        });
      }
    };

    if (slug) {
      fetchEmployee();
    }
  }, [slug, form, accessToken]);

  const onSubmit = async (data: TUpdateEmployeeRequest) => {
    try {
      setSubmitting(true);
      await updateEmployee(slug, {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        address: data.address,
        createdAt: employee?.createdAt || "",
        updatedAt: "",
        status: employee?.status || "",
        id: slug,
        employeeCode: employee?.employeeCode || "",
        position: employee?.position || null,
        role: employee?.role || "",
        hireDate: employee?.hireDate || ""
      }, accessToken);
      toast.success("Cập nhật nhân viên thành công");
      router.push("/laundry/employees");
      router.refresh();
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi cập nhật nhân viên");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full bg-muted/60 hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Cập nhật thông tin nhân viên</h1>
        </div>
      </div>

      <Card className="shadow-md">
        <CardHeader className="bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <UserCog className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Thông tin nhân viên</CardTitle>
              <CardDescription>Cập nhật thông tin cá nhân của nhân viên</CardDescription>
            </div>
          </div>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="pt-6 pb-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập họ và tên" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập số điện thoại" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Nhập địa chỉ email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Separator className="my-6" />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập địa chỉ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between bg-muted/10 mt-4 px-6 py-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Hủy
              </Button>
              <Button 
                type="submit" 
                disabled={submitting}
                className="gap-2"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                <Save className="h-4 w-4 mr-1" />
                Lưu thay đổi
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default UpdateEmployeePage;