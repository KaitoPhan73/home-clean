"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
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
  Copy,
} from "lucide-react";
import { EnrichedTransaction } from "@/schema/transaction.schema";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const TransactionDetails = ({ data }: { data: EnrichedTransaction }) => {
  const paymentMethodIcon =
    data.paymentMethodName === "Wallet" ? (
      <Wallet className="text-blue-500 h-5 w-5" />
    ) : (
      <CreditCard className="text-green-500 h-5 w-5" />
    );

  return (
    <div className="max-h-[90vh] overflow-auto">
      <div className="sticky top-0 z-10 bg-white p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {paymentMethodIcon}
            <h2 className="text-xl font-semibold">Chi tiết giao dịch</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
            onClick={() => {
              navigator.clipboard.writeText(data.id);
              toast.success("Đã sao chép ID giao dịch");
            }}
          >
            <Copy className="h-4 w-4 mr-1" />
            <span className="text-xs">Sao chép ID</span>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          ID: {data.id.substring(0, 12)}...
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Sidebar information */}
          <div className="md:col-span-4 space-y-6">
            <StatusCard
              type={data.type ?? ""}
              status={data.status ?? ""}
              amount={Number(data.amount) ?? 0}
              date={data.transactionDate ?? ""}
            />

            <Card className="overflow-hidden border border-gray-200">
              <CardHeader className="bg-gray-50 py-3 px-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-600" />
                  <span>Thông tin khách hàng</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <DetailItem
                    icon={<User className="h-4 w-4 text-gray-500" />}
                    label="Tên khách hàng"
                    value={<span className="font-medium">{data.userName}</span>}
                  />
                  <DetailItem
                    icon={<Wallet className="h-4 w-4 text-blue-500" />}
                    label="Ví"
                    value={
                      <span className="font-medium">{data.walletName}</span>
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="md:col-span-8 space-y-6">
            <Card className="border border-gray-200">
              <CardHeader className="bg-gray-50 py-3 px-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-600" />
                  <span>Thông tin giao dịch</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                  <DetailItem
                    icon={<Tag className="h-4 w-4 text-gray-500" />}
                    label="Mã giao dịch"
                    value={data.code}
                  />
                  <DetailItem
                    icon={<DollarSign className="h-4 w-4 text-gray-500" />}
                    label="Số tiền"
                    value={
                      <span
                        className={`font-semibold ${
                          data.type === "Spending"
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {Number(data.amount).toLocaleString("vi-VN")} VND
                      </span>
                    }
                  />
                  <DetailItem
                    icon={<Type className="h-4 w-4 text-gray-500" />}
                    label="Loại giao dịch"
                    value={
                      <Badge
                        variant={
                          data.type === "Spending" ? "destructive" : "default"
                        }
                        className={`text-xs ${
                          data.type === "Spending"
                            ? "bg-red-50 text-red-600 border-red-100 hover:bg-red-50"
                            : "bg-green-50 text-green-600 border-green-100 hover:bg-green-50"
                        }`}
                      >
                        {data.type === "Spending" ? "Chi tiêu" : "Thu nhập"}
                      </Badge>
                    }
                  />
                  <DetailItem
                    icon={<AlertCircle className="h-4 w-4 text-gray-500" />}
                    label="Phương thức thanh toán"
                    value={
                      <div className="flex items-center gap-1">
                        {paymentMethodIcon}
                        <span>{data.paymentMethodName}</span>
                      </div>
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardHeader className="bg-gray-50 py-3 px-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <NotebookPen className="h-4 w-4 text-gray-600" />
                  <span>Thông tin bổ sung</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                  <DetailItem
                    icon={<FileText className="h-4 w-4 text-gray-500" />}
                    label="Ghi chú"
                    value={data.note || "Không có ghi chú"}
                  />
                  <DetailItem
                    icon={<Info className="h-4 w-4 text-gray-500" />}
                    label="ID đơn hàng"
                    value={data.orderId || "Không có"}
                  />
                  <DetailItem
                    icon={<Tag className="h-4 w-4 text-gray-500" />}
                    label="ID danh mục"
                    value={data.categoryId || "Không có"}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardHeader className="bg-gray-50 py-3 px-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="h-4 w-4 text-gray-600" />
                  <span>Thông tin hệ thống</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                  <DetailItem
                    icon={<Calendar className="h-4 w-4 text-gray-500" />}
                    label="Ngày tạo"
                    value={format(new Date(data.createdAt), "PPP", {
                      locale: vi,
                    })}
                  />
                  <DetailItem
                    icon={<Clock className="h-4 w-4 text-gray-500" />}
                    label="Thời gian tạo"
                    value={format(new Date(data.createdAt), "p", {
                      locale: vi,
                    })}
                  />
                  <DetailItem
                    icon={<Calendar className="h-4 w-4 text-gray-500" />}
                    label="Ngày cập nhật"
                    value={format(new Date(data.updatedAt), "PPP", {
                      locale: vi,
                    })}
                  />
                  <DetailItem
                    icon={<Clock className="h-4 w-4 text-gray-500" />}
                    label="Thời gian cập nhật"
                    value={format(new Date(data.updatedAt), "p", {
                      locale: vi,
                    })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusCard = ({
  type,
  status,
  amount,
  date,
}: {
  type: string;
  status: string;
  amount: number;
  date: string;
}) => {
  const statusIcon =
    status === "Success" ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : status === "Failed" ? (
      <XCircle className="h-5 w-5 text-red-500" />
    ) : (
      <Clock className="h-5 w-5 text-yellow-500" />
    );

  const statusText =
    status === "Success"
      ? "Thành công"
      : status === "Failed"
      ? "Thất bại"
      : "Đang chờ";

  const statusClass =
    status === "Success"
      ? "bg-green-50 border-green-100"
      : status === "Failed"
      ? "bg-red-50 border-red-100"
      : "bg-yellow-50 border-yellow-100";

  return (
    <Card className={`overflow-hidden border ${statusClass}`}>
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <Badge
              className={`
                ${
                  status === "Success"
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : status === "Failed"
                    ? "bg-red-100 text-red-800 hover:bg-red-100"
                    : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                }
              `}
            >
              <div className="flex items-center gap-1">
                {statusIcon}
                <span>{statusText}</span>
              </div>
            </Badge>
            <Badge
              variant={type === "Spending" ? "destructive" : "default"}
              className={`
                ${
                  type === "Spending"
                    ? "bg-red-50 text-red-600 border-red-100 hover:bg-red-50"
                    : "bg-green-50 text-green-600 border-green-100 hover:bg-green-50"
                }
              `}
            >
              {type === "Spending" ? "Chi Tiêu" : "Nạp Tiền"}
            </Badge>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Số tiền</p>
            <h3
              className={`text-2xl font-bold ${
                type === "Spending" ? "text-red-600" : "text-green-600"
              }`}
            >
              {Number(amount).toLocaleString("vi-VN")} VND
            </h3>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Thời gian giao dịch</p>
            <div className="flex items-center gap-1 text-gray-700">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(date), "PPP", { locale: vi })}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-700 mt-1">
              <Clock className="h-4 w-4" />
              <span>{format(new Date(date), "p", { locale: vi })}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 w-5">{icon}</div>
    <div className="flex-1">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <div className="text-sm text-gray-900">
        {typeof value === "string" ? <p>{value}</p> : value}
      </div>
    </div>
  </div>
);
