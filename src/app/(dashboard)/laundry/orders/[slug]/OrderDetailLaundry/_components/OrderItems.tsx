/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShoppingBag, Scale, Tag } from "lucide-react";
import { formatCurrency } from "@/app/(dashboard)/manager/order-assignment/_components/order-management/OrderDetailsPopup/utils";
import { TOrderLaundryResponse } from "@/schema/VinLaudry/laundry-order";

interface ItemTypeResponse {
  id: string;
  itemCode: string;
  name: string;
  description: string | null;
  defaultPrice: number;
  pricePerItem: number | null;
  pricePerKg: number | null;
  imageUrl: string | null;
}

interface OrderDetailByItem {
  id: string;
  itemTypeId: string;
  quantity: number;
  weight: number;
  unitPrice: number;
  subtotal: number;
  notes: string | null;
  actualWeight: number | null;
  estimatedTime: string | null;
  actualCompletionTime: string | null;
  itemTypeResponse: ItemTypeResponse;
}

interface OrderDetailByKg {
  id: string;
  itemTypeId: string;
  quantity?: number;
  weight: number;
  unitPrice: number;
  subtotal: number | null;
  notes: string | null;
  actualWeight: number | null;
  estimatedTime: string | null;
  actualCompletionTime: string | null;
  itemTypeResponse?: ItemTypeResponse;
}

interface ItemType {
  name: string;
  itemCode: string;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  itemType: ItemType;
  weight?: number;
  pricePerKg?: number;
  pricePerItem?: number;
}

interface AdditionalService {
  id: string;
  name: string;
  description: string;
  price: number;
  serviceCode?: string;
}

interface OrderItemsProps {
  items?: OrderItem[];
  additionalServices?: AdditionalService[];
  orderCode?: string;
  status?: string;
  orderDetailsByItem?: OrderDetailByItem[];
  orderDetailsByKg?: OrderDetailByKg[];
  orderAdditionalServicesResponse?: AdditionalService[];
  totalAmount?: number;
}

// Transforms OrderDetailByItem to OrderItem format
const mapOrderDetailByItemToOrderItem = (
  detail: OrderDetailByItem
): OrderItem => ({
  id: detail.id,
  name: detail.itemTypeResponse.name,
  quantity: detail.quantity,
  unitPrice: detail.unitPrice,
  subtotal: detail.subtotal,
  weight: detail.weight,
  pricePerItem: detail.itemTypeResponse.pricePerItem || detail.unitPrice,
  itemType: {
    name: detail.itemTypeResponse.name,
    itemCode: detail.itemTypeResponse.itemCode,
  },
});

// Transforms OrderDetailByKg to OrderItem format
const mapOrderDetailByKgToOrderItem = (detail: OrderDetailByKg): OrderItem => ({
  id: detail.id,
  name: detail.itemTypeResponse?.name || "Unknown Item",
  quantity: detail.quantity || 1,
  unitPrice: detail.unitPrice,
  subtotal: detail.subtotal || 0,
  weight: detail.weight,
  pricePerKg: detail.unitPrice,
  itemType: {
    name: detail.itemTypeResponse?.name || "Unknown Item",
    itemCode: detail.itemTypeResponse?.itemCode || "Không tính theo kg",
  },
});

// Original OrderItems component
export function OrderItems({
  items,
  additionalServices,
  orderCode,
  status,
  orderDetailsByItem,
  orderDetailsByKg,
  orderAdditionalServicesResponse,
}: OrderItemsProps) {
  // Process items from different sources
  const processedItems: OrderItem[] = [];

  // Add items if directly provided
  if (items && items.length > 0) {
    processedItems.push(...items);
  }

  // Add items from orderDetailsByItem
  if (orderDetailsByItem && orderDetailsByItem.length > 0) {
    processedItems.push(
      ...orderDetailsByItem.map(mapOrderDetailByItemToOrderItem)
    );
  }

  // Add items from orderDetailsByKg
  if (orderDetailsByKg && orderDetailsByKg.length > 0) {
    processedItems.push(...orderDetailsByKg.map(mapOrderDetailByKgToOrderItem));
  }

  // Process services
  const displayServices =
    additionalServices || orderAdditionalServicesResponse || [];

  const renderStatusBadge = (status: string) => {
    if (!status) return null;

    const statusColors: Record<string, string> = {
      PendingPayment: "bg-yellow-100 text-yellow-800",
      Processing: "bg-blue-100 text-blue-800",
      Completed: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
      Delivered: "bg-purple-100 text-purple-800",
      Paid: "bg-green-100 text-green-800",
      Draft: "bg-gray-100 text-gray-800",
    };

    const color = statusColors[status] || "bg-gray-100 text-gray-800";

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {status}
      </span>
    );
  };

  return (
    <Card className="shadow-sm border-gray-200 mb-6">
      <CardHeader className="mb-6 bg-gradient-to-r from-blue-100 to-red-50 border-b border-gray-100 py-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">Chi tiết đơn hàng</CardTitle>
            {orderCode && (
              <p className="text-sm text-gray-500 mt-1">Mã đơn: {orderCode}</p>
            )}
          </div>
          {status && <div>{renderStatusBadge(status)}</div>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          {processedItems.length > 0 && (
            <div className="mb-6">
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
                  {processedItems.map((item) => {
                    const isWeightBased = !!item.weight && item.weight > 0;
                    const displayedPrice = isWeightBased
                      ? item.pricePerKg || item.unitPrice
                      : item.pricePerItem || item.unitPrice;

                    return (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="py-3">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                              {isWeightBased ? (
                                <Scale className="h-4 w-4" />
                              ) : (
                                <Tag className="h-4 w-4" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-xs text-gray-500">
                                Mã: {item.itemType.itemCode}
                                {isWeightBased && (
                                  <span className="ml-2 px-1.5 py-0.5 bg-green-50 text-green-700 rounded text-xs">
                                    Tính theo kg
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-center">
                          {isWeightBased
                            ? `${(item.weight ?? 0).toFixed(2)} kg`
                            : item.quantity}
                        </td>
                        <td className="py-3 text-right">
                          {displayedPrice ? (
                            `${formatCurrency(displayedPrice)} /kg`
                          ) : (
                            <span className="text-xs italic text-gray-500">
                              Không tính theo kg
                            </span>
                          )}
                        </td>

                        <td className="py-3 text-right font-medium">
                          {formatCurrency(item.subtotal)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Additional services */}
          {displayServices.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <ShoppingBag className="h-5 w-5 text-purple-600 mr-2" />
                <h3 className="text-md font-medium">Dịch vụ bổ sung</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500 text-sm border-b">
                    <th className="pb-2">Dịch vụ</th>
                    <th className="pb-2 text-center">Mã</th>
                    <th className="pb-2 text-right">Giá</th>
                  </tr>
                </thead>
                <tbody>
                  {displayServices.map((service) => (
                    <tr key={service.id} className="border-b border-gray-100">
                      <td className="py-3">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
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
                            <div className="text-xs text-gray-500">
                              {service.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-center">
                        {service.serviceCode || "-"}
                      </td>
                      <td className="py-3 text-right font-medium">
                        {formatCurrency(service.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
