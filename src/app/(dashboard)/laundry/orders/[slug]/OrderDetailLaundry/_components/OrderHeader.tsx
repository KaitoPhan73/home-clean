"use client";

import { ArrowLeft, Clock } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { TOrderLaundryResponse } from "@/schema/VinLaudry/laundry-order";

interface OrderHeaderProps {
  order: TOrderLaundryResponse;
}

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { color: string; label: string }> = {
    Draft: { color: "bg-slate-100 text-slate-800 border border-slate-200", label: "Nháp" },
    Pending: { color: "bg-amber-50 text-amber-700 border border-amber-200", label: "Chờ xử lý" },
    Processing: { color: "bg-sky-50 text-sky-700 border border-sky-200", label: "Đang xử lý" },
    Completed: { color: "bg-emerald-50 text-emerald-700 border border-emerald-200", label: "Hoàn thành" },
    Cancelled: { color: "bg-rose-50 text-rose-700 border border-rose-200", label: "Đã hủy" },
    Delivered: { color: "bg-indigo-50 text-indigo-700 border border-indigo-200", label: "Đã giao" },
  };

  const statusInfo = statusMap[status] || {
    color: "bg-gray-100 text-gray-800 border border-gray-200",
    label: status,
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
    >
      {statusInfo.label}
    </span>
  );
};

export default function OrderHeader({ order }: OrderHeaderProps) {
  return (
    <Card className="mb-6 shadow-sm border-slate-200">
      <CardHeader className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Link href="/laundry/orders">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                <ArrowLeft className="h-5 w-5 text-slate-600" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold text-slate-800">
              Đơn giặt ủi mã #{" "}
              <span className="text-indigo-600">{order.orderCode}</span>
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-500 bg-slate-50 px-2 py-1 rounded">
              ID: {order.id.substring(0, 8)}
            </span>
            <span className="text-sm text-slate-500 flex items-center bg-slate-50 px-2 py-1 rounded">
              <Clock className="h-4 w-4 mr-1 text-slate-400" />
              {formatDate(order.orderDate)}
            </span>
            {getStatusBadge(order.status)}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}