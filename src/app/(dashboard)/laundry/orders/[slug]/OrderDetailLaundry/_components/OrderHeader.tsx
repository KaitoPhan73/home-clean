/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowLeft, Clock, RefreshCw, Ban } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDate, handleErrorApi } from "@/lib/utils";
import { TOrderLaundryResponse } from "@/schema/VinLaudry/laundry-order";
import { useState } from "react";
import CancelOrderDialog from "./CancelOrderDialog";
import { cancelOrder } from "@/apis/laudry/order";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface OrderHeaderProps {
  order: TOrderLaundryResponse;
  onRefresh: () => void;
  refreshing: boolean;
  tasks?: any[]; // Add this to check task 2 status
}

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { color: string; label: string }> = {
    Draft: { color: "bg-gray-100 text-gray-800", label: "Đơn mới" },
    PendingPayment: {
      color: "bg-yellow-100 text-yellow-800",
      label: "Chờ thanh toán",
    },
    Processing: { color: "bg-blue-100 text-blue-800", label: "Đang xử lý" },
    Completed: { color: "bg-green-100 text-green-800", label: "Hoàn thành" },
    Cancelled: { color: "bg-red-100 text-red-800", label: "Đã hủy" },
    Paid: { color: "bg-emerald-100 text-emerald-800", label: "Đã thanh toán" },
  };

  const statusInfo = statusMap[status] || {
    color: "bg-gray-100 text-gray-800 border border-gray-200",
    label: status,
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
    >
      {statusInfo.label}
    </span>
  );
};

export default function OrderHeader({
  order,
  onRefresh,
  refreshing,
  tasks = [],
}: OrderHeaderProps) {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const canCancel = () => {
    // Check if order is not yet paid and not cancelled
    const isBeforePaid = !["Paid", "Cancelled", "Completed"].includes(
      order.status
    );

    // Check if task 2 is not yet completed
    const isBeforeTask2Completed =
      !tasks || tasks.length < 2 || tasks[1]?.status !== "Completed";

    return isBeforePaid && isBeforeTask2Completed;
  };

  const handleCancelOrder = async () => {
    setIsLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken") || "";
      const result = await cancelOrder(order.id, accessToken);

      if (result.success) {
        toast({
          title: "Đơn hàng đã hủy",
          description: `Đơn hàng ${order.orderCode} đã được hủy thành công.`,
          variant: "default",
        });

        // Dispatch custom event to update order status
        const event = new CustomEvent("orderStatusChanged", {
          detail: { orderId: order.id, status: "Cancelled" },
        });
        window.dispatchEvent(event);

        // Refresh the page
        router.refresh();
        onRefresh();
      } else {
        toast({
          title: "Lỗi",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      handleErrorApi({
        error,
      });
    } finally {
      setIsLoading(false);
      setCancelDialogOpen(false);
    }
  };

  return (
    <>
      <Card className="mb-3 shadow-sm border-slate-200">
        <CardHeader className="p-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Link href="/laundry/orders">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-slate-100"
                >
                  <ArrowLeft className="h-5 w-5 text-slate-600" />
                </Button>
              </Link>
              <h1 className="text-lg font-semibold text-slate-800">
                Đơn giặt sấy mã #{" "}
                <span className="text-indigo-600">{order.orderCode}</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-500 flex items-center bg-slate-50 px-2 py-1 rounded">
                <Clock className="h-4 w-4 mr-1 text-slate-400" />
                {formatDate(order.orderDate)}
              </span>
              {getStatusBadge(order.status)}

              <Button
                onClick={onRefresh}
                variant="outline"
                className="text-blue-600 border-blue-300 hover:bg-blue-50"
                disabled={refreshing || isLoading}
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                />
                {refreshing ? "Đang làm mới..." : "Làm mới"}
              </Button>

              {canCancel() && (
                <Button
                  onClick={() => setCancelDialogOpen(true)}
                  variant="outline"
                  className="text-red-600 border-red-300 hover:bg-red-50"
                  disabled={isLoading}
                >
                  <Ban className="mr-2 h-4 w-4" />
                  Hủy đơn hàng
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <CancelOrderDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onConfirm={handleCancelOrder}
        orderCode={order.orderCode}
        isLoading={isLoading}
      />
    </>
  );
}