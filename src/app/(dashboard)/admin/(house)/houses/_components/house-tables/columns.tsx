"use client";

import { ColumnDef } from "@tanstack/react-table";
import { THouseResponse } from "@/schema/house.schema"; // Đảm bảo đường dẫn schema đúng
import { CellAction } from "./cell-action";

import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

export const columns: ColumnDef<THouseResponse>[] = [
  {
    accessorKey: "no", // Cập nhật theo mã căn hộ
    header: "Mã căn hộ",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-sm font-mono px-2 py-1">
        {row.getValue("no")}
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
    accessorKey: "code", // Mã căn hộ
    header: "Mã căn hộ",
    cell: ({ row }) => <span className="text-sm">{row.getValue("code")}</span>,
  },
  {
    accessorKey: "hasBalcony", // Có ban công không
    header: "Có ban công",
    cell: ({ row }) => (
      <span className="text-sm">
        {row.getValue("hasBalcony") ? "Có" : "Không"}
      </span>
    ),
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
  // {
  //   accessorKey: "buildingId", // ID tòa nhà
  //   header: "Tòa nhà",
  //   cell: ({ row }) => (
  //     <span className="text-sm">{row.getValue("buildingId")}</span>
  //   ),
  // },
  // {
  //   accessorKey: "houseTypeId", // Loại căn hộ
  //   header: "Loại căn hộ",
  //   cell: ({ row }) => (
  //     <span className="text-sm">{row.getValue("houseTypeId")}</span>
  //   ),
  // },
  {
    id: "actions", // Các hành động
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
