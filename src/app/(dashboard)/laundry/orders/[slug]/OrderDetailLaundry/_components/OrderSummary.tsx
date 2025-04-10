/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Receipt, CreditCard, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TOrderLaundryResponse } from "@/schema/VinLaudry/laundry-order";

interface OrderSummaryProps {
  totals: {
    itemsTotal: number;
    additionalServicesTotal: number;
    discount: number;
    grandTotal: number;
  };
  order: TOrderLaundryResponse;
}

// Utility function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
    .format(amount)
    .replace(/\s/g, "");
};

export default function OrderSummary({ totals, order }: OrderSummaryProps) {
  return (
    <Card className="shadow-md border-gray-200 overflow-hidden bg-white">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-white pb-4">
        <CardTitle className="text-lg font-semibold flex items-center text-purple-800">
          <Receipt className="h-5 w-5 mr-2 text-purple-600" />
          Đơn hàng giặt ủi
        </CardTitle>
        <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500 mb-0 ml-7">
          (Đây là giá khởi điểm theo món hoặc kg, truớc khi thanh toán, chưa
          tính đến cân đồ sau khi giặt)
        </p>
      </CardHeader>

      <CardContent className="p-5 pt-[2px]">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Tổng giá trị:</span>
            <span className="font-medium">
              {formatCurrency(totals.itemsTotal)}
            </span>
          </div>

          {totals.additionalServicesTotal > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Dịch vụ bổ sung:</span>
              <span className="font-medium">
                {formatCurrency(totals.additionalServicesTotal)}
              </span>
            </div>
          )}

          {totals.discount > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Giảm giá:</span>
              <span className="font-medium text-red-600">
                - {formatCurrency(totals.discount)}
              </span>
            </div>
          )}

          <Separator className="my-3" />

          <div className="flex justify-between items-center text-base">
            <span className="font-semibold text-gray-800">
              Tổng tiền (ước tính):
            </span>
            <span className="font-bold text-purple-700">
              {formatCurrency(totals.grandTotal)}
            </span>
          </div>
        </div>
      </CardContent>

      {/* <CardFooter className="bg-gray-50 px-5 py-4 flex flex-col space-y-2">
        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
          <CreditCard className="h-4 w-4 mr-2" />
          Thanh toán
        </Button>
        
        <Button variant="outline" className="w-full border-purple-200 text-purple-700 hover:bg-purple-50">
          <Edit className="h-4 w-4 mr-2" />
          Sửa đơn hàng
        </Button>
        
        {order.status === "Draft" && (
          <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300">
            <Trash2 className="h-4 w-4 mr-2" />
            Hủy đơn hàng
          </Button>
        )}
      </CardFooter> */}
    </Card>
  );
}
