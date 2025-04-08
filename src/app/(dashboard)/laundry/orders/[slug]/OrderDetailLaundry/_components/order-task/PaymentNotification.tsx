/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusEnum } from "./TaskEnums";
import { CreditCard } from "lucide-react";

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
  const handlePayment = () => {
    // Giả lập thanh toán
    onWeightSubmitted();
  };

  if (orderStatus !== OrderStatusEnum.PendingPayment) {
    return null;
  }

  return (
    <Card className="p-4 border-orange-200 bg-orange-50 animate-pulse">
      <div className="flex flex-col space-y-4">
        <div className="flex items-start">
          <div className="bg-orange-100 p-2 rounded-full mr-4">
            <CreditCard className="h-5 w-5 text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-orange-700">Đơn hàng chờ thanh toán</h3>
            <p className="text-sm text-orange-600 mt-1">
              Trọng lượng đã được cập nhật. Vui lòng tiến hành thanh toán để tiếp tục.
            </p>
          </div>
        </div>

        <div className="flex space-x-2 mt-2">
          <Button
            onClick={handlePayment}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Tiến hành thanh toán
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PaymentStatusNotification;