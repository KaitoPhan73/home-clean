"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Wallet,
  CreditCard,
  User,
  Calendar,
  Clock,
  FileText,
  Tag,
  Info,
  CheckCircle,
  XCircle,
  DollarSign,
  Type,
  AlertCircle,
  NotebookPen,
} from "lucide-react";
import { EnrichedTransaction } from "@/schema/transaction.schema";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";

export const TransactionDetails = ({ data }: { data: EnrichedTransaction }) => {
  const paymentMethodIcon =
    data.paymentMethodName === "Wallet" ? (
      <Wallet className="text-blue-500 h-5 w-5" />
    ) : (
      <CreditCard className="text-green-500 h-5 w-5" />
    );

  const statusVariant =
    data.status === "Success"
      ? "success"
      : data.status === "Failed"
      ? "failed"
      : "pending";

  return (
    <>
      <DialogTitle className="sr-only">Chi tiết giao dịch</DialogTitle>
      <DialogDescription className="sr-only">
        Thông tin chi tiết về giao dịch
      </DialogDescription>
      <Card className="border-none shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-2xl font-semibold">
            {paymentMethodIcon}
            <span>Chi tiết giao dịch</span>
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            ID: {data.id}
          </CardDescription>
        </CardHeader>

        <Separator className="mb-6" />

        <CardContent className="-space-y-0">
          {/* Vùng thông tin cơ bản */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailSection
              title="Thông tin giao dịch"
              icon={<FileText className="h-5 w-5" />}
            >
              <DetailItem
                icon={<Tag className="h-4 w-4" />}
                label="Mã giao dịch"
                value={data.code}
              />
              <DetailItem
                icon={<Calendar className="h-4 w-4" />}
                label="Thời gian"
                value={format(new Date(data.transactionDate), "PPPPp", {
                  locale: vi,
                })}
              />
              <DetailItem
                icon={<DollarSign className="h-4 w-4" />}
                label="Số tiền"
                value={
                  <span className="font-semibold text-primary">
                    {Number(data.amount).toLocaleString("vi-VN")} VND
                  </span>
                }
              />
            </DetailSection>

            <DetailSection
              title="Trạng thái"
              icon={<Info className="h-5 w-5" />}
            >
              <DetailItem
                icon={<Type className="h-4 w-4" />}
                label="Loại giao dịch"
                value={
                  <Badge
                    variant={
                      data.type === "Spending" ? "destructive" : "default"
                    }
                    className="text-sm"
                  >
                    {data.type === "Spending" ? "Chi tiêu" : "Thu nhập"}
                  </Badge>
                }
              />
              <DetailItem
                icon={
                  data.status === "Success" ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : data.status === "Failed" ? (
                    <XCircle className="h-4 w-4 text-destructive" />
                  ) : (
                    <Clock className="h-4 w-4 text-yellow-500" />
                  )
                }
                label="Trạng thái"
                value={
                  <Badge
                    className={`text-sm ${
                      statusVariant === "success"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : statusVariant === "failed"
                        ? "bg-gray-900 text-white hover:bg-gray-900"
                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                    }`}
                  >
                    {data.status === "Success"
                      ? "Thành công"
                      : data.status === "Failed"
                      ? "Thất bại"
                      : "Đang chờ"}
                  </Badge>
                }
              />
              <DetailItem
                icon={<User className="h-4 w-4" />}
                label="Khách hàng"
                value={<span className="font-medium">{data.userName}</span>}
              />
            </DetailSection>
          </div>

          {/* Vùng thông tin bổ sung */}
          <DetailSection
            title="Thông tin bổ sung"
            icon={<NotebookPen className="h-5 w-5" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <DetailItem
                  icon={<FileText className="h-4 w-4" />}
                  label="Ghi chú"
                  value={data.note || "Không có ghi chú"}
                />
                <DetailItem
                  icon={<AlertCircle className="h-4 w-4" />}
                  label="Phương thức"
                  value={data.paymentMethodName}
                />
              </div>
              <div className="space-y-4">
                <DetailItem label="ID đơn hàng" value={data.orderId} />
                <DetailItem label="ID danh mục" value={data.categoryId} />
              </div>
            </div>
          </DetailSection>

          {/* Vùng metadata */}
          <DetailSection
            title="Thông tin hệ thống"
            icon={<Info className="h-5 w-5" />}
            variant="secondary"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailItem
                label="Ngày tạo"
                value={format(new Date(data.createdAt), "PPPPp", {
                  locale: vi,
                })}
              />
              <DetailItem
                label="Ngày cập nhật"
                value={format(new Date(data.updatedAt), "PPPPp", {
                  locale: vi,
                })}
              />
            </div>
          </DetailSection>
        </CardContent>
      </Card>
    </>
  );
};

const DetailSection = ({
  title,
  icon,
  children,
  variant = "default",
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  variant?: "default" | "secondary";
}) => (
  <div className={variant === "secondary" ? "bg-muted/50 p-4 rounded-lg" : ""}>
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <h3 className="font-semibold text-lg">{title}</h3>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-start gap-4">
    <div className="mt-0.5">{icon || <div className="h-4 w-4" />}</div>
    <div className="flex-1">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <div className="text-base">
        {typeof value === "string" ? <p>{value}</p> : value}
      </div>
    </div>
  </div>
);
