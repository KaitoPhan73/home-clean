"use client";

// import { format } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";
import Link from "next/link";
import { TServiceActivitiesInServiceResponse } from "@/schema/service-activities-in-service.schema";
import { ColumnDef } from "@tanstack/react-table";

export const ServiceActivitycolumns : ColumnDef<TServiceActivitiesInServiceResponse>[] = [
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
          {status === "Active" ? "Hoạt động" : "Ngừng hoạt động"}
        </Badge>
      );
    },
  },

  {
    accessorKey: "estimatedTimePerTask",
    header: "Thời gian ước tính",
    cell: ({ row }) => (
      <span className="text-sm">{row.getValue("estimatedTimePerTask")}</span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const serviceActivityId = row.original.id;
      const serviceId = row.original.serviceId;
      return (
        <Link href={`/admin/services/${serviceId}/service-activity/${serviceActivityId}`}>
          <Edit />
        </Link>
      );
    },
  },

];
