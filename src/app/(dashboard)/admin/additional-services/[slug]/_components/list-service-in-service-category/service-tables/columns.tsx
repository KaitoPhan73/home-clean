"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
// import { Edit } from "lucide-react";
// import Link from "next/link";
import { TServiceResponse } from "@/schema/service.schema";
import { statusOptions } from "@/constants/config";

export const columns: ColumnDef<TServiceResponse>[] = [
  {
    accessorKey: "name",
    header: "Tên dịch vụ",
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
    header: "Mã dịch vụ",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-sm font-mono px-2 py-1">
        {row.getValue("code")}
      </Badge>
    ),
  },
  {
    accessorKey: "serviceCode",
    header: "Mã hệ thống",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-sm font-mono px-2 py-1">
        {row.getValue("serviceCode")}
      </Badge>
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
            status === "Active" ? "bg-green-500 text-white" : "bg-gray-400 text-white"
          }`}
        >
          {statusOptions.find((item) => item.value === status)?.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Giá dịch vụ",
    cell: ({ row }) => (
      <span className="text-sm">{(row.getValue("price") as string).toLocaleString()} đ</span>
    ),
  },
  {
    accessorKey: "discount",
    header: "Giảm giá (%)",
    cell: ({ row }) => (
      <span className="text-sm">{row.getValue("discount")} %</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
    cell: ({ row }) => (
      <span className="text-sm">
        {format(new Date(row.getValue("createdAt")), "dd/MM/yyyy HH:mm")}
      </span>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Cập nhật lần cuối",
    cell: ({ row }) => (
      <span className="text-sm">
        {format(new Date(row.getValue("updatedAt")), "dd/MM/yyyy HH:mm")}
      </span>
    ),
  },
  {
    accessorKey: "serviceCategoryId",
    header: "Mã danh mục",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-sm font-mono px-2 py-1">
        {row.getValue("serviceCategoryId")}
      </Badge>
    ),
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const serviceId = row.original.id;
  //     return (
  //       <Link href={`/manager/service-category/${serviceId}/services`}>
  //         <Edit />
  //       </Link>
  //     );
  //   },
  // },
];
