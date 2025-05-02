"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TServiceInHouseTypeResponse } from "@/schema/service-in-house-type.schema";
import { Coins } from "lucide-react";

export const ServiceInHouseTypesColumns: ColumnDef<TServiceInHouseTypeResponse>[] =
  [
    {
      accessorKey: "name",
      header: () => (
        <div className="text-left font-semibold text-gray-700">Tên</div>
      ),
      cell: ({ row }) => (
        <div
          className="w-36 truncate cursor-pointer text-gray-800 hover:text-blue-600 transition-colors"
          title={row.getValue("name")}
          onClick={() => alert(row.getValue("name"))}
        >
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "code",
      header: () => (
        <div className="text-left font-semibold text-gray-700">Mã Code</div>
      ),
      cell: ({ row }) => (
        <div className="text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded-md">
          {row.getValue("code")}
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "Số Điểm",
      cell: ({ row }) => {
        const priceValue = row.getValue("price");
        const amount =
          typeof priceValue === "number"
            ? priceValue
            : typeof priceValue === "string"
            ? parseFloat(priceValue) || 0
            : 0;

        const formatted = new Intl.NumberFormat("vi-VN").format(amount);

        return (
          <div className="flex items-center text-green-600 text-sm font-semibold">
            <Coins className="h-4 w-4 mr-1" />
            {formatted} Point
          </div>
        );
      },
    },
    {
      accessorKey: "serviceName",
      header: () => (
        <div className="text-left font-semibold text-gray-700">Tên Dịch Vụ</div>
      ),
      cell: ({ row }) => (
        <div
          className="w-40 truncate text-gray-800 hover:text-blue-600 transition-colors"
          title={row.getValue("serviceName")}
        >
          {row.getValue("serviceName")}
        </div>
      ),
    },
    {
      accessorKey: "houseTypeCode",
      header: () => (
        <div className="text-left font-semibold text-gray-700">Mã Loại Nhà</div>
      ),
      cell: ({ row }) => (
        <div className="text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded-md">
          {row.getValue("houseTypeCode")}
        </div>
      ),
    },
    {
      accessorKey: "houseTypeDescription",
      header: () => (
        <div className="text-left font-semibold text-gray-700">
          Mô Tả Loại Nhà
        </div>
      ),
      cell: ({ row }) => (
        <div
          className="w-48 truncate text-gray-700 italic"
          title={row.getValue("houseTypeDescription")}
        >
          {row.getValue("houseTypeDescription")}
        </div>
      ),
    },
    // {
    //   id: "actions",
    //   header: () => <div className="text-left font-semibold text-gray-700">Hành Động</div>,
    //   cell: ({ row }) => (
    //     <div className="flex items-center justify-end">
    //       <CellAction data={row.original} />
    //     </div>
    //   ),
    // },
  ];
