"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TClusterResponse } from "@/schema/cluster.schema";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CellAction } from "./cell-action";
import { format } from "date-fns";
import { CheckCircle, XCircle } from "lucide-react";

export const columns: ColumnDef<TClusterResponse>[] = [
  {
    accessorKey: "name",
    header: "Tên cụm",
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
    header: "Mã cụm",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-sm font-mono px-2 py-1">
        {row.getValue("code")}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng Thái",
    cell: ({ row }) => {
      const status = row.getValue<string>("status"); // Ép kiểu tránh lỗi unknown
      return (
        <div className="flex items-center gap-2">
          {status === "Active" ? (
            <CheckCircle className="text-green-500" size={20} />
          ) : (
            <XCircle className="text-red-500" size={20} />
          )}
          <span>{status === "Active" ? "Hoạt động" : "Không hoạt động"}</span>
        </div>
      );
    },
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
  // {
  //   accessorKey: "areaId",
  //   header: "Mã khu vực",
  //   cell: ({ row }) => (
  //     <Badge variant="outline" className="text-sm font-mono px-2 py-1">
  //       {row.getValue("areaId")}
  //     </Badge>
  //   ),
  // },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
