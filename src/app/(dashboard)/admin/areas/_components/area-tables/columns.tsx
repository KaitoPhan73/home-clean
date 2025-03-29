"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TAreaResponse } from "@/schema/area.schema";
import { CellAction } from "./cell-action";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";

export const columns: ColumnDef<TAreaResponse>[] = [
  {
    accessorKey: "name",
    header: "Tên khu vực",
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
    accessorKey: "contactInfo",
    header: "Liên hệ",
    cell: ({ row }) => {
      const contact = row.getValue("contactInfo") as string;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {contact.includes("@") ? (
                <Link
                  href={`mailto:${contact}`}
                  className="text-blue-600 hover:underline"
                >
                  {contact}
                </Link>
              ) : (
                <Link
                  href={`tel:${contact}`}
                  className="text-blue-600 hover:underline"
                >
                  {contact}
                </Link>
              )}
            </TooltipTrigger>
            <TooltipContent>{contact}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
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
    accessorKey: "code",
    header: "Mã khu vực",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-sm font-mono px-2 py-1">
        {row.getValue("code")}
      </Badge>
    ),
  },
  // {
  //   accessorKey: "description",
  //   header: "Mô tả",
  //   cell: ({ row }) => (
  //     <TooltipProvider>
  //       <Tooltip>
  //         <TooltipTrigger asChild>
  //           <span className="block max-w-[300px] truncate overflow-hidden whitespace-nowrap cursor-pointer hover:underline">
  //             {row.getValue("description") || "Không có mô tả"}
  //           </span>
  //         </TooltipTrigger>
  //         <TooltipContent className="max-w-xs">
  //           {row.getValue("description")}
  //         </TooltipContent>
  //       </Tooltip>
  //     </TooltipProvider>
  //   ),
  // },

  // {
  //   accessorKey: "address",
  //   header: "Địa chỉ",
  //   cell: ({ row }) => (
  //     <TooltipProvider>
  //       <Tooltip>
  //         <TooltipTrigger asChild>
  //           <span className="block text-sm max-w-[200px] truncate cursor-pointer hover:underline">
  //             {row.getValue("address")}
  //           </span>
  //         </TooltipTrigger>
  //         <TooltipContent>{row.getValue("address")}</TooltipContent>
  //       </Tooltip>
  //     </TooltipProvider>
  //   ),
  // },

  {
    accessorKey: "areaType",
    header: "Loại khu vực",
    cell: ({ row }) => (
      <Badge variant="secondary" className="text-sm px-2 py-1">
        {row.getValue("areaType")}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
