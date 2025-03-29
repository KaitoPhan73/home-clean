"use client";

import { formatPriceVND } from "@/lib/formatter";
import { ColumnDef } from "@tanstack/react-table";
import { TServiceResponse } from "@/schema/service.schema";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<TServiceResponse>[] = [
  {
    accessorKey: "name",
    header: "Tên Dịch Vụ",
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
  // {
  //   accessorKey: "description",
  //   header: "Mô Tả",
  //   cell: ({ row }) => <div>{row.getValue("description")}</div>,
  // },
  {
    accessorKey: "status",
    header: "Trạng Thái",
    cell: ({ row }) => <div>{row.getValue("status")}</div>,
  },
  // {
  //   accessorKey: "prorityLevel",
  //   header: "Mức Độ Ưu Tiên",
  //   cell: ({ row }) => <div>{row.getValue("prorityLevel")}</div>,
  // },
  {
    accessorKey: "price",
    header: "Giá",
    cell: ({ row }) => <div>{formatPriceVND(row.getValue("price"))}</div>,
  },
  // {
  //   accessorKey: "discount",
  //   header: "Giảm Giá",
  //   cell: ({ row }) => <div>{row.getValue("discount")}%</div>,
  // },
  {
    accessorKey: "duration",
    header: "Thời Gian (Giờ)",
    cell: ({ row }) => <div>{row.getValue("duration")}</div>,
  },
  {
    accessorKey: "maxCapacity",
    header: "Sức Chứa",
    cell: ({ row }) => <div>{row.getValue("maxCapacity")}</div>,
  },
  {
    accessorKey: "serviceCode",
    header: "Mã Dịch Vụ",
    cell: ({ row }) => <div>{row.getValue("serviceCode")}</div>,
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
