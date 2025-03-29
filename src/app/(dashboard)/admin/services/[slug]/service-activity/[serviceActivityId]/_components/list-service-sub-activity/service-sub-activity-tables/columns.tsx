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

import { statusOptions } from "@/constants/config";
import { TServiceSubActivitiesResponse } from "@/schema/service-sub-activity.schema";
import UpdateServiceSubActivityPopup from "@/app/(dashboard)/admin/services/[slug]/service-activity/[serviceActivityId]/_components/list-service-sub-activity/service-sub-activity-tables/UpdateServiceSubActivityPopup ";

export const columns: ColumnDef<TServiceSubActivitiesResponse>[] = [
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
  //   accessorKey: "serviceActivityId",
  //   header: "Mã Công việc chính",
  //   cell: ({ row }) => (
  //     <Badge variant="outline" className="text-sm font-mono px-2 py-1">
  //       {row.getValue("serviceActivityId")}
  //     </Badge>
  //   ),
  // },
  {
    id: "actions",
    cell: ({ row }) => <UpdateServiceSubActivityPopup data={row.original} />,
  },
];