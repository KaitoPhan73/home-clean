"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { CheckCircle, XCircle } from "lucide-react";
import { TGroupResponse } from "@/schema/group.schema";

export const columns: ColumnDef<TGroupResponse>[] = [
  {
    accessorKey: "name",
    header: "Tên Nhóm",
    cell: ({ row }) => (
      <div
        className="w-36 truncate cursor-pointer"
        title={row.getValue("name")}
        onClick={() => alert(row.getValue("name"))}
      >
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "code",
    header: "Mã Nhóm",
    cell: ({ row }) => <div>{row.getValue("code")}</div>,
  },
  {
    accessorKey: "status",
    header: "Trạng Thái",
    cell: ({ row }) => {
      const status = row.getValue<string>("status") || "Không xác định";
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
    header: "Ngày Tạo",
    cell: ({ row }) => <div>{new Date(row.getValue("createdAt")).toLocaleString()}</div>,
  },
  {
    accessorKey: "updatedAt",
    header: "Ngày Cập Nhật",
    cell: ({ row }) => <div>{new Date(row.getValue("updatedAt")).toLocaleString()}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];