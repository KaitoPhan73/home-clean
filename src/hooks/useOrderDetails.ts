/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/OrderDetailsPopup/useOrderDetails.ts
import { useState, useEffect } from "react";
import { getAllStaffStatusReady } from "@/apis/staff";
import { assignStaffToOrder, cancelOrder } from "@/apis/order";
import { toast } from "@/hooks/use-toast";
import { getUserFromCookie } from "@/lib/user";
import { z } from "zod";
import { OrderSchema } from "@/schema/order.schema";

type OrderType = z.infer<typeof OrderSchema>;

interface Staff {
  staffId: string;
  status: string;
  lastUpdated: string;
  fullName?: string;
}

interface StaffAssignment {
  orderId: string;
  staffId: string;
}

export const useOrderDetails = (
  order: OrderType | null,
  isOpen: boolean,
  onOrderUpdate?: () => void,
  groupId?: string
) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [availableStaffs, setAvailableStaffs] = useState<Staff[]>([]);
  const [staffAssignments, setStaffAssignments] = useState<StaffAssignment[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [refundMethod, setRefundMethod] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  const user = getUserFromCookie();
  const effectiveGroupId = groupId || user?.groupId;

  useEffect(() => {
    if (isOpen && effectiveGroupId) {
      fetchAvailableStaffs(effectiveGroupId);
    }
  }, [isOpen, effectiveGroupId]);

  useEffect(() => {
    setSelectedStaffId(order?.employeeId || "");
  }, [order]);

  const fetchAvailableStaffs = async (groupId: string) => {
    setIsLoading(true);
    try {
      const staffData = await getAllStaffStatusReady(groupId);
      const staffArray = Array.isArray(staffData) ? staffData : [staffData];
      const staffsWithNames = staffArray.map((staff: any) => ({
        staffId: staff.staffId,
        status: staff.status,
        lastUpdated: staff.lastUpdated,
        fullName: staff.fullName || `Staff ${staff.staffId.substring(0, 8)}`,
      }));
      setAvailableStaffs(staffsWithNames);
      const assignments = staffArray.map((staff: any) => ({
        orderId: order?.id || "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        staffId: staff.staffId,
      }));
      setStaffAssignments(assignments);
    } catch (error) {
      console.error("Error fetching available staffs:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách nhân viên sẵn sàng",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignStaff = async () => {
    if (!order || !selectedStaffId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn nhân viên để giao việc",
        variant: "destructive",
      });
      return;
    }
    setIsAssigning(true);
    try {
      const staffAssignment = staffAssignments.find(
        (assignment) => assignment.staffId === selectedStaffId
      );
      const assignmentData = staffAssignment
        ? { ...staffAssignment, orderId: order.id }
        : { staffId: selectedStaffId, orderId: order.id };
      await assignStaffToOrder(order.id, assignmentData);
      toast({
        title: "Thành công",
        description: "Đã phân công nhân viên thành công",
        variant: "default",
      });
      if (onOrderUpdate) onOrderUpdate();
    } catch (error) {
      console.error("Error assigning staff:", error);
      toast({
        title: "Lỗi",
        description: "Không thể phân công nhân viên",
        variant: "destructive",
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;

    const canCancel = ["draft", "pending"].includes(order.status.toLowerCase());
    if (!canCancel) {
      toast({
        title: "Lỗi",
        description: "Chỉ có thể hủy đơn hàng ở trạng thái Draft hoặc Pending",
        variant: "destructive",
      });
      return;
    }

    if (!cancelReason || !refundMethod) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập lý do hủy và phương thức hoàn tiền",
        variant: "destructive",
      });
      return;
    }

    setIsCancelling(true);
    try {
      await cancelOrder(order.id, { cancellationReason: cancelReason, refundMethod });
      toast({
        title: "Thành công",
        description: "Đơn hàng đã được hủy thành công",
        variant: "default",
      });
      if (onOrderUpdate) onOrderUpdate();
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast({
        title: "Lỗi",
        description: "Không thể hủy đơn hàng",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  return {
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
  };
};