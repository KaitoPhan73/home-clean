import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Scale, CreditCard, AlertTriangle } from "lucide-react";
import { OrderStatusEnum } from "./TaskEnums";
import WeightSubmissionDialog from "./WeightSubmissionDialog";

interface PaymentStatusNotificationProps {
  orderId: string;
  orderStatus: OrderStatusEnum;
  onWeightSubmitted: () => void;
}

const PaymentStatusNotification: React.FC<PaymentStatusNotificationProps> = ({
  orderId,
  orderStatus,
  onWeightSubmitted,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  if (orderStatus !== OrderStatusEnum.PendingPayment) {
    return null;
  }

  return (
    <>
      <WeightSubmissionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        orderId={orderId}
        onSubmitSuccess={onWeightSubmitted}
      />

      <div className="px-4 py-3 rounded-lg bg-yellow-50 border border-yellow-200">
        <div className="flex items-center space-x-4"> {/* Thêm space-x-4 để tạo khoảng cách ngang */}
          <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" /> {/* Ngăn icon co lại */}
          <div className="flex-1 space-y-1"> {/* Thêm space-y-1 để tạo khoảng cách dọc giữa các dòng text */}
            <p className="text-sm font-medium text-yellow-800">
              Đơn hàng đang chờ thanh toán
            </p>
            <p className="text-xs text-yellow-700">
              Bạn cần nhập số kg thực tế trước khi khách hàng thanh toán để hoàn tất đơn hàng.
            </p>
          </div>
          <div className="flex space-x-2"> {/* Thêm space-x-2 để tạo khoảng cách giữa các button */}
            <Button
              size="sm"
              variant="outline"
              className="border-yellow-400 text-yellow-700 hover:bg-yellow-100"
              onClick={() => {}}
            >
              <CreditCard className="mr-1 h-4 w-4" />
              Đánh dấu đã thanh toán
            </Button>
            <Button
              size="sm"
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
              onClick={() => setDialogOpen(true)}
            >
              <Scale className="mr-1 h-4 w-4" />
              Nhập trọng lượng
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentStatusNotification;