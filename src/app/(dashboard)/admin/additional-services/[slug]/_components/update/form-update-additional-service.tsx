"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { TAdditionalServiceResponse } from "@/schema/VinLaudry/additional-service.schema";
import { formatDate } from "@/lib/utils";

type Props = {
  initialData: TAdditionalServiceResponse;
};

export function FormUpdateAdditionalService({ initialData }: Props) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(true);
        toast({
          title: "Sao chép thành công",
          description: "Đã sao chép ID vào clipboard",
        });
        setTimeout(() => setCopied(false), 2000);
      },
      () => {
        toast({
          title: "Lỗi",
          description: "Không thể sao chép ID",
          variant: "destructive",
        });
      }
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "InActive":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Active":
        return "Hoạt động";
      case "InActive":
        return "Không hoạt động";
      case "PENDING":
        return "Đang chờ";
      default:
        return status;
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div className="w-1/4">
          <Link href="/admin/additional-services">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-slate-100"
            >
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </Button>
          </Link>
        </div>
        <div className="text-center font-semibold text-xl">
          Chi tiết loại dịch vụ
        </div>
        <div className="w-1/4 flex justify-end">
          <Badge
            className={`text-sm font-medium ${getStatusColor(
              initialData.status
            )}`}
          >
            {getStatusLabel(initialData.status)}
          </Badge>
        </div>
      </div>

      <Card className="shadow-md border-accent-blur-200">
        <CardHeader className="bg-slate-50 pb-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Thông tin cơ bản</h3>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-slate-500 mb-1">
                  Tên Loại Dịch Vụ
                </div>
                <div className="text-base bg-slate-50 p-3 rounded-md border border-slate-200">
                  {initialData.name}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-slate-500 mb-1">
                  Mã Dịch Vụ
                </div>
                <div className="text-base bg-slate-50 p-3 rounded-md border border-slate-200 font-mono">
                  {initialData.serviceCode}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-slate-500 mb-1">
                  Trạng Thái
                </div>
                <div className="text-base bg-slate-50 p-3 rounded-md border border-slate-200">
                  <Badge className={`${getStatusColor(initialData.status)}`}>
                    {getStatusLabel(initialData.status)}
                  </Badge>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-slate-500 mb-1">
                  ID Đầy Đủ
                </div>
                <div className="text-base bg-slate-50 p-3 rounded-md border border-slate-200 font-mono flex justify-between items-center">
                  <span className="truncate">{initialData.id}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 p-1 h-auto"
                    onClick={() => copyToClipboard(initialData.id)}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-slate-500" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-medium text-slate-500 mb-1">
                Ngày Tạo
              </div>
              <div className="text-base bg-slate-50 p-3 rounded-md border border-slate-200">
                {formatDate(initialData.createdAt)}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-slate-500 mb-1">
                Cập Nhật Lần Cuối
              </div>
              <div className="text-base bg-slate-50 p-3 rounded-md border border-slate-200">
                {formatDate(initialData.updatedAt)}
              </div>
            </div>
          </div>

          {/* <div className="mt-8 flex justify-center">
            <Link href={`/admin/service-categories/${initialData.id}/edit`}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Chỉnh sửa loại dịch vụ
              </Button>
            </Link>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
