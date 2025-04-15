"use client";

import { TAdditionalServiceResponse } from "@/schema/VinLaudry/additional-service.schema";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, CoinsIcon, XCircle } from "lucide-react";
import { AdditionalServiceCellAction } from "@/app/(dashboard)/admin/additional-services/_components/additional-service-tables/cell-action";

export const additionalServicecolumns: ColumnDef<TAdditionalServiceResponse>[] = [
  {
    accessorKey: "name",
    header: "Tên Dịch Vụ",
    cell: ({ row }) => (
      <div
        className="w-48 truncate cursor-pointer font-semibold text-gray-800 hover:text-blue-600 transition-colors"
        title={row.getValue("name")}
      >
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "serviceCode",
    header: "Mã Dịch Vụ",
    cell: ({ row }) => (
      <div className="font-medium text-gray-700">
        {row.getValue<string>("serviceCode")}
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: "Điểm",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-gray-700 font-medium">
        <CoinsIcon className="text-yellow-500" size={16} />
        {(row.getValue<number>("price") || 0).toLocaleString("vi-VN")}
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
          <span
            className={`font-medium ${
              status === "Active" ? "text-green-600" : "text-red-600"
            }`}
          >
            {status === "Active" ? "Hoạt động" : "Không hoạt động"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Ngày Tạo",
    cell: ({ row }) => (
      <div className="text-gray-600">
        {new Date(row.getValue("createdAt")).toLocaleString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Thao Tác",
    cell: ({ row }) => <AdditionalServiceCellAction data={row.original} />,
  },
];