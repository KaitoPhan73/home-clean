"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, XCircle, Wallet, CreditCard, Clock, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { TransactionDetails } from "./transaction-details";
import { EnrichedTransaction } from "@/schema/transaction.schema";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner"; 

export const TransactionColumn: ColumnDef<EnrichedTransaction>[] = [
  {
    accessorKey: "userName",
    header: "Khách Hàng",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("userName")}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Số tiền",
    cell: ({ row }) => (
      <div className="font-medium text-right">
        {Number(row.getValue("amount")).toLocaleString("vi-VN")} VND
      </div>
    ),
  },
  {
    accessorKey: "walletName",
    header: "Ví",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("walletName")}</div>
    ),
  },
  {
    accessorKey: "paymentMethodName",
    header: "Phương thức",
    cell: ({ row }) => {
      const method = row.getValue("paymentMethodName") as string;
      return (
        <div className="flex items-center gap-2">
          {method === "Wallet" ? (
            <Wallet className="text-blue-500 h-4 w-4" />
          ) : (
            <CreditCard className="text-green-500 h-4 w-4" />
          )}
          <span className="font-medium">{method}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Loại",
    cell: ({ row }) => (
      <Badge
        variant={
          row.getValue("type") === "Spending" ? "destructive" : "default"
        }
        className="justify-center min-w-[80px]"
      >
        {row.getValue("type") === "Spending" ? "Chi Tiêu" : "Nạp Tiền"}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng Thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      
      return (
        <div className="flex justify-center">
          <Badge 
            className={`
              text-xs py-1 px-2 h-6 flex items-center gap-1
              ${status === "Success" ? 
                "bg-green-50 text-green-600 border-green-100 hover:bg-green-50" : 
                status === "Failed" ? 
                "bg-red-500 text-black-800 border-gray-200 hover:bg-gray-100" : 
                "bg-yellow-50 text-yellow-600 border-yellow-100 hover:bg-yellow-50"}
            `}
          >
            {status === "Success" ? (
              <CheckCircle className="h-3 w-3 text-green-500" />
            ) : status === "Failed" ? (
              <XCircle className="h-3 w-3 text-gray-600" />
            ) : (
              <Clock className="h-3 w-3 text-yellow-500" />
            )}
            <span className="text-xs">
              {status === "Success" ? "Thành công" : 
               status === "Failed" ? "Thất bại" : "Đang chờ"}
            </span>
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "transactionDate",
    header: "Ngày GD",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {new Date(row.getValue("transactionDate")).toLocaleDateString("vi-VN")}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8">
              Chi tiết
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <TransactionDetails data={row.original} />
          </DialogContent>
        </Dialog>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => {
                navigator.clipboard.writeText(row.original.id);
                toast.success("Đã sao chép ID");
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Sao chép ID</p>
          </TooltipContent>
        </Tooltip>
      </div>
    ),
  }
];
