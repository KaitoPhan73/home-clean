/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getOrderItemsForWeightSubmission, submitOrderWeight } from "@/apis/laudry/WeightSubmissionItem";
import { Loader2, AlertCircle, Info } from "lucide-react";

interface WeightSubmissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  onSubmit: () => void;
}

interface WeightItem {
  id: string;
  itemTypeId: string;
  name: string;
  quantity?: number;
  currentWeight: number;
  actualWeight: number | null;
  unitPrice: number;
  priceType: "perKg" | "perItem" | "both";
  newWeight?: number; // For user input
}

const WeightSubmissionDialog: React.FC<WeightSubmissionDialogProps> = ({
  open,
  onOpenChange,
  orderId,
  onSubmit,
}) => {
  const [items, setItems] = useState<WeightItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noWeightItems, setNoWeightItems] = useState(false);

  useEffect(() => {
    if (open && orderId) {
      fetchItems();
    }
  }, [open, orderId]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      setNoWeightItems(false);
      
      const response = await getOrderItemsForWeightSubmission(orderId);
      
      if (!response.orderDetails) {
        throw new Error("Không lấy được thông tin đơn hàng");
      }
      
      const orderData = response.orderDetails;
      const weightableItems: WeightItem[] = [];
      
      // Chỉ xử lý các mặt hàng tính theo kg
      if (orderData.orderDetailsByKg && orderData.orderDetailsByKg.length > 0) {
        orderData.orderDetailsByKg.forEach(item => {
          weightableItems.push({
            id: item.id,
            itemTypeId: item.itemTypeId,
            name: item.itemTypeResponse?.name || "Mặt hàng không xác định",
            currentWeight: item.weight || 0,
            actualWeight: item.actualWeight,
            unitPrice: item.unitPrice || 0,
            priceType: "perKg",
            newWeight: item.actualWeight || item.weight || 0
          });
        });
      }
      
      // Removed processing of orderDetailsByItem items
      
      if (weightableItems.length === 0) {
        setNoWeightItems(true);
      }
      
      setItems(weightableItems);
    } catch (err) {
      console.error("Error fetching items:", err);
      setError("Không thể tải danh sách mặt hàng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleWeightChange = (itemId: string, value: string) => {
    const newWeight = parseFloat(value) || 0;
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, newWeight } : item
      )
    );
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);
      
      // If there are no weight items or all items are from orderDetailsByItem, send an empty array
      if (items.length === 0) {
        await submitOrderWeight(orderId, []);
        onSubmit();
        onOpenChange(false);
        return;
      }
      
      const submissionItems = items
        .filter(item => item.newWeight !== undefined)
        .map(item => ({
          itemTypeId: item.itemTypeId,
          weight: item.newWeight!,
        }));

      await submitOrderWeight(orderId, submissionItems);
      onSubmit(); // Call the parent onSubmit to update order status
      onOpenChange(false);
    } catch (err) {
      console.error("Error submitting weights:", err);
      setError("Không thể cập nhật trọng lượng. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Cập nhật trọng lượng đơn hàng</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Đang tải dữ liệu...</span>
            </div>
          ) : error ? (
            <div className="flex items-center text-red-500 p-4 border border-red-200 rounded-md bg-red-50">
              <AlertCircle className="h-5 w-5 mr-2" />
              <p>{error}</p>
            </div>
          ) : noWeightItems ? (
            <div className="flex items-center text-blue-500 p-4 border border-blue-200 rounded-md bg-blue-50">
              <Info className="h-5 w-5 mr-2" />
              <div>
                <p className="font-medium">Đơn hàng không có mặt hàng tính theo kg</p>
                <p className="text-sm text-blue-600 mt-1">
                  Đơn hàng này không chứa mặt hàng nào tính theo kg. Bạn có thể tiếp tục để xác nhận.
                </p>
              </div>
            </div>
          ) : items.length === 0 ? (
            <p className="text-center text-gray-500 py-4">Không có mặt hàng nào cần cập nhật trọng lượng.</p>
          ) : (
            <>
              <div className="grid grid-cols-12 gap-4 items-center font-medium mb-2 border-b pb-2">
                <div className="col-span-4">Tên mặt hàng</div>
                <div className="col-span-3">Trọng lượng mới (kg)</div>
                <div className="col-span-2">Hiện tại</div>
              </div>
              
              {items.map(item => (
                <div key={item.id} className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-4">
                    <Label htmlFor={`weight-${item.id}`}>
                      {item.name}
                      {item.quantity && item.quantity > 1 ? ` (x${item.quantity})` : ''}
                      {item.priceType === "both" && 
                        <span className="text-xs text-blue-500 block">Tính theo item</span>
                      }
                      {item.priceType === "perItem" && 
                        <span className="text-xs text-gray-500 block">Có thể tính theo kg</span>
                      }
                    </Label>
                  </div>
                  <div className="col-span-3">
                    <Input
                      id={`weight-${item.id}`}
                      type="number"
                      value={item.newWeight ?? ""}
                      onChange={(e) => handleWeightChange(item.id, e.target.value)}
                      min={0}
                      step={0.1}
                      className="w-full"
                      placeholder="Nhập kg"
                    />
                  </div>
                  <div className="col-span-2 text-sm text-gray-500">
                    {item.actualWeight !== null ? item.actualWeight : item.currentWeight} kg
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Hủy
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || submitting}
            className="min-w-[100px]"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : "Xác nhận"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WeightSubmissionDialog;