/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import { CalendarRange } from "lucide-react";
import { TOrderLaundryResponse } from "@/schema/VinLaudry/laundry-order";
import { Button } from "@/components/ui/button";
import { statusConfig } from "./statusConfig";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderCard } from "@/app/(dashboard)/laundry/orders/_components/order-table/OrderCard";
import { Separator } from "@radix-ui/react-dropdown-menu";

interface OrderGridProps {
  filteredOrders: TOrderLaundryResponse[];
  activeTab: string;
  dateRangeText: string;
  isLoading: boolean;
  pageSize: number;
  onSizeChange: (size: number) => void;
  totalItems: number;
}

const OrderGrid = ({
  filteredOrders,
  activeTab,
  dateRangeText,
  isLoading,
  pageSize,
  onSizeChange,
  totalItems,
}: OrderGridProps) => {
  const pageSizeOptions = [10, 50, 100, 200, 1000];

  return (
    <>
      <div className="p-2 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
            {statusConfig[activeTab as keyof typeof statusConfig].icon && (
              <span
                className={
                  statusConfig[activeTab as keyof typeof statusConfig].color
                }
              >
                {statusConfig[activeTab as keyof typeof statusConfig].icon}
              </span>
            )}
            {statusConfig[activeTab as keyof typeof statusConfig].label}
            <span className="text-sm text-gray-500">
              ({filteredOrders.length} đơn hàng)
            </span>
            <Separator className="mx-2 h-4 w-[1px] bg-gray-200" />
            <div className="flex items-center space-x-2">
            <p className="whitespace-nowrap text-sm font-medium text-gray-600">
              Số dòng trên trang
            </p>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => onSizeChange(Number(value))}
            >
              <SelectTrigger className="h-8 w-[80px]">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          </h2>
          
          {dateRangeText && (
            <div className="flex items-center text-sm text-slate-500">
              <CalendarRange size={16} className="mr-1" />
              {dateRangeText}
            </div>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between">

          {isLoading && (
            <div className="flex items-center text-sm text-gray-500">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Đang tải...
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-auto p-2">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center h-full">
            <div className="bg-gray-100 rounded-full p-3 mb-4">
              <svg
                className="h-6 w-6 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Không tìm thấy dữ liệu
            </h3>
            <p className="text-gray-500 max-w-md mb-4">
              {activeTab !== "all"
                ? `Hiện không có đơn hàng nào ở trạng thái "${
                    statusConfig[activeTab as keyof typeof statusConfig].label
                  }"`
                : "Không tìm thấy đơn hàng nào phù hợp với các điều kiện tìm kiếm"}
            </p>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "?size=" + pageSize)}
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <svg
                className="h-4 w-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default OrderGrid;