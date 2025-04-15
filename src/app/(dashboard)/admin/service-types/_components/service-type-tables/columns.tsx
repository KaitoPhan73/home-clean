"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, XCircle } from "lucide-react";
import { TServiceTypeResponse } from "@/schema/VinLaudry/service-type.schema";

export const serviceTypecolumns: ColumnDef<TServiceTypeResponse>[] = [
  {
    accessorKey: "name",
    header: "Tên Dịch Vụ",
    cell: ({ row }) => (
      <div
        className="w-36 truncate cursor-pointer font-medium"
        title={row.getValue("name")}
      >
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Loại Dịch Vụ",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue("type") === "PerItem" ? "Theo số lượng" : "Theo ký"}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng Thái",
    cell: ({ row }) => {
      const status = row.getValue<string>("status");
      return (
        <div className="flex items-center gap-2">
          {status === "Active" ? (
            <CheckCircle className="text-green-500" size={20} />
          ) : (
            <XCircle className="text-red-500" size={20} />
          )}
          <span className={status === "Active" ? "text-green-600" : "text-red-600"}>
            {status === "Active" ? "Hoạt động" : "Không hoạt động"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => (
      <div className="w-40 truncate text-gray-600" title={row.getValue("description") || ""}>
        {row.getValue("description") || "—"}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Ngày Tạo",
    cell: ({ row }) => (
      <div className="text-gray-600">
        {new Date(row.getValue("createdAt")).toLocaleString("vi-VN")}
      </div>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Ngày Cập Nhật",
    cell: ({ row }) => (
      <div className="text-gray-600">
        {new Date(row.getValue("updatedAt")).toLocaleString("vi-VN")}
      </div>
    ),
  },
  // {
  //   id: "actions",
  //   header: "Thao Tác",
  //   cell: ({ row }) => <CellAction data={row.original} />,
  // },
];