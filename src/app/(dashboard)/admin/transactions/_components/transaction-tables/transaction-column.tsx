"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle,
  XCircle,
  Wallet,
  CreditCard,
  Clock,
  Copy,
  Eye,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { TransactionDetails } from "./transaction-details";
import { EnrichedTransaction } from "@/schema/transaction.schema";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

export const TransactionColumn: ColumnDef<EnrichedTransaction>[] = [
  {
    accessorKey: "userName",
    header: () => <div className="text-gray-700 font-semibold">Khách Hàng</div>,
    cell: ({ row }) => (
      <div className="font-medium text-gray-800 flex items-center">
        <User className="text-gray-500 h-4 w-4 mr-2" />
        {row.getValue("userName")}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: () => (
      <div className="text-gray-700 font-semibold text-right">Số Tiền</div>
    ),
    cell: ({ row }) => {
      const amount = Number(row.getValue("amount"));
      const type = row.original.type as string;

      return (
        <div
          className={`font-medium text-right ${
            type === "Spending" ? "text-red-600" : "text-green-600"
          }`}
        >
          {amount.toLocaleString("vi-VN")} VND
          <span className="ml-1 text-xs">
            {type === "Spending" ? "(Chi)" : "(Thu)"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "walletName",
    header: () => <div className="text-gray-700 font-semibold">Ví</div>,
    cell: ({ row }) => (
      <div className="font-medium text-gray-800 flex items-center">
        <Wallet className="text-blue-500 h-4 w-4 mr-2" />
        {row.getValue("walletName")}
      </div>
    ),
  },
  {
    accessorKey: "paymentMethodName",
    header: () => (
      <div className="text-gray-700 font-semibold">Phương Thức</div>
    ),
    cell: ({ row }) => {
      const method = row.getValue("paymentMethodName") as string;
      return (
        <div className="flex items-center gap-2">
          {method === "Wallet" ? (
            <Wallet className="text-blue-500 h-4 w-4" />
          ) : (
            <CreditCard className="text-green-500 h-4 w-4" />
          )}
          <span className="font-medium text-gray-800">{method}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: () => (
      <div className="text-gray-700 font-semibold text-center">Loại</div>
    ),
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return (
        <Badge
          variant={type === "Spending" ? "destructive" : "default"}
          className={`justify-center min-w-[80px] ${
            type === "Spending"
              ? "bg-red-50 text-red-600 border-red-100 hover:bg-red-50"
              : "bg-green-50 text-green-600 border-green-100 hover:bg-green-50"
          }`}
        >
          {type === "Spending" ? "Chi Tiêu" : "Nạp Tiền"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="text-gray-700 font-semibold text-center">Trạng Thái</div>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      return (
        <div className="flex justify-center">
          <Badge
            className={`
              text-xs py-1 px-2 h-6 flex items-center gap-1
              ${
                status === "Success"
                  ? "bg-green-50 text-green-600 border-green-100 hover:bg-green-50"
                  : status === "Failed"
                  ? "bg-red-50 text-red-600 border-red-100 hover:bg-red-50"
                  : "bg-yellow-50 text-yellow-600 border-yellow-100 hover:bg-yellow-50"
              }
            `}
          >
            {status === "Success" ? (
              <CheckCircle className="h-3 w-3 text-green-500" />
            ) : status === "Failed" ? (
              <XCircle className="h-3 w-3 text-red-500" />
            ) : (
              <Clock className="h-3 w-3 text-yellow-500" />
            )}
            <span className="text-xs font-medium">
              {status === "Success"
                ? "Thành công"
                : status === "Failed"
                ? "Thất bại"
                : "Đang chờ"}
            </span>
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "transactionDate",
    header: () => <div className="text-gray-700 font-semibold">Ngày GD</div>,
    cell: ({ row }) => {
      const date = new Date(row.getValue("transactionDate"));
      const formattedDate = date.toLocaleDateString("vi-VN");
      const formattedTime = date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });

      return (
        <div className="flex flex-col">
          <div className="text-sm font-medium text-gray-800">
            {formattedDate}
          </div>
          <div className="text-xs text-gray-500">{formattedTime}</div>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => (
      <div className="text-gray-700 font-semibold text-center">Thao Tác</div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 hover:text-blue-700"
            >
              <Eye className="h-3 w-3 mr-1" />
              Chi tiết
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl p-0">
            <DialogTitle></DialogTitle>
            <TransactionDetails data={row.original} />
          </DialogContent>
        </Dialog>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              onClick={() => {
                navigator.clipboard.writeText(row.original.id);
                toast.success("Đã sao chép ID giao dịch", {
                  description: "ID đã được sao chép vào clipboard",
                });
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Sao chép ID giao dịch</p>
          </TooltipContent>
        </Tooltip>
      </div>
    ),
  },
];
