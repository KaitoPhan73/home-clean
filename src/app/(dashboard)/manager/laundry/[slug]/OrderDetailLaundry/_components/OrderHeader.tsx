"use client";

import { TOrderLaundryResponse } from "@/schema/laundry-order";
import { ArrowLeft, Clock } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface OrderHeaderProps {
  order: TOrderLaundryResponse;
}

// Utility function to get status badge with proper styling
const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { color: string; label: string }> = {
    Draft: { color: "bg-gray-100 text-gray-800", label: "Nháp" },
    Pending: { color: "bg-yellow-100 text-yellow-800", label: "Chờ xử lý" },
    Processing: { color: "bg-blue-100 text-blue-800", label: "Đang xử lý" },
    Completed: { color: "bg-green-100 text-green-800", label: "Hoàn thành" },
    Cancelled: { color: "bg-red-100 text-red-800", label: "Đã hủy" },
    Delivered: { color: "bg-purple-100 text-purple-800", label: "Đã giao" },
  };

  const statusInfo = statusMap[status] || { color: "bg-gray-100 text-gray-800", label: status };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
      {statusInfo.label}
    </span>
  );
};

export default function OrderHeader({ order }: OrderHeaderProps) {
  return (
    <Card className="mb-1 shadow-sm border-gray-200 overflow-hidden bg-white">
      <CardHeader className="pb-2 bg-gradient-to-r from-purple-10 to-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/manager/laundry">
              <Button variant="ghost" size="sm" className="text-purple-700 hover:text-purple-800 hover:bg-purple-50 rounded-full h-8 w-8 p-0">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-purple-800">
                Đơn giặt ủi mã #{order.orderCode}
              </h1>
              <p className="text-sm text-gray-500 mt-1">ID: {order.id.substring(0, 8)}</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start md:items-center mt-4 md:mt-0 space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-gray-500 mr-1" />
              <span className="text-sm text-gray-600">{formatDate(order.orderDate)}</span>
            </div>
            <div>{getStatusBadge(order.status)}</div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}