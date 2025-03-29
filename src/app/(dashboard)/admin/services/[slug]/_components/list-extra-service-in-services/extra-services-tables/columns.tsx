"use client";

// import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { TExtraServicesInServiceResponse } from "@/schema/extra-services-in-service.schema";

export const ExtraServiceColumns: ColumnDef<TExtraServicesInServiceResponse>[] =
  [
    {
      accessorKey: "name",
      header: "Tên dịch vụ bổ sung",
      cell: ({ row }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="w-36 truncate cursor-pointer hover:underline">
                {row.getValue("name")}
              </span>
            </TooltipTrigger>
            <TooltipContent>{row.getValue("name")}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      accessorKey: "code",
      header: "Mã dịch vụ bổ sung",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-sm font-mono px-2 py-1">
          {row.getValue("code")}
        </Badge>
      ),
    },
    // {
    //   accessorKey: "price",
    //   header: "Giá dịch vụ bổ sung",
    //   cell: ({ row }) => (
    //     <span className="text-sm font-medium">
    //       {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(row.getValue("price"))}
    //     </span>
    //   ),
    // },
    {
      accessorKey: "extraTime",
      header: "Thời gian bổ sung (phút)",
      cell: ({ row }) => (
        <span className="text-sm font-medium">
          {row.getValue("extraTime")} phút
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status = row.getValue("status");
        return (
          <Badge
            variant="secondary"
            className={`text-sm px-2 py-1 ${
              status === "Active"
                ? "bg-green-500 text-white"
                : "bg-gray-400 text-white"
            }`}
          >
            {status === "Active" ? "Hoạt động" : "Ngừng hoạt động"}
          </Badge>
        );
      },
    },
    // {
    //   accessorKey: "createdAt",
    //   header: "Ngày tạo",
    //   cell: ({ row }) => (
    //     <span className="text-sm font-medium">
    //       {new Date(row.getValue("createdAt")).toLocaleDateString("vi-VN")}
    //     </span>
    //   ),
    // },
    // {
    //   accessorKey: "updatedAt",
    //   header: "Ngày cập nhật",
    //   cell: ({ row }) => (
    //     <span className="text-sm font-medium">
    //       {new Date(row.getValue("updatedAt")).toLocaleDateString("vi-VN")}
    //     </span>
    //   ),
    // },
    {
      id: "actions",
      cell: ({ row }) => {
        const extraServiceId = row.original.id;
        const serviceId = row.original.serviceId;
        return (
          <Link
            href={`/admin/services/${serviceId}/extra-service/${extraServiceId}`}
          >
            <Edit />
          </Link>
        );
      },
    },
  ];
