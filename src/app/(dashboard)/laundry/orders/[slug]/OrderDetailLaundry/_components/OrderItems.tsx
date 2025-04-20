/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShoppingBag, Scale, Tag, AlertCircle } from "lucide-react";
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
  serviceType?: string;
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

// Updated OrderItems component
export function OrderItems({
  items,
  additionalServices,
  orderCode,
  status,
  orderDetailsByItem = [],
  orderDetailsByKg = [],
  orderAdditionalServicesResponse,
  totalAmount,
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

  const isEmpty =
    (!items || items.length === 0) &&
    (!orderDetailsByItem || orderDetailsByItem.length === 0) &&
    (!orderDetailsByKg || orderDetailsByKg.length === 0);

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
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Đơn hàng đang được xử lý
              </h3>
              <p className="text-gray-500 max-w-md">
                Hiện tại đơn hàng này đang được đặt giặt theo kg. Hãy đợi nhân
                viên phân loại và update quần áo để list ra thông tin nhé!
              </p>
            </div>
          ) : (
            <>
              {processedItems.length > 0 && (
                <div className="mb-6">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-500 text-sm border-b">
                        <th className="pb-2">Mặt hàng</th>
                        <th className="pb-2 text-center">Số lượng</th>
                        {/* <th className="pb-2 text-right">Đơn giá</th> */}
                        <th className="pb-2 text-right">Thành điểm</th>
                      </tr>
                    </thead>
                    <tbody>
                      {processedItems.map((item) => {
                        const isWeightBased = !!item.weight && item.weight > 0;
                        const displayedPrice = isWeightBased
                          ? item.pricePerKg || item.unitPrice
                          : item.pricePerItem || item.unitPrice;

                        return (
                          <tr
                            key={item.id}
                            className="border-b border-gray-100"
                          >
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
                                    {isWeightBased ? (
                                      <span className="ml-2 px-1.5 py-0.5 bg-green-50 text-green-700 rounded text-xs">
                                        Tính theo kg
                                      </span>
                                    ) : (
                                      <span className="ml-2 px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                                        Tính theo Item
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
                            {/* <td className="py-3 text-right">
                              {isWeightBased
                                ? `${item.pricePerKg} Point / kg`
                                : `${item.pricePerItem} Point / item`}
                            </td> */}
                            <td className="py-3 text-right font-medium">
                              {item.subtotal} Point
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* Additional services - always show if present, regardless of item status */}
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

          {/* Show total amount if provided */}
          {totalAmount !== undefined && totalAmount !== null && (
            <div className="border-t border-gray-200 pt-4 mt-2">
              <div className="flex justify-between items-center text-lg font-medium">
                <span>Tổng cộng:</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
