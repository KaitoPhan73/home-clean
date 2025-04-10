// components/OrderDetailsPopup/CancellationTab.tsx
import { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface CancellationTabProps {
  cancelReason: string;
  setCancelReason: (value: string) => void;
  refundMethod: string;
  setRefundMethod: (value: string) => void;
  isCancelling: boolean;
  handleCancelOrder: () => void;
}

const paymentMethods = [
  {
    id: "233423b8-b936-472f-af5c-335934263bb6",
    name: "Wallet",
  },
];

// Predefined cancellation reasons
const predefinedReasons = [
  "Khách hàng yêu cầu hủy",
  "Không đủ nhân viên",
  "Lỗi hệ thống",
  "Thời gian không phù hợp",
  "Khác",
];

export const CancellationTab: React.FC<CancellationTabProps> = ({
  cancelReason,
  setCancelReason,
  refundMethod,
  setRefundMethod,
  isCancelling,
  handleCancelOrder,
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleConfirmClick = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmCancel = () => {
    if (confirmText === "Tôi xác nhận hủy") {
      handleCancelOrder();
      setIsConfirmOpen(false);
      setConfirmText("");
    }
  };

  return (
    <>
      <TabsContent value="cancellation" className="space-y-6">
        <div className="bg-red-50 p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
            <AlertCircle size={18} />
            Hủy đơn hàng
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cancelReason" className="text-gray-700">
                Lý do hủy
              </Label>
              <div className="flex gap-2 mt-1">
                <Select
                  value={predefinedReasons.includes(cancelReason) ? cancelReason : "Khác"}
                  onValueChange={(value) => setCancelReason(value === "Khác" ? "" : value)}
                >
                  <SelectTrigger className="w-1/3">
                    <SelectValue placeholder="Chọn lý do" />
                  </SelectTrigger>
                  <SelectContent>
                    {predefinedReasons.map((reason) => (
                      <SelectItem key={reason} value={reason}>
                        {reason}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  id="cancelReason"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Nhập lý do hủy đơn hàng"
                  className="w-2/3"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="refundMethod" className="text-gray-700">
                Phương thức hoàn tiền
              </Label>
              <Select value={refundMethod} onValueChange={setRefundMethod}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Chọn phương thức hoàn tiền" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.id} value={method.name}>
                      {method.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={isCancelling || !cancelReason || !refundMethod}
              onClick={handleConfirmClick}
            >
              {isCancelling ? (
                <>
                  <span className="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                  Đang hủy...
                </>
              ) : (
                "Xác nhận hủy đơn hàng"
              )}
            </Button>
          </div>
        </div>
      </TabsContent>

      {/* Modal xác nhận */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bạn có chắc chắn muốn hủy đơn hàng?</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 mb-2">
              Để xác nhận hủy, vui lòng nhập: <strong>Tôi xác nhận hủy</strong>
            </p>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Nhập xác nhận"
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              Hủy bỏ
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              disabled={confirmText !== "Tôi xác nhận hủy" || isCancelling}
              onClick={handleConfirmCancel}
            >
              Hủy đơn hàng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};