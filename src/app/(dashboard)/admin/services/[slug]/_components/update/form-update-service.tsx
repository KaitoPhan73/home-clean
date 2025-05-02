/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { statusOptions } from "@/constants/config";
import { ServiceSchema, TUpdateServiceRequest } from "@/schema/service.schema";
import { updateService } from "@/apis/service";
import { Textarea } from "@/components/ui/textarea";
import { 
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";

type Props = {
  initialData: TUpdateServiceRequest;
};

const generateServiceCode = (name: string): string => {
  if (!name) return "";
  const words = name.split(/\s+/);
  return words
    .map(word => 
      word.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .charAt(0)
        .toUpperCase()
    )
    .join("");
};

export function FormUpdateService({ initialData }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const [sections, setSections] = useState({
    basic: true,
    business: false,
    operation: false,
    status: false,
    content: false,
  });

  const form = useForm<TUpdateServiceRequest>({
    resolver: zodResolver(ServiceSchema),
    defaultValues: { ...initialData},
  });

  const serviceName = form.watch("name");

  useEffect(() => {
    const currentServiceCode = form.getValues("serviceCode");
    if (!currentServiceCode || currentServiceCode === generateServiceCode(initialData.name)) {
      form.setValue("serviceCode", generateServiceCode(serviceName));
    }
  }, [serviceName, form, initialData.name]);

  const onSubmit = async (data: TUpdateServiceRequest) => {
    try {
      const response = await updateService(initialData.id, data);
      if (response.status === 200) {
        toast({
          title: "Cập nhật thành công",
          description: "Đã cập nhật dịch vụ thành công.",
        });
        router.refresh();
      } else {
        toast({
          title: "Lỗi",
          description: "Không thể cập nhật dịch vụ",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Có lỗi xảy ra khi cập nhật dịch vụ: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const { isSubmitting, errors } = form.formState;
  const hasErrors = Object.keys(errors).length > 0;

  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-md shadow-sm">
      <div className="border-b bg-muted/20 p-4">
        <h2 className="text-xl font-bold">Cập nhật dịch vụ</h2>
      </div>
      <div className="p-6">
        {hasErrors && (
          <div className="mb-6 flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <p>Vui lòng kiểm tra lại thông tin</p>
          </div>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-between font-semibold"
                onClick={() => toggleSection("basic")}
                type="button"
              >
                <span>Thông tin cơ bản</span>
                {sections.basic ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              {sections.basic && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên dịch vụ</FormLabel>
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
                        <FormLabel>Mã dịch vụ</FormLabel>
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
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-between font-semibold"
                onClick={() => toggleSection("business")}
                type="button"
              >
                <span>Số điểm và ưu tiên</span>
                {sections.business ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              {sections.business && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-6">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Điểm dịch vụ</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Nhập điểm..."
                            {...field}
                            disabled={isSubmitting}
                            min="0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giảm giá (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Nhập % giảm giá..."
                            {...field}
                            disabled={isSubmitting}
                            min="0"
                            max="100"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                  <FormField
                    control={form.control}
                    name="prorityLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cấp độ ưu tiên</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Nhập cấp độ..."
                            {...field}
                            disabled={isSubmitting}
                            min="0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-between font-semibold"
                onClick={() => toggleSection("operation")}
                type="button"
              >
                <span>Thông tin vận hành</span>
                {sections.operation ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              {sections.operation && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-6">
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thời lượng</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Nhập thời lượng..."
                            {...field}
                            disabled={isSubmitting}
                            min="1"
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
                        <FormLabel>Sức chứa tối đa</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Nhập sức chứa..."
                            {...field}
                            disabled={isSubmitting}
                            min="1"
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
                        <FormLabel>Mã code dịch vụ</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Mã code tự động..."
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-between font-semibold"
                onClick={() => toggleSection("status")}
                type="button"
              >
                <span>Trạng thái và hiển thị</span>
                {sections.status ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              {sections.status && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-6">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trạng thái</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isSubmitting}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {statusOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
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
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dịch vụ nổi bật</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(value === "true")}
                          defaultValue={field.value.toString()}
                          disabled={isSubmitting}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="true">Nổi bật</SelectItem>
                            <SelectItem value="false">Không nổi bật</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isAvailable"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Có sẵn</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(value === "true")}
                          defaultValue={field.value.toString()}
                          disabled={isSubmitting}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="true">Có sẵn</SelectItem>
                            <SelectItem value="false">Không có sẵn</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-between font-semibold"
                onClick={() => toggleSection("content")}
                type="button"
              >
                <span>Nội dung và hình ảnh</span>
                {sections.content ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              {sections.content && (
                <div className="grid grid-cols-1 gap-4 pl-6">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mô tả dịch vụ</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Nhập mô tả..."
                            {...field}
                            disabled={isSubmitting}
                            className="min-h-[100px] resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <div className="pt-4 border-t flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => router.back()} 
                disabled={isSubmitting}
                type="button"
              >
                Hủy
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}