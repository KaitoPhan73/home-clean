"use client";

import { ColumnDef } from "@tanstack/react-table";
import { THouseResponse } from "@/schema/house.schema"; // Đảm bảo đường dẫn schema đúng
import { CellAction } from "./cell-action";

import { Badge } from "@/components/ui/badge";
import { Check, CheckCircle, X, XCircle } from "lucide-react";

export const columns: ColumnDef<THouseResponse>[] = [
  {
    accessorKey: "no", // Cập nhật theo mã căn hộ
    header: "Số căn hộ",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-sm font-mono px-2 py-1">
        {row.getValue("no")}
      </Badge>
    ),
  },

  {
    accessorKey: "code", // Mã căn hộ
    header: "Mã căn hộ",
    cell: ({ row }) => <span className="text-sm">{row.getValue("code")}</span>,
  },
  {
    accessorKey: "hasBalcony", // Có ban công không
    header: "Có ban công",
    cell: ({ row }) => {
      const hasBalcony = row.getValue("hasBalcony"); // Lấy giá trị của trường hasBalcony
      return (
        <span className="text-sm flex items-center gap-2">
          {hasBalcony ? (
            <>
              <Check className="w-4 h-4 text-green-500" />
            </>
          ) : (
            <>
              <X className="w-4 h-4 text-red-500" />
            </>
          )}
        </span>
      );
    },
  },
  {
    accessorKey: "contactTerms", // Điều kiện liên hệ
    header: "Điều kiện liên hệ",
    cell: ({ row }) => (
      <span className="text-sm">{row.getValue("contactTerms")}</span>
    ),
  },
  {
    accessorKey: "occupacy", // Tình trạng cư trú
    header: "Tình trạng cư trú",
    cell: ({ row }) => (
      <span className="text-sm">{row.getValue("occupacy")}</span>
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
    id: "actions", // Các hành động
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
