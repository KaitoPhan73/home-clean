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
import { Scale, Loader2, Save, ShoppingBag, Info, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { getItemTypesByServiceTypeId } from "@/apis/laudry/service-type";
import { submitOrderWeight } from "@/apis/laudry/WeightSubmissionItem";
import { TItemTypeResponse } from "@/schema/VinLaudry/item-type.schema";
import { getOrderById } from "@/apis/laudry/order";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

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
  const serviceTypeId = "f8f3965e-c72e-4d63-9ddc-eb38a2369946";
  const [itemTypes, setItemTypes] = useState<TItemTypeResponse[]>([]);
  const [itemWeights, setItemWeights] = useState<ItemWeight[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isItemBasedOrder, setIsItemBasedOrder] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderDetailsByItem[]>([]);

  const formatNumber = (value: number): string => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
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
    const itemType = itemTypes.find((item) => item.id === itemTypeId);
    const minWeight = itemType?.minWeight ?? 0;
    const maxWeight = itemType?.maxWeight ?? Infinity;
    let weightValue = parseFloat(value) || 0;

    if (weightValue < minWeight) {
      weightValue = minWeight;
    } else if (weightValue > maxWeight) {
      weightValue = maxWeight;
    }

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
        await submitOrderWeight(orderId, []);
      } else {
        const filteredWeights = itemWeights.filter((item) => item.weight > 0);
        if (filteredWeights.length === 0) {
          setError("Vui lòng nhập ít nhất một trọng lượng lớn hơn 0kg.");
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

  const calculateEstimatedCost = () => {
    return itemWeights.reduce((sum, itemWeight) => {
      const itemType = itemTypes.find(item => item.id === itemWeight.itemTypeId);
      if (itemType && itemWeight.weight > 0) {
        const price = itemType.pricePerKg || itemType.defaultPrice || 0;
        return sum + (price * itemWeight.weight);
      }
      return sum;
    }, 0);
  };

  const estimatedCost = calculateEstimatedCost();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl md:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="border-b pb-4">
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
        
        <div className="flex-1 overflow-hidden flex flex-col">
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
              <div className="bg-blue-50 p-4 rounded-md mb-4">
                <p className="text-blue-700 flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  Đây là đơn hàng theo món. Vui lòng xác nhận để tiếp tục quy trình xử lý.
                </p>
              </div>
              
              <div className="overflow-y-auto max-h-[400px] pr-2">
                <div className="grid grid-cols-1 gap-4">
                  {orderItems.map((item) => (
                    <Card
                      key={item.id}
                      className="p-4 border-gray-200 hover:border-blue-300 transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.itemTypeResponse.name}</h3>
                          <p className="text-sm text-gray-500">Mã: {item.itemTypeId.substring(0, 8)}...</p>
                        </div>
                        <div className="mt-3 md:mt-0 md:ml-4 flex items-center">
                          <Badge variant="outline" className="mr-4 bg-blue-50">
                            Số lượng: <span className="font-bold ml-1">{item.quantity}</span>
                          </Badge>
                          <span className="whitespace-nowrap text-blue-700 font-medium">
                            {formatNumber(item.itemTypeResponse.pricePerItem)} <Star className="h-4 w-4 inline-block text-yellow-500 ml-1" />
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
              <div className="overflow-y-auto max-h-[400px] pr-2 mb-4">
                <div className="grid grid-cols-1 gap-4">
                  {itemTypes.map((itemType) => {
                    const currentWeight = itemWeights.find((item) => item.itemTypeId === itemType.id)?.weight || 0;
                    const currentCost = currentWeight * (itemType.pricePerKg || itemType.defaultPrice || 0);
                    
                    return (
                      <Card
                        key={itemType.id}
                        className={`p-4 border-l-4 ${currentWeight > 0 ? 'border-l-blue-500' : 'border-l-gray-200'} hover:shadow-md transition-all`}
                      >
                        <div className="flex flex-col space-y-0">
                          <div className="flex flex-row justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center">
                                <h3 className="font-medium text-gray-900">{itemType.name}</h3>
                                {itemType.description && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Info className="h-4 w-4 ml-2 text-gray-400 cursor-help" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="max-w-xs">{itemType.description}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                                <p className="ml-3 text-xs text-gray-500">Mã: {itemType.itemCode}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {itemType.pricePerKg && (
                                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-0">
                                  {formatNumber(itemType.pricePerKg)} <Star className="h-4 w-4 inline-block text-yellow-500 ml-1" />
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                            <div className="flex items-center">
                              <Label
                                htmlFor={`weight-${itemType.id}`}
                                className="mr-2 whitespace-nowrap text-gray-700"
                              >
                                Trọng lượng (kg):
                              </Label>
                              <div className="relative">
                                <Input
                                  id={`weight-${itemType.id}`}
                                  type="number"
                                  min={itemType.minWeight ?? 0}
                                  max={itemType.maxWeight ?? undefined}
                                  step="0.01"
                                  className="w-28 text-right pr-8"
                                  value={currentWeight || ""}
                                  onChange={(e) => handleWeightChange(itemType.id, e.target.value)}
                                  placeholder="0.00"
                                />
                                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">kg</span>
                              </div>
                              
                              {itemType.maxWeight && (
                                <span className="ml-2 text-xs text-gray-500">
                                  Max: {itemType.maxWeight}kg
                                </span>
                              )}
                            </div>
                            
                            {currentWeight > 0 && (
                              <div className="text-right whitespace-nowrap font-medium">
                                Ước tính: <span className="text-green-600">{formatNumber(currentCost)} <Star className="h-4 w-4 inline-block text-yellow-500 ml-1" /></span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
              
              <div className="bg-blue-50 p-2 rounded-md border border-blue-100">
                <div className="flex flex-col space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-blue-800">Tổng trọng lượng:</span>
                    <span className="font-bold text-blue-800 text-lg">
                      {totalWeight.toFixed(2)} kg
                    </span>
                  </div>
                  
                  {estimatedCost > 0 && (
                    <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                      <span className="font-medium text-blue-800">Ước tính chi phí:</span>
                      <span className="font-bold text-green-600 text-lg">
                        {formatNumber(estimatedCost)} <Star className="h-4 w-4 inline-block text-yellow-500 ml-1" />
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between pt-4 border-t mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
            className="px-4"
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 px-6"
            disabled={loading || submitting || (!isItemBasedOrder && totalWeight === 0)}
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