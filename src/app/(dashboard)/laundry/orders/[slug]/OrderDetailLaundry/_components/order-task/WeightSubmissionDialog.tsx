/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Scale } from "lucide-react";

interface WeightSubmissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  onSubmit: () => void;
}

const WeightSubmissionDialog: React.FC<WeightSubmissionDialogProps> = ({
  open,
  onOpenChange,
  orderId,
  onSubmit,
}) => {
  const [weight, setWeight] = useState<string>("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!weight || isNaN(parseFloat(weight)) || parseFloat(weight) <= 0) {
      setError("Vui lòng nhập trọng lượng hợp lệ lớn hơn 0");
      return;
    }

    try {
      setProcessing(true);
      setError(null);
      
      // Here you would normally have an API call to update the order weight
      // For example: await updateOrderWeight(orderId, parseFloat(weight));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onOpenChange(false);
      onSubmit();
    } catch (err: any) {
      console.error("Error updating weight:", err);
      setError(err.response?.data?.message || "Không thể cập nhật trọng lượng. Vui lòng thử lại sau.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nhập trọng lượng thực tế</DialogTitle>
          <DialogDescription>
            Vui lòng nhập trọng lượng thực tế của đơn hàng để tính phí dịch vụ.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="weight" className="text-right">
              Trọng lượng
            </Label>
            <div className="col-span-3 relative">
              <Input
                id="weight"
                type="number"
                step="0.1"
                min="0"
                placeholder="0.0"
                value={weight}
                onChange={(e) => {
                  setWeight(e.target.value);
                  setError(null);
                }}
                className="pr-12"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500 sm:text-sm">kg</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 p-3 rounded-md text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="bg-blue-50 p-3 rounded-md">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-blue-700">
                <span className="font-medium">Lưu ý:</span> Sau khi nhập trọng lượng và xác nhận thanh toán, bạn có thể tiếp tục bước cuối cùng của quy trình.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={processing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {processing ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Đang xử lý
              </span>
            ) : (
              "Xác nhận"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WeightSubmissionDialog;