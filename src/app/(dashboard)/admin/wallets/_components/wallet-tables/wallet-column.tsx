"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Wallet, Copy, Eye, EyeOff, Coins } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { TWalletResponse } from "@/schema/wallet.schema";
import { HoverButton } from "@/components/hover-button";

const STATUS_CONFIG = {
  Active: {
    label: "Đang hoạt động",
    className: "bg-green-100 text-green-700 hover:bg-green-100",
  },
  Inactive: {
    label: "Ngừng hoạt động",
    className: "bg-red-100 text-red-700 hover:bg-red-100",
  },
  Pending: {
    label: "Chờ xử lý",
    className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  },
};

const WALLET_TYPE_CONFIG = {
  Personal: {
    label: "Ví Cá Nhân",
    className: "bg-blue-100 text-blue-500 hover:bg-blue-100",
  },
  Shared: {
    label: "Ví Chung",
    className: "bg-purple-100 text-green-500 hover:bg-purple-100",
  },
};

export const WalletColumn: ColumnDef<TWalletResponse>[] = [
  {
    accessorKey: "name",
    header: "Tên ví",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Wallet className="h-4 w-4 text-blue-500" />
        <span>{row.getValue("name")}</span>
      </div>
    ),
  },
  {
    accessorKey: "balance",
    header: "Số dư",
    cell: ({ row }) => {
      const balanceValue = row.getValue("balance");
      const amount =
        typeof balanceValue === "number"
          ? balanceValue
          : typeof balanceValue === "string"
          ? parseFloat(balanceValue) || 0
          : 0;

      const formatted = new Intl.NumberFormat("vi-VN").format(amount);

      return (
        <div className="flex items-center text-green-600 text-sm font-semibold">
          <Coins className="h-4 w-4 mr-1" />
          {formatted} Point
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Loại ví",
    cell: ({ row }) => {
      const type = row.getValue("type") as keyof typeof WALLET_TYPE_CONFIG;
      const config = WALLET_TYPE_CONFIG[type];
      return <Badge className={config.className}>{config.label}</Badge>;
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as keyof typeof STATUS_CONFIG;
      const config = STATUS_CONFIG[status];
      return <Badge className={config.className}>{config.label}</Badge>;
    },
  },
  {
    accessorKey: "extraField",
    header: "Ghi chú",
    cell: ({ row }) => row.getValue("extraField") || "—",
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => (
      <div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                navigator.clipboard.writeText(row.original.id);
                toast.success("Đã sao chép ID ví");
              }}
            >
              <Copy className="h-4 w-4" />
              <span className="sr-only">Sao chép ID ví</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Sao chép ID ví</p>
          </TooltipContent>
        </Tooltip>
        <HoverButton
          href={`wallets/${row.original.id}`}
          defaultNode={
            <div className="flex items-center gap-2">
              <EyeOff className="h-4 w-4" />
            </div>
          }
          hoverNode={
            <div className="flex items-center gap-2 text-blue-500">
              <Eye className="h-4 w-4" />
            </div>
          }
          tooltipText="Xem chi tiết"
          size="icon"
        />
      </div>
    ),
  },
];
