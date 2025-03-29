/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, ShieldAlert } from "lucide-react";
import { useOrderDetails } from "@/hooks/useOrderDetails";
import { OverviewTab } from "@/app/(dashboard)/manager/order-assignment/_components/order-management/OrderDetailsPopup/OrderDetailTab/OverviewTab";
import { ServicesTab } from "@/app/(dashboard)/manager/order-assignment/_components/order-management/OrderDetailsPopup/OrderDetailTab/ServicesTab";
import { SchedulingTab } from "@/app/(dashboard)/manager/order-assignment/_components/order-management/OrderDetailsPopup/OrderDetailTab/SchedulingTab";
import { StaffingTab } from "@/app/(dashboard)/manager/order-assignment/_components/order-management/OrderDetailsPopup/OrderDetailTab/StaffingTab";
import { CancellationTab } from "@/app/(dashboard)/manager/order-assignment/_components/order-management/OrderDetailsPopup/OrderDetailTab/CancellationTab";
import { z } from "zod";
import { OrderSchema } from "@/schema/order.schema";

type OrderType = z.infer<typeof OrderSchema>;

interface OrderDetailsPopupProps {
  order: OrderType | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderUpdate?: () => void;
  groupId?: string;
}

const getStatusColor = (status: string) => {
  const statusMap: Record<string, string> = {
    draft: "bg-gray-50 text-gray-600",
    pending: "bg-yellow-50 text-yellow-600",
    accepted: "bg-blue-50 text-blue-600",
    completed: "bg-green-50 text-green-600",
    cancelled: "bg-red-50 text-red-600",
    in_progress: "bg-indigo-50 text-indigo-600",
    scheduled: "bg-purple-50 text-purple-600",
  };
  return statusMap[status.toLowerCase()] || "bg-gray-50 text-gray-600";
};

export const OrderDetailsPopup: React.FC<OrderDetailsPopupProps> = ({
  order,
  isOpen,
  onClose,
  onOrderUpdate,
  groupId,
}) => {
  const {
    activeTab,
    setActiveTab,
    availableStaffs,
    selectedStaffId,
    setSelectedStaffId,
    isAssigning,
    isLoading,
    handleAssignStaff,
    cancelReason,
    setCancelReason,
    refundMethod,
    setRefundMethod,
    isCancelling,
    handleCancelOrder,
  } = useOrderDetails(order, isOpen, onOrderUpdate, groupId);

  if (!order) return null;

  const statusClass = getStatusColor(order.status);
  const canCancel = ["draft", "pending"].includes(order.status.toLowerCase());

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-lg">
        <DialogHeader className="border-b pb-4">
          <div className="flex flex-col gap-1">
            <div className="text-xs text-gray-400">
              ID: {order.id.substring(0, 8)}...
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-xl font-semibold text-gray-800">
                  Đơn hàng #{order.code}
                </DialogTitle>
                <Badge className={`${statusClass} px-2 py-1 text-xs font-medium`}>
                  {order.status}
                </Badge>
                {order.emergencyRequest && (
                  <Badge className="bg-red-50 text-red-600 flex items-center gap-1 px-2 py-1 text-xs font-medium">
                    <ShieldAlert size={14} />
                    Khẩn cấp
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex flex-wrap gap-2 mb-6 bg-gray-50 p-2 rounded-lg">
            <TabsTrigger
              value="overview"
              className="flex-1 min-w-[100px] rounded-md px-3 py-2 text-sm font-medium text-gray-600 bg-white shadow-sm hover:bg-blue-100 hover:text-blue-600 data-[state=active]:bg-blue-200 data-[state=active]:text-blue-700 transition-all"
            >
              Tổng quan
            </TabsTrigger>
            <TabsTrigger
              value="services"
              className="flex-1 min-w-[100px] rounded-md px-3 py-2 text-sm font-medium text-gray-600 bg-white shadow-sm hover:bg-blue-100 hover:text-blue-600 data-[state=active]:bg-blue-200 data-[state=active]:text-blue-700 transition-all"
            >
              Dịch vụ
            </TabsTrigger>
            <TabsTrigger
              value="scheduling"
              className="flex-1 min-w-[100px] rounded-md px-3 py-2 text-sm font-medium text-gray-600 bg-white shadow-sm hover:bg-blue-100 hover:text-blue-600 data-[state=active]:bg-blue-200 data-[state=active]:text-blue-700 transition-all"
            >
              Lịch trình
            </TabsTrigger>
            <TabsTrigger
              value="staffing"
              className="flex-1 min-w-[100px] rounded-md px-3 py-2 text-sm font-medium text-gray-600 bg-white shadow-sm hover:bg-blue-100 hover:text-blue-600 data-[state=active]:bg-blue-200 data-[state=active]:text-blue-700 transition-all flex items-center justify-center gap-1"
            >
              <UserPlus size={14} />
              Phân công
            </TabsTrigger>
            {canCancel && (
              <TabsTrigger
                value="cancellation"
                className="flex-1 min-w-[100px] rounded-md px-3 py-2 text-sm font-medium text-gray-600 bg-white shadow-sm hover:bg-red-100 hover:text-red-600 data-[state=active]:bg-red-200 data-[state=active]:text-red-700 transition-all"
              >
                Hủy đơn hàng
              </TabsTrigger>
            )}
          </TabsList>

          <OverviewTab order={order} />
          <ServicesTab order={order} />
          <SchedulingTab order={order} />
          <StaffingTab
            order={order}
            availableStaffs={availableStaffs}
            selectedStaffId={selectedStaffId}
            setSelectedStaffId={setSelectedStaffId}
            isAssigning={isAssigning}
            isLoading={isLoading}
            handleAssignStaff={handleAssignStaff}
          />
          {canCancel && (
            <CancellationTab
              cancelReason={cancelReason}
              setCancelReason={setCancelReason}
              refundMethod={refundMethod}
              setRefundMethod={setRefundMethod}
              isCancelling={isCancelling}
              handleCancelOrder={handleCancelOrder}
            />
          )}
        </Tabs>

        <DialogFooter className="border-t pt-4 flex justify-between">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border-gray-200 hover:bg-gray-50"
          >
            Đóng
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="px-4 py-2 border-blue-300 text-blue-500 hover:bg-blue-50"
            >
              Chỉnh sửa
            </Button>
            <Button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white">
              Cập nhật trạng thái
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsPopup;