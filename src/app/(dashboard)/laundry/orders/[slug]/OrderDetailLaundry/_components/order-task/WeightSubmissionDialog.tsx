/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Scale, Loader2, Save, ShoppingBag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { getItemTypesByServiceTypeId } from "@/apis/laudry/service-type";
import { submitOrderWeight } from "@/apis/laudry/WeightSubmissionItem";
import { TItemTypeResponse } from "@/schema/VinLaudry/item-type.schema";
import { getOrderById } from "@/apis/laudry/order";

interface WeightSubmissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  onSubmit: () => void;
}

interface ItemWeight {
  itemTypeId: string;
  weight: number;
}

interface OrderDetailsByItem {
  id: string;
  itemTypeId: string;
  quantity: number;
  itemTypeResponse: {
    name: string;
    pricePerItem: number;
  };
}

const WeightSubmissionDialog: React.FC<WeightSubmissionDialogProps> = ({
  open,
  onOpenChange,
  orderId,
  onSubmit,
}) => {
  const serviceTypeId = "7741d4d4-403e-4b50-902e-6b6c31080d2f";
  const [itemTypes, setItemTypes] = useState<TItemTypeResponse[]>([]);
  const [itemWeights, setItemWeights] = useState<ItemWeight[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isItemBasedOrder, setIsItemBasedOrder] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderDetailsByItem[]>([]);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        // Fetch order details first to determine if it's by item or by kg
        const orderResponse = await getOrderById(orderId);
        const orderData = orderResponse;
        
        if (orderData && orderData.orderDetailsByItem?.length > 0) {
          setIsItemBasedOrder(true);
          setOrderItems(
            orderData.orderDetailsByItem.map((item: any) => ({
              ...item,
              itemTypeResponse: {
                ...item.itemTypeResponse,
                pricePerItem: item.itemTypeResponse.pricePerItem ?? 0,
              },
            }))
          );
        } else {
          setIsItemBasedOrder(false);
          // If not item-based, fetch available item types for kg-based order
          const itemTypesResponse = await getItemTypesByServiceTypeId(serviceTypeId);
          const items = itemTypesResponse?.payload.items || [];
          
          if (Array.isArray(items)) {
            setItemTypes(items);
            setItemWeights(
              items.map((item) => ({
                itemTypeId: item.id,
                weight: 0,
              }))
            );
          } else {
            setItemTypes([]);
            setItemWeights([]);
            setError("Không tìm thấy loại hàng cho dịch vụ này.");
          }
        }
      } catch (err: any) {
        console.error("Error fetching order data:", err.message, err.response?.data);
        setError("Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchOrderData();
    }
  }, [open, orderId, serviceTypeId]);

  const handleWeightChange = (itemTypeId: string, value: string) => {
    const weightValue = parseFloat(value) || 0;
    setItemWeights(
      itemWeights.map((item) =>
        item.itemTypeId === itemTypeId ? { ...item, weight: weightValue } : item
      )
    );
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);
      
      if (isItemBasedOrder) {
        // For item-based orders, we can submit with empty weights
        await submitOrderWeight(orderId, []);
      } else {
        // For kg-based orders, we need at least one item with weight > 0
        const filteredWeights = itemWeights.filter((item) => item.weight > 0);
        if (filteredWeights.length === 0) {
          setError("Vui lòng nhập ít nhất một loại hàng với trọng lượng lớn hơn 0.");
          setSubmitting(false);
          return;
        }
        await submitOrderWeight(orderId, filteredWeights);
      }
      
      onSubmit();
    } catch (err) {
      console.error("Error submitting weights:", err);
      setError("Không thể cập nhật trọng lượng. Vui lòng thử lại sau.");
    } finally {
      setSubmitting(false);
    }
  };

  const totalWeight = itemWeights.reduce((sum, item) => sum + item.weight, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {isItemBasedOrder ? (
              <>
                <ShoppingBag className="h-5 w-5 text-blue-600" />
                Xác nhận chi tiết đơn hàng
              </>
            ) : (
              <>
                <Scale className="h-5 w-5 text-blue-600" />
                Nhập trọng lượng hàng
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Đang tải...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-700 mb-4">
            {error}
          </div>
        ) : isItemBasedOrder ? (
          <>
            <div className="max-h-[400px] overflow-y-auto pr-1">
              <div className="bg-blue-50 p-4 rounded-md mb-4">
                <p className="text-blue-700">
                  Đây là đơn hàng theo món. Vui lòng xác nhận để tiếp tục quy trình xử lý.
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {orderItems.map((item) => (
                  <Card
                    key={item.id}
                    className="p-4 border-gray-200 hover:border-blue-300 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.itemTypeResponse.name}</h3>
                        <p className="text-sm text-gray-500">Mã: {item.itemTypeId}</p>
                      </div>
                      <div className="mt-3 md:mt-0 md:ml-4 flex items-center">
                        <span className="mr-4 text-gray-700">
                          Số lượng: <strong>{item.quantity}</strong>
                        </span>
                        <span className="whitespace-nowrap text-blue-700 font-medium">
                          {item.itemTypeResponse.pricePerItem.toLocaleString('vi-VN')} đ/món
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </>
        ) : itemTypes.length === 0 ? (
          <div className="bg-yellow-50 p-4 rounded-md text-yellow-700 mb-4">
            Không tìm thấy loại hàng cho dịch vụ này.
          </div>
        ) : (
          <>
            <div className="max-h-[400px] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 gap-4">
                {itemTypes.map((itemType) => (
                  <Card
                    key={itemType.id}
                    className="p-4 border-gray-200 hover:border-blue-300 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{itemType.name}</h3>
                        <p className="text-sm text-gray-500">{itemType.id}</p>
                      </div>
                      <div className="mt-3 md:mt-0 md:ml-4 flex items-center">
                        <Label
                          htmlFor={`weight-${itemType.id}`}
                          className="mr-2 whitespace-nowrap text-gray-700"
                        >
                          Trọng lượng (kg):
                        </Label>
                        <Input
                          id={`weight-${itemType.id}`}
                          type="number"
                          min="0"
                          step="0.01"
                          className="w-24 text-right"
                          value={
                            itemWeights.find((item) => item.itemTypeId === itemType.id)?.weight || 0
                          }
                          onChange={(e) => handleWeightChange(itemType.id, e.target.value)}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-md mt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-blue-800">Tổng trọng lượng:</span>
                <span className="font-bold text-blue-800 text-lg">
                  {totalWeight.toFixed(2)} kg
                </span>
              </div>
            </div>
          </>
        )}
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={loading || submitting}
          >
            {submitting ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </span>
            ) : (
              <span className="flex items-center">
                <Save className="mr-2 h-4 w-4" />
                {isItemBasedOrder ? "Xác nhận" : "Lưu trọng lượng"}
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WeightSubmissionDialog;