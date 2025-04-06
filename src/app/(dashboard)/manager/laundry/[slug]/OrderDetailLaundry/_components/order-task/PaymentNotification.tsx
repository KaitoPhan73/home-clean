import React from "react";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

interface PaymentNotificationProps {
  show: boolean;
  onClose: () => void;
}

const PaymentNotification: React.FC<PaymentNotificationProps> = ({
  show,
  onClose,
}) => {
  if (!show) return null;

  return (
    <div className="fixed right-4 top-4 z-50 animate-in fade-in slide-in-from-top-5">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg max-w-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <Bell className="h-5 w-5 text-yellow-600" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Chờ thanh toán
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Đã cập nhật trạng thái đơn hàng. Vui lòng thanh toán để tiếp tục
                bước tiếp theo.
              </p>
            </div>
            <div className="mt-4">
              <div className="-mx-2 -my-1.5 flex">
                <Button
                  onClick={onClose}
                  size="sm"
                  variant="outline"
                  className="rounded-md bg-yellow-50 px-2 py-1.5 text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-yellow-50"
                >
                  Đóng
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentNotification;