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
  AlertCircle,
  CheckCircle,
  Loader,
  AlertTriangle,
  FileText,
  DollarSign,
  Briefcase,
  Timer
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
import { OrderStatusEnum } from "@/app/(dashboard)/laundry/orders/[slug]/OrderDetailLaundry/_components/order-task/TaskEnums";
import { MdLocalLaundryService } from "react-icons/md";

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
          <Button variant="ghost" size="icon" className="h-9 w-9 p-0 hover:bg-gray-100 rounded-full transition-colors">
            <MoreHorizontal className="h-5 w-5 text-gray-600" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[220px] p-1 shadow-lg border border-gray-200 rounded-lg">
          <DropdownMenuLabel className="text-gray-700 px-3 py-2">Tùy chọn</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer flex items-center px-3 py-2 rounded-md hover:bg-blue-50"
            onClick={() => router.push(`/laundry/orders/${order.id}`)}
          >
            <Eye className="h-4 w-4 mr-3 text-blue-600" />
            <span className="text-blue-600 font-medium">Xem chi tiết</span>
          </DropdownMenuItem>
          {canEdit && (
            <DropdownMenuItem className="cursor-pointer flex items-center px-3 py-2 rounded-md hover:bg-green-50">
              <Edit className="h-4 w-4 mr-3 text-green-600" />
              <span className="text-green-600 font-medium">Chỉnh sửa</span>
            </DropdownMenuItem>
          )}
          {status === OrderStatusEnum.PendingPayment && (
            <DropdownMenuItem className="cursor-pointer flex items-center px-3 py-2 rounded-md hover:bg-purple-50">
              <CreditCard className="h-4 w-4 mr-3 text-purple-600" />
              <span className="text-purple-600 font-medium">Xác nhận thanh toán</span>
            </DropdownMenuItem>
          )}
          {canCancel && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer flex items-center px-3 py-2 rounded-md hover:bg-red-50">
                <Trash2 className="h-4 w-4 mr-3 text-red-600" />
                <span className="text-red-600 font-medium">
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
      <Badge variant="outline" className="bg-gray-100 border-gray-300 py-1.5 px-3 flex items-center gap-1.5 rounded-md w-full justify-center">
        <AlertCircle className="h-3.5 w-3.5 text-gray-600" />
        <span className="font-medium text-gray-700">Không xác định</span>
      </Badge>
    );
  }

  const handleStatus = (statusValue: string | number) => {
    if (typeof statusValue === 'string') {
      switch (statusValue) {
        case 'Draft':
          return renderBadge('draft');
        case 'PendingPayment':
          return renderBadge('pendingPayment');
        case 'Processing':
          return renderBadge('processing');
        case 'Completed':
          return renderBadge('completed');
        case 'Cancelled':
          return renderBadge('cancelled');
        case 'Paid':
          return renderBadge('paid');
        default:
          const numStatus = Number(statusValue);
          if (!isNaN(numStatus)) {
            return handleStatus(numStatus);
          }
          return renderBadge('unknown');
      }
    } 
    else {
      switch (statusValue) {
        case OrderStatusEnum.Draft:
          return renderBadge('draft');
        case OrderStatusEnum.PendingPayment:
          return renderBadge('pendingPayment');
        case OrderStatusEnum.Processing:
          return renderBadge('processing');
        case OrderStatusEnum.Completed:
          return renderBadge('completed');
        case OrderStatusEnum.Cancelled:
          return renderBadge('cancelled');
        case OrderStatusEnum.Paid:
          return renderBadge('paid');
        default:
          return renderBadge('unknown');
      }
    }
  };

  const renderBadge = (statusType: string) => {
    switch (statusType) {
      case 'draft':
        return (
          <Badge
            variant="outline"
            className="bg-gray-200 text-gray-800 border-gray-300 py-1.5 px-3 flex items-center gap-1.5 rounded-md w-full justify-center"
          >
            <FileText className="h-3.5 w-3.5 text-gray-700" />
            <span className="font-medium">Nháp</span>
          </Badge>
        );
      case 'pendingPayment':
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-700 border-blue-300 py-1.5 px-3 flex items-center gap-1.5 rounded-md w-full justify-center"
          >
            <DollarSign className="h-3.5 w-3.5 text-blue-600" />
            <span className="font-medium">Chờ thanh toán</span>
          </Badge>
        );
      case 'processing':
        return (
          <Badge
            variant="outline"
            className="bg-amber-100 text-amber-700 border-amber-300 py-1.5 px-3 flex items-center gap-1.5 rounded-md w-full justify-center"
          >
            <Loader className="h-3.5 w-3.5 text-amber-600 animate-spin" />
            <span className="font-medium">Đang xử lý</span>
          </Badge>
        );
      case 'completed':
        return (
          <Badge
            variant="outline"
            className="bg-emerald-100 text-emerald-700 border-emerald-300 py-1.5 px-3 flex items-center gap-1.5 rounded-md w-full justify-center"
          >
            <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
            <span className="font-medium">Hoàn thành</span>
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-700 border-red-300 py-1.5 px-3 flex items-center gap-1.5 rounded-md w-full justify-center"
          >
            <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
            <span className="font-medium">Đã hủy</span>
          </Badge>
        );
      case 'paid':
        return (
          <Badge
            variant="outline"
            className="bg-purple-100 text-purple-700 border-purple-300 py-1.5 px-3 flex items-center gap-1.5 rounded-md w-full justify-center"
          >
            <CreditCard className="h-3.5 w-3.5 text-purple-600" />
            <span className="font-medium">Đã thanh toán</span>
          </Badge>
        );
      case 'unknown':
      default:
        return (
          <Badge
            variant="outline"
            className="bg-gray-100 border-gray-300 py-1.5 px-3 flex items-center gap-1.5 rounded-md w-full justify-center"
          >
            <AlertCircle className="h-3.5 w-3.5 text-gray-600" />
            <span className="font-medium">{typeof status === 'string' ? status : `Trạng thái ${status}`}</span>
          </Badge>
        );
    }
  };

  return handleStatus(status);
};

export const laundryColumns: ColumnDef<TOrderLaundryResponse>[] = [
  {
    accessorKey: "orderCode",
    header: "Mã đơn hàng",
    cell: ({ row }) => (
      <div className="font-medium text-blue-600 cursor-pointer hover:underline flex items-center">
        <FileText className="h-4 w-4 mr-0 text-blue-500" />
        {row.getValue("orderCode")}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Đơn hàng",
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const firstLetter = name?.charAt(0)?.toUpperCase() || "?";
      const userId = row.original.userId?.slice(-8) || "-";

      return (
        <div className="flex items-center gap-3">
          <MdLocalLaundryService className="h-4 w-4 mr-0 text-blue-500" />
          <div>
            <div className="font-medium text-gray-800">{name || "Chưa có tên"}</div>
            <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
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
          <div className="p-1.5 bg-indigo-50 rounded-md">
            <Briefcase className="h-4 w-4 text-indigo-600" />
          </div>
          <span className="font-medium text-gray-700">{type || "Chưa xác định"}</span>
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
        <div className="px-2 py-1.5 bg-gray-50 rounded-lg">
          {totalAmount ? (
            <div className="font-semibold text-gray-800">{formatCurrency(totalAmount)}</div>
          ) : (
            <span className="text-gray-500">Chưa có</span>
          )}
          {discountAmount && discountAmount > 0 && (
            <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <span>Giảm:</span>
              <span className="font-medium">
                {formatCurrency(discountAmount)}
              </span>
            </div>
          )}
          {status === OrderStatusEnum.Paid && (
            <div className="text-xs flex items-center gap-1 text-purple-600 mt-1 bg-purple-50 py-0.5 px-1.5 rounded-md w-fit">
              <CreditCard className="h-3 w-3" />
              <span className="font-medium">Đã thanh toán</span>
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
      const completionTime = row.original.estimatedCompletionTime as string | null;

      return (
        <div className="space-y-2">
          {orderDate && (
            <div className="flex items-center gap-2">
              <div className="p-1 bg-blue-50 rounded-md">
                <Calendar className="h-3.5 w-3.5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">{formatDate(new Date(orderDate))}</span>
            </div>
          )}

          {deliveryDate && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="p-1 bg-green-50 rounded-md">
                <Timer className="h-3.5 w-3.5 text-green-600" />
              </div>
              <span>Giao: <span className="font-medium">{formatDate(new Date(deliveryDate))}</span></span>
            </div>
          )}

          {completionTime && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="p-1 bg-amber-50 rounded-md">
                <Clock className="h-3.5 w-3.5 text-amber-600" />
              </div>
              <span>HT: <span className="font-medium">{completionTime}</span></span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="font-medium text-gray-700">Trạng thái</div>,
    cell: ({ row }) => {
      const status = row.getValue("status");
      const notes = row.original.extraField;
  
      return (
        <div className="flex flex-col gap-2">
          {getStatusBadge(status as string | number | undefined)}
  
          {notes && notes !== "string" && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-xs text-gray-600 truncate max-w-[150px] cursor-help flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                    <AlertCircle className="h-3 w-3 text-gray-500" />
                    <span>{notes}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-white p-3 shadow-xl border border-gray-200 rounded-lg max-w-sm">
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
    header: () => <div className="text-right font-medium text-gray-700">Thao tác</div>,
    cell: ({ row }) => <ActionsCell order={row.original} />,
  },
];