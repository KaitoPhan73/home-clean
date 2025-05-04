/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { getAllStaffStatusReady, getStaffById } from "@/apis/staff"; // Added getStaffById
import { assignStaffToOrder, cancelOrder } from "@/apis/order";
import { toast } from "@/hooks/use-toast";
import { getUserFromCookie } from "@/lib/user";
import { z } from "zod";
import { OrderSchema } from "@/schema/order.schema";
import { useStaffAssignBoard } from "@/hooks/useStaffAssignBoard";

type OrderType = z.infer<typeof OrderSchema>;

interface Staff {
  staffId: string;
  status: string;
  lastUpdated: string;
  fullName?: string;
  phoneNumber?: string;
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
  const {handleRefresh} = useStaffAssignBoard()

  const user = getUserFromCookie();
  const effectiveGroupId = groupId || user?.groupId;

  // Reset states when order changes or modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setActiveTab("overview");
      setCancelReason("");
      setRefundMethod("");
      setSelectedStaffId(order?.employeeId || "");
    }
  }, [isOpen, order?.id]);

  // Fetch available staff and assigned staff when modal is open or groupId changes
  useEffect(() => {
    if (isOpen && effectiveGroupId && activeTab === "staffing") {
      fetchAvailableStaffs(effectiveGroupId);
    }
  }, [isOpen, effectiveGroupId, activeTab]);

  const fetchAvailableStaffs = async (groupId: string) => {
    setIsLoading(true);
    try {
      // Fetch available staff
      const staffData = await getAllStaffStatusReady(groupId);
      const staffArray = Array.isArray(staffData) ? staffData : [staffData];

      const staffsWithNames = staffArray.map((staff: any) => ({
        staffId: staff.id,
        status: staff.status,
        lastUpdated: staff.lastUpdated,
        fullName: staff.fullName || `Staff ${staff.id.substring(0, 8)}`,
        phoneNumber: staff.phoneNumber,
      }));

      // Fetch assigned staff if order.employeeId exists
      if (order?.employeeId) {
        const assignedStaffExists = staffsWithNames.some(
          (staff) => staff.staffId === order.employeeId
        );
        if (!assignedStaffExists) {
          try {
            const response = await getStaffById(order.employeeId);
            if (response && response.payload) {
              staffsWithNames.push({
                staffId: order.employeeId,
                status: "assigned",
                lastUpdated: new Date().toISOString(),
                fullName: response.payload.fullName || `Staff ${order.employeeId.substring(0, 8)}`,
                phoneNumber: response.payload.phoneNumber || "Không có",
              });
            }
          } catch (error) {
            console.error("Error fetching assigned staff:", error);
            // Optionally handle error (e.g., add a placeholder or skip)
          }
        }
      }

      setAvailableStaffs(staffsWithNames);

      const assignments = staffsWithNames.map((staff) => ({
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

  const handleAssignStaff = useCallback(async () => {
    if (!order || !selectedStaffId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn nhân viên để giao việc",
        variant: "destructive",
      });
      return false;
    }

    setIsAssigning(true);
    try {
      const staffAssignment = staffAssignments.find(
        (assignment) => assignment.staffId === selectedStaffId
      );
      const assignmentData = staffAssignment
        ? { ...staffAssignment, orderId: order.id }
        : { staffId: selectedStaffId, orderId: order.id };

      const response = await assignStaffToOrder(order.id, assignmentData);
      if(response.status === 200){
        handleRefresh();
      }
      toast({
        title: "Thành công",
        description: "Đã phân công nhân viên thành công",
        variant: "default",
      });

      if (onOrderUpdate) onOrderUpdate();
      return true;
    } catch (error) {
      console.error("Error assigning staff:", error);
      toast({
        title: "Không thể phân công nhân viên",
        description: "Vì đơn hàng này đã được phân công rồi. Vui lòng làm mới!",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsAssigning(false);
    }
  }, [selectedStaffId, order, onOrderUpdate, staffAssignments]);

  const handleCancelOrder = useCallback(async () => {
    if (!order) return false;

    const canCancel = ["draft", "pending"].includes(order.status.toLowerCase());
    if (!canCancel) {
      toast({
        title: "Lỗi",
        description: "Chỉ có thể hủy đơn hàng ở trạng thái Draft hoặc Pending",
        variant: "destructive",
      });
      return false;
    }

    if (!cancelReason || !refundMethod) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập lý do hủy và phương thức hoàn tiền",
        variant: "destructive",
      });
      return false;
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
      return true;
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast({
        title: "Không thể hủy đơn hàng",
        description: "Vì đơn hàng này đã được hủy rồi. Vui lòng làm mới!",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsCancelling(false);
    }
  }, [cancelReason, refundMethod, order, onOrderUpdate]);

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