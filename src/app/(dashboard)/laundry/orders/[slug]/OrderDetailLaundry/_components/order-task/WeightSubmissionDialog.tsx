/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scale, CheckCircle2, AlertCircle } from "lucide-react";
import { httpVinLaundry } from "@/lib/http";

interface ItemType {
  id: string;
  name: string;
  itemCode: string;
  defaultPrice?: number;
  pricePerKg?: number;
}

interface WeightItem {
  itemTypeId: string;
  weight: number | '';
}

interface WeightSubmissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  onSubmitSuccess: () => void;
}

const WeightSubmissionDialog: React.FC<WeightSubmissionDialogProps> = ({
  open,
  onOpenChange,
  orderId,
  onSubmitSuccess,
}) => {
  const [itemTypes, setItemTypes] = useState<ItemType[]>([]);
  const [weightItems, setWeightItems] = useState<WeightItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      fetchOrderDetails();
    } else {
      // Reset state when dialog closes
      setSuccess(false);
      setError(null);
    }
  }, [open, orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch order details to get item types
      const response = await httpVinLaundry.get(`/orders/${orderId}`);
      
      // Extract item types from order details
      const orderData = response.payload as {
        orderDetailsByKg?: { itemTypeResponse?: { name: string; itemCode: string; pricePerKg?: number }; itemTypeId: string }[];
        orderDetailsByItem?: { itemTypeResponse?: { name: string; itemCode: string; defaultPrice?: number }; itemTypeId: string }[];
      };
      
      // Combine items from both orderDetailsByKg and orderDetailsByItem
      const allItemTypes: ItemType[] = [];
      
      // Add items from orderDetailsByKg
      if (orderData.orderDetailsByKg && Array.isArray(orderData.orderDetailsByKg)) {
        orderData.orderDetailsByKg.forEach(item => {
          if (item.itemTypeResponse) {
            allItemTypes.push({
              id: item.itemTypeId,
              name: item.itemTypeResponse.name,
              itemCode: item.itemTypeResponse.itemCode,
              pricePerKg: item.itemTypeResponse.pricePerKg
            });
          }
        });
      }
      
      // Add items from orderDetailsByItem
      if (orderData.orderDetailsByItem && Array.isArray(orderData.orderDetailsByItem)) {
        orderData.orderDetailsByItem.forEach(item => {
          if (item.itemTypeResponse) {
            allItemTypes.push({
              id: item.itemTypeId,
              name: item.itemTypeResponse.name,
              itemCode: item.itemTypeResponse.itemCode,
              defaultPrice: item.itemTypeResponse.defaultPrice
            });
          }
        });
      }
      
      // Initialize weight items with empty weights
      const initialWeightItems: WeightItem[] = allItemTypes.map(itemType => ({
        itemTypeId: itemType.id,
        weight: ''
      }));
      
      setItemTypes(allItemTypes);
      setWeightItems(initialWeightItems);
    } catch (err: any) {
      console.error("Failed to fetch order details:", err);
      setError(err.response?.data?.description || "Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleWeightChange = (itemTypeId: string, value: string) => {
    // Validate input to allow only numbers and decimal point
    if (!/^(\d*\.?\d*)$/.test(value) && value !== '') return;
    
    const newWeight = value === '' ? '' : parseFloat(value);
    
    setWeightItems(prevItems => 
      prevItems.map(item => 
        item.itemTypeId === itemTypeId 
          ? { ...item, weight: newWeight } 
          : item
      )
    );
  };

  const handleSubmit = async () => {
    // Validate all weights are filled
    const invalidWeights = weightItems.filter(item => item.weight === '' || item.weight <= 0);
    if (invalidWeights.length > 0) {
      setError("Vui lòng nhập số kg hợp lệ cho tất cả các loại hàng.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      // Format data for API submission
      // Filter out any items with empty weights and ensure weight is a number
      const submissionData = weightItems
        .filter(item => item.weight !== '')
        .map(item => ({
          itemTypeId: item.itemTypeId,
          weight: typeof item.weight === 'number' ? item.weight : 0
        }));
      
      // Submit weights to API
      await httpVinLaundry.put(`/orders/${orderId}/submit-weight`, submissionData);
      
      setSuccess(true);
      // Call the success callback
      onSubmitSuccess();
      
      // Close dialog after a short delay
      setTimeout(() => {
        onOpenChange(false);
      }, 2000);
    } catch (err: any) {
      console.error("Failed to submit weights:", err);
      setError(err.response?.data?.description || "Không thể cập nhật trọng lượng. Vui lòng thử lại sau.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Scale className="mr-2 h-5 w-5 text-blue-600" />
            Nhập trọng lượng thực tế
          </DialogTitle>
          <DialogDescription>
            Vui lòng nhập trọng lượng thực tế (kg) cho từng loại hàng hóa.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="space-y-3 py-4">
            <div className="h-12 bg-gray-100 rounded animate-pulse"></div>
            <div className="h-12 bg-gray-100 rounded animate-pulse"></div>
          </div>
        ) : success ? (
          <div className="py-6 flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-lg font-medium text-green-700">Cập nhật thành công</h3>
            <p className="text-sm text-gray-600 mt-2">
              Trọng lượng đã được cập nhật và đơn hàng sẽ được xử lý tiếp.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4 py-3 max-h-[60vh] overflow-y-auto pr-1">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
              
              <div className="bg-blue-50 p-3 rounded-md mb-4">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Lưu ý:</span> Nhập chính xác trọng lượng để đảm bảo tính phí đúng cho khách hàng.
                </p>
              </div>
              
              {itemTypes.length === 0 ? (
                <p className="text-sm text-gray-500 italic">Không tìm thấy loại hàng hóa nào trong đơn hàng.</p>
              ) : (
                <div className="space-y-4">
                  {itemTypes.map((itemType, index) => (
                    <div key={itemType.id} className="space-y-2 p-3 border border-gray-200 rounded-md">
                      <div className="flex justify-between">
                        <Label htmlFor={`weight-${itemType.id}`} className="font-medium">
                          {itemType.name} <span className="text-gray-500">({itemType.itemCode})</span>
                        </Label>
                        {itemType.pricePerKg && (
                          <span className="text-sm text-gray-600">{itemType.pricePerKg.toLocaleString()} VNĐ/kg</span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <Input
                          id={`weight-${itemType.id}`}
                          type="text"
                          placeholder="0.0"
                          value={weightItems[index]?.weight}
                          onChange={(e) => handleWeightChange(itemType.id, e.target.value)}
                          className="text-right"
                        />
                        <span className="ml-2 text-gray-600">kg</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter className="sm:justify-between">
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
                Hủy
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={submitting || itemTypes.length === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Đang xử lý
                  </span>
                ) : (
                  "Xác nhận trọng lượng"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WeightSubmissionDialog;