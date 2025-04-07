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
  onWeightSubmitted
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
        <div className="flex items-center">
          <AlertTriangle className="mr-2 h-5 w-5 text-yellow-600" />
          <div>
            <p className="text-sm font-medium text-yellow-800">
              Đơn hàng đang chờ thanh toán
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              Sau khi khách hàng thanh toán, bạn có thể nhập số kg thực tế để hoàn tất đơn hàng.
            </p>
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <Button
            size="sm"
            variant="outline"
            className="mr-2 border-yellow-400 text-yellow-700 hover:bg-yellow-100"
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
    </>
  );
};

export default PaymentStatusNotification;