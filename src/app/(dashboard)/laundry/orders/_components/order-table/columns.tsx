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

// Component con cho cột Actions
const ActionsCell = ({ order }: { order: TOrderLaundryResponse }) => {
  const router = useRouter();
  const canEdit = order.status === "Draft";
  const canDelete = order.status === "Draft";

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuLabel>Tùy chọn</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.push(`/manager/laundry/${order.id}`)}
          >
            <Eye className="h-4 w-4 mr-2" />
            <span>Xem chi tiết</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className={`cursor-pointer ${!canEdit ? "text-gray-400" : ""}`}
            disabled={!canEdit}
          >
            <Edit className="h-4 w-4 mr-2" />
            <span>Chỉnh sửa</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={`cursor-pointer text-red-600 ${
              !canDelete ? "text-gray-400" : ""
            }`}
            disabled={!canDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            <span>Xóa đơn hàng</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const getStatusBadge = (status?: string) => {
  if (!status) {
    return (
      <Badge variant="outline" className="bg-gray-100">
        Không xác định
      </Badge>
    );
  }
  switch (status) {
    case "Draft":
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800">
          Nháp
        </Badge>
      );
    case "Pending":
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
          Đang xử lý
        </Badge>
      );
    case "Completed":
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800">
          Hoàn thành
        </Badge>
      );
    case "Canceled":
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800">
          Đã hủy
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const columns: ColumnDef<TOrderLaundryResponse>[] = [
  {
    accessorKey: "orderCode",
    header: "Mã đơn hàng",
    cell: ({ row }) => (
      <div className="font-medium text-blue-600">
        {row.getValue("orderCode")}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Tên khách hàng",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
          {(row.getValue("name") as string)?.charAt(0)?.toUpperCase() || "?"}
        </div>
        <div>
          <div className="font-medium">{row.getValue("name")}</div>
          <div className="text-xs text-gray-500">
            ID: {row.original.userId?.slice(-8)}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Loại dịch vụ",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return (
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-gray-500" />
          <span>{type || "Chưa xác định"}</span>
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

      return (
        <div>
          {totalAmount ? (
            <div className="font-medium">{formatCurrency(totalAmount)}</div>
          ) : (
            <span className="text-gray-500">Chưa có</span>
          )}
          {discountAmount && discountAmount > 0 && (
            <div className="text-xs text-green-600">
              Giảm: {formatCurrency(discountAmount)}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "orderDate",
    header: "Ngày đặt",
    cell: ({ row }) => {
      const orderDate = row.getValue("orderDate") as string | null;
      const deliveryDate = row.original.deliveryDate as string | null;
      const completionTime = row.original.estimatedCompletionTime as
        | string
        | null;

      return (
        <div className="flex items-start gap-2">
          <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
          <div>
            <div>{orderDate ? formatDate(new Date(orderDate)) : "N/A"}</div>
            {deliveryDate && (
              <div className="text-xs text-gray-500">
                Giao: {formatDate(new Date(deliveryDate))}
              </div>
            )}
            {completionTime && (
              <div className="text-xs text-gray-500">
                Hoàn thành: {completionTime}
              </div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as string | undefined;
      const notes = row.original.extraField;

      return (
        <div className="flex flex-col gap-1">
          {getStatusBadge(status)}
          {notes && notes !== "string" && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-xs text-gray-500 truncate max-w-[150px]">
                    {notes}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-[300px]">{notes}</p>
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