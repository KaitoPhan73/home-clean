import React from "react";
import { OrderStatusEnum } from "./TaskEnums";
import { CheckCircle, Clock, CreditCard, Package, XCircle } from "lucide-react";

interface OrderStatusHeaderProps {
  orderStatus: OrderStatusEnum;
}

const OrderStatusHeader: React.FC<OrderStatusHeaderProps> = ({ orderStatus }) => {
  const getOrderStatusIcon = () => {
    switch (orderStatus) {
      case OrderStatusEnum.Draft:
        return <Clock className="mr-2 h-5 w-5 text-gray-600" />;
      case OrderStatusEnum.PendingPayment:
        return <CreditCard className="mr-2 h-5 w-5 text-yellow-600" />;
      case OrderStatusEnum.Processing:
        return <Package className="mr-2 h-5 w-5 text-blue-600" />;
      case OrderStatusEnum.Completed:
        return <CheckCircle className="mr-2 h-5 w-5 text-green-600" />;
      case OrderStatusEnum.Cancelled:
        return <XCircle className="mr-2 h-5 w-5 text-red-600" />;
      case OrderStatusEnum.Paid:
        return <CreditCard className="mr-2 h-5 w-5 text-green-600" />;
      default:
        return <Clock className="mr-2 h-5 w-5 text-gray-600" />;
    }
  };

  const getOrderStatusText = () => {
    switch (orderStatus) {
      case OrderStatusEnum.Draft:
        return "Nháp";
      case OrderStatusEnum.PendingPayment:
        return "Chờ thanh toán";
      case OrderStatusEnum.Processing:
        return "Đang xử lý";
      case OrderStatusEnum.Completed:
        return "Hoàn thành";
      case OrderStatusEnum.Cancelled:
        return "Đã hủy";
      case OrderStatusEnum.Paid:
        return "Đã thanh toán";
      default:
        return "Không xác định";
    }
  };

  const getOrderStatusColor = () => {
    switch (orderStatus) {
      case OrderStatusEnum.Draft:
        return "bg-gray-100 text-gray-800";
      case OrderStatusEnum.PendingPayment:
        return "bg-yellow-100 text-yellow-800";
      case OrderStatusEnum.Processing:
        return "bg-blue-100 text-blue-800";
      case OrderStatusEnum.Completed:
        return "bg-green-100 text-green-800";
      case OrderStatusEnum.Cancelled:
        return "bg-red-100 text-red-800";
      case OrderStatusEnum.Paid:
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      className={`sticky top-0 z-10 px-4 py-3 rounded-lg shadow-sm backdrop-blur-sm backdrop-filter bg-opacity-90 border transition-all duration-300 ease-in-out hover:shadow-md 
        ${orderStatus === OrderStatusEnum.Completed 
          ? 'bg-green-50 border-green-200' 
          : orderStatus === OrderStatusEnum.Processing
            ? 'bg-blue-50 border-blue-200'
            : orderStatus === OrderStatusEnum.PendingPayment
              ? 'bg-yellow-50 border-yellow-200'
            : orderStatus === OrderStatusEnum.Paid
              ? 'bg-emerald-50 border-emerald-200'
              : orderStatus === OrderStatusEnum.Cancelled
                ? 'bg-red-50 border-red-200'
                : 'bg-gray-50 border-gray-200'
        }`}
    >
      <div className="flex items-center">
        {getOrderStatusIcon()}
        <div>
          <p className="text-sm text-gray-600">Trạng thái đơn hàng</p>
          <p className="font-medium">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOrderStatusColor()}`}
            >
              {getOrderStatusText()}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusHeader;