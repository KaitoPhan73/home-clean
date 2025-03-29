"use client";

// import { format } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { TOptionsInServiceResponse } from "@/schema/options-in-service.schema";

export const OptionColumns : ColumnDef<TOptionsInServiceResponse>[] = [
  {
    accessorKey: "name",
    header: "Tên lựa chọn",
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
    header: "Mã lựa chọn",
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
    accessorKey: "isMandatory",
    header: "Bắt buộc",
    cell: ({ row }) => (
      <Badge variant={row.getValue("isMandatory") ? "default" : "outline"}>
        {row.getValue("isMandatory") ? "Có" : "Không"}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const optionId = row.original.id;
      const serviceId = row.original.serviceId;
      return (
        <Link
          href={`/admin/services/${serviceId}/option/${optionId}`}
        >
          <Edit />
        </Link>
      );
    },
  },
];