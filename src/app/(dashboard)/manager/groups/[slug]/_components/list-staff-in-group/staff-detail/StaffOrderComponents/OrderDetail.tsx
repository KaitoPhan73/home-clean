import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPinIcon, UserIcon } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { TOrderResponse } from "@/schema/order.schema";

// Helper function to get color for status badge
export const getStatusColor = (status: string | null) => {
  if (!status) return "bg-gray-500";
  switch (status.toLowerCase()) {
    case "completed":
    case "hoàn thành":
      return "bg-green-500";
    case "in_progress":
    case "đang xử lý":
      return "bg-blue-500";
    case "pending":
    case "chờ xử lý":
      return "bg-yellow-500";
    case "cancelled":
    case "đã hủy":
      return "bg-red-500";
    case "accepted":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
};

interface OrderDetailProps {
  order: TOrderResponse;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ order }) => {
  return (
    <Card className="rounded-none border-0 border-b last:border-b-0">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center">
              <span className="font-medium">#{order.code}</span>
              {order.emergencyRequest && (
                <Badge className="ml-2 bg-red-500">Khẩn cấp</Badge>
              )}
            </CardTitle>
            <CardDescription className="flex items-center mt-1">
              <UserIcon className="h-3 w-3 mr-1" />
              <span>Khách hàng: {order.userId?.slice(0, 8)}...</span>
            </CardDescription>
          </div>
          <Badge className={getStatusColor(order.status)}>
            {order.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-sm text-gray-600 space-y-1">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span>
              Thời gian:{" "}
              {format(new Date(order.createdAt), "HH:mm", {
                locale: vi,
              })}
            </span>
          </div>
          <div className="flex items-center">
            <MapPinIcon className="h-3 w-3 mr-1" />
            <span>Địa chỉ: {order.address?.slice(0, 50)}...</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="text-sm">
          <span className="font-medium">Dịch vụ:</span>{" "}
          {order.serviceType || "Dịch vụ vệ sinh"}
        </div>
        <div className="text-sm font-semibold text-green-600">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(order.totalAmount)}
        </div>
      </CardFooter>
    </Card>
  );
};

export default OrderDetail;