"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";
import { formatCurrency } from "@/app/(dashboard)/manager/order-assignment/_components/order-management/OrderDetailsPopup/utils";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  itemType: { name: string; itemCode: string };
}

interface AdditionalService {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface OrderItemsProps {
  items: OrderItem[];
  additionalServices: AdditionalService[];
}

export default function OrderItems({ items, additionalServices }: OrderItemsProps) {
  return (
    <Card className="shadow-sm border-gray-200 mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Chi tiết đơn hàng</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 text-sm border-b">
                <th className="pb-2">Mặt hàng</th>
                <th className="pb-2 text-center">Số lượng</th>
                <th className="pb-2 text-right">Đơn giá</th>
                <th className="pb-2 text-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-3">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                        <Package className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-gray-500">Mã: {item.itemType.itemCode}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-center">{item.quantity}</td>
                  <td className="py-3 text-right">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-3 text-right font-medium">{formatCurrency(item.subtotal)}</td>
                </tr>
              ))}

              {additionalServices.length > 0 && (
                <>
                  <tr>
                    <td colSpan={4} className="pt-4 pb-2">
                      <h3 className="text-sm font-medium">Dịch vụ bổ sung</h3>
                    </td>
                  </tr>
                  {additionalServices.map((service) => (
                    <tr key={service.id} className="border-b border-gray-100">
                      <td className="py-3">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium">{service.name}</div>
                            <div className="text-xs text-gray-500">{service.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-center">1</td>
                      <td className="py-3 text-right">{formatCurrency(service.price)}</td>
                      <td className="py-3 text-right font-medium">{formatCurrency(service.price)}</td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}