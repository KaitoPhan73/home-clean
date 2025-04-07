/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Eye,
  Trash2,
  MoreHorizontal,
  Package,
  Calendar,
  Clock,
  CreditCard,
  User,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatCurrency } from "@/app/(dashboard)/manager/order-assignment/_components/order-management/OrderDetailsPopup/utils";
import { useRouter } from "next/navigation";
import { TOrderLaundryResponse } from "@/schema/VinLaudry/laundry-order";

enum OrderStatusEnum {
  Draft = 0,
  PendingPayment = 1,
  Processing = 2,
  Completed = 3,
  Cancelled = 4,
  Paid = 5,
}

// Component cho cột Actions
const ActionsCell = ({ order }: { order: TOrderLaundryResponse }) => {
  const router = useRouter();
  const status = Number(order.status);
  const canEdit = status === OrderStatusEnum.Draft;
  const canDelete = status === OrderStatusEnum.Draft;
  const canCancel = [
    OrderStatusEnum.Draft,
    OrderStatusEnum.PendingPayment,
    OrderStatusEnum.Processing,
  ].includes(status);

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Tùy chọn</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer flex items-center"
            onClick={() => router.push(`/laundry/orders/${order.id}`)}
          >
            <Eye className="h-4 w-4 mr-2" />
            <span>Xem chi tiết</span>
          </DropdownMenuItem>
          {canEdit && (
            <DropdownMenuItem className="cursor-pointer flex items-center">
              <Edit className="h-4 w-4 mr-2" />
              <span>Chỉnh sửa</span>
            </DropdownMenuItem>
          )}
          {status === OrderStatusEnum.PendingPayment && (
            <DropdownMenuItem className="cursor-pointer flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              <span>Xác nhận thanh toán</span>
            </DropdownMenuItem>
          )}
          {canCancel && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer flex items-center text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                <span>
                  {status === OrderStatusEnum.Draft
                    ? "Xóa đơn hàng"
                    : "Hủy đơn hàng"}
                </span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const getStatusBadge = (status?: string | number) => {
  if (status === undefined || status === null) {
    return (
      <Badge variant="outline" className="bg-gray-100">
        Không xác định
      </Badge>
    );
  }

  const statusNum = typeof status === "string" ? Number(status) : status;

  switch (statusNum) {
    case OrderStatusEnum.Draft:
      return (
        <Badge
          variant="outline"
          className="bg-gray-100 text-gray-800 border-gray-200"
        >
          Nháp
        </Badge>
      );
    case OrderStatusEnum.PendingPayment:
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-800 border-blue-200"
        >
          Chờ thanh toán
        </Badge>
      );
    case OrderStatusEnum.Processing:
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-800 border-yellow-200"
        >
          Đang xử lý
        </Badge>
      );
    case OrderStatusEnum.Completed:
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-800 border-green-200"
        >
          Hoàn thành
        </Badge>
      );
    case OrderStatusEnum.Cancelled:
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-800 border-red-200"
        >
          Đã hủy
        </Badge>
      );
    case OrderStatusEnum.Paid:
      return (
        <Badge
          variant="outline"
          className="bg-purple-50 text-purple-800 border-purple-200"
        >
          Đã thanh toán
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const laundryColumns: ColumnDef<TOrderLaundryResponse>[] = [
  {
    accessorKey: "orderCode",
    header: "Mã đơn hàng",
    cell: ({ row }) => (
      <div className="font-medium text-blue-600 cursor-pointer hover:underline">
        {row.getValue("orderCode")}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Khách hàng",
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const firstLetter = name?.charAt(0)?.toUpperCase() || "?";
      const userId = row.original.userId?.slice(-8) || "-";

      return (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
            {firstLetter}
          </div>
          <div>
            <div className="font-medium">{name || "Chưa có tên"}</div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>ID: {userId}</span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Loại dịch vụ",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return (
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{type || "Chưa xác định"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Giá trị",
    cell: ({ row }) => {
      const totalAmount = row.getValue("totalAmount") as number | null;
      const discountAmount = row.original.discountAmount as number | null;
      const status = Number(row.original.status);

      return (
        <div>
          {totalAmount ? (
            <div className="font-medium">{formatCurrency(totalAmount)}</div>
          ) : (
            <span className="text-gray-500">Chưa có</span>
          )}
          {discountAmount && discountAmount > 0 && (
            <div className="text-xs text-green-600 flex items-center gap-1">
              <span>Giảm:</span>
              <span className="font-medium">
                {formatCurrency(discountAmount)}
              </span>
            </div>
          )}
          {status === OrderStatusEnum.Paid && (
            <div className="text-xs flex items-center gap-1 text-purple-600 mt-1">
              <CreditCard className="h-3 w-3" />
              <span>Đã thanh toán</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "orderDate",
    header: "Thời gian",
    cell: ({ row }) => {
      const orderDate = row.getValue("orderDate") as string | null;
      const deliveryDate = row.original.deliveryDate as string | null;
      const completionTime = row.original.estimatedCompletionTime as
        | string
        | null;

      return (
        <div className="space-y-1">
          {orderDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-gray-500" />
              <span className="text-sm">{formatDate(new Date(orderDate))}</span>
            </div>
          )}

          {deliveryDate && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>Giao: {formatDate(new Date(deliveryDate))}</span>
            </div>
          )}

          {completionTime && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>HT: {completionTime}</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status");
      const notes = row.original.extraField;

      return (
        <div className="flex flex-col gap-1">
          {getStatusBadge(status as string | number | undefined)}

          {notes && notes !== "string" && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-xs text-gray-500 truncate max-w-[150px] cursor-help">
                    {notes}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-white p-3 shadow-lg border border-gray-200 rounded-md max-w-sm">
                  <p className="text-sm">{notes}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Thao tác</div>,
    cell: ({ row }) => <ActionsCell order={row.original} />,
  },
];
