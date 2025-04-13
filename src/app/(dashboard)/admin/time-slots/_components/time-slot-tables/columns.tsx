"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { TTimesSlotResponse } from "@/schema/time-slot.schema";
import { CheckCircle, XCircle } from "lucide-react";

export const columns: ColumnDef<TTimesSlotResponse>[] = [
  {
    accessorKey: "description",
    header: "Mô Tả",
    cell: ({ row }) => (
      <div
        className="w-36 truncate cursor-pointer"
        title={row.getValue("description")}
        onClick={() => alert(row.getValue("description"))}
      >
        {row.getValue("description")}
      </div>
    ),
  },
  {
    accessorKey: "startTime",
    header: "Giờ Bắt Đầu",
    cell: ({ row }) => <div>{row.getValue("startTime")}</div>,
  },
  {
    accessorKey: "endTime",
    header: "Giờ Kết Thúc",
    cell: ({ row }) => <div>{row.getValue("endTime")}</div>,
  },
  {
    accessorKey: "status",
    header: "Trạng Thái",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <div className="flex items-center gap-2">
          {status === "Active" ? (
            <CheckCircle className="text-green-500" size={18} />
          ) : (
            <XCircle className="text-red-500" size={18} />
          )}
        </div>
      );
    },
  },

  {
    accessorKey: "code",
    header: "Mã Code",
    cell: ({ row }) => <div>{row.getValue("code")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
