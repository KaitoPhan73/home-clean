/* eslint-disable @typescript-eslint/no-explicit-any */
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { User, UserPlus, Star, MessageCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StaffingTabProps {
  order: any;
  availableStaffs: any[];
  selectedStaffId: string;
  setSelectedStaffId: (value: string) => void;
  isAssigning: boolean;
  isLoading: boolean;
  handleAssignStaff: () => Promise<boolean>;
  onClose?: () => void;
}

export const StaffingTab: React.FC<StaffingTabProps> = ({
  order,
  availableStaffs,
  selectedStaffId,
  setSelectedStaffId,
  isAssigning,
  isLoading,
  handleAssignStaff,
  onClose,
}) => {
  // Fix for assigned staff display: Find by staffId that matches order.employeeId
  const assignedStaff = order.employeeId 
    ? availableStaffs.find(s => s.staffId === order.employeeId) 
    : null;
    
  // Define a proper display name for the assigned staff
  const assignedStaffName = assignedStaff 
    ? (assignedStaff.fullName || assignedStaff.phoneNumber || "Nhân viên") 
    : "Chưa phân công";

  const isPendingAndAssigned =
    order.status.toLowerCase() === "inprogress" && order.employeeId;
    
  // Modified assignment handler to close popup on success
  const handleAssignStaffAndClose = async () => {
    const success = await handleAssignStaff();
    if (success && onClose) {
      onClose();
    }
  };

  // Render star rating based on employee rating
  const renderStarRating = (rating: number | null) => {
    if (rating === null) return null;
    
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          size={16} 
          fill={i <= rating ? "#FFB800" : "none"} 
          stroke={i <= rating ? "#FFB800" : "#D1D5DB"} 
          className={i <= rating ? "text-yellow-500" : "text-gray-300"} 
        />
      );
    }
    return (
      <div className="flex items-center gap-1">
        {stars}
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <TabsContent value="staffing" className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <UserPlus size={18} />
          Phân công nhân viên
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-md border border-blue-100">
            <h4 className="text-blue-700 font-medium mb-2">Nhân viên hiện tại</h4>
            {order.employeeId ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <User size={20} />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{assignedStaffName}</div>
                  <div className="text-xs text-gray-500">
                    ID: {order.employeeId.substring(0, 8)}...
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 italic">
                Chưa có nhân viên nào được phân công
              </div>
            )}
          </div>

          <div className="p-4 bg-white rounded-md border border-green-100">
            <h4 className="text-green-700 font-medium mb-2">Chọn nhân viên sẵn sàng</h4>
            {isPendingAndAssigned ? (
              <div className="py-3 text-center text-gray-700 font-medium">
                Đơn hàng này đã được phân công nhân viên
              </div>
            ) : order.employeeId ? (
              <div className="py-3 text-center text-gray-700 font-medium">
                Đơn hàng này đã được phân công nhân viên
              </div>
            ) : isLoading ? (
              <div className="py-3 text-center text-gray-500">
                <div className="inline-block animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full mr-2"></div>
                Đang tải danh sách nhân viên...
              </div>
            ) : availableStaffs.length === 0 ? (
              <div className="py-3 text-center text-gray-500 italic">
                Không có nhân viên sẵn sàng
              </div>
            ) : (
              <div className="space-y-3">
                <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Chọn nhân viên sẵn sàng" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStaffs.map((staff) => (
                      <SelectItem key={staff.staffId} value={staff.staffId}>
                        {staff.fullName || staff.phoneNumber || "Tên không xác định"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedStaffId && selectedStaffId !== order.employeeId && (
                  <div className="p-3 bg-green-50 rounded-md border border-green-200">
                    <div className="text-sm text-green-700 font-medium">Sẽ giao việc cho:</div>
                    <div className="mt-1 flex items-center gap-2">
                      <User size={16} className="text-green-600" />
                      <span className="text-gray-700">
                        {availableStaffs.find((s) => s.staffId === selectedStaffId)?.fullName ||
                          availableStaffs.find((s) => s.staffId === selectedStaffId)?.phoneNumber ||
                          "Tên không xác định"}
                      </span>
                    </div>
                  </div>
                )}
                <Button
                  className="w-full mt-4 bg-green-600 hover:bg-green-700"
                  disabled={
                    !selectedStaffId ||
                    selectedStaffId === order.employeeId ||
                    isAssigning ||
                    availableStaffs.length === 0
                  }
                  onClick={handleAssignStaffAndClose}
                >
                  {isAssigning ? (
                    <>
                      <span className="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                      Đang phân công...
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} className="mr-2" />
                      Phân công nhân viên
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {order.employeeId && (
            <div className="p-4 bg-white rounded-md border border-amber-100">
              <h4 className="text-amber-700 font-medium mb-2 flex items-center gap-2">
                <Star size={16} className="text-amber-500" />
                Đánh giá của khách hàng
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-600">Đánh giá:</div>
                  <div>
                    {order.employeeRating !== null ? (
                      renderStarRating(order.employeeRating)
                    ) : (
                      <span className="text-sm text-gray-500 italic">Chưa có đánh giá</span>
                    )}
                  </div>
                </div>
                
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle size={14} className="text-gray-500" />
                    <div className="text-sm font-medium text-gray-600">Phản hồi:</div>
                  </div>
                  {order.customerFeedback ? (
                    <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700">
                      {order.customerFeedback}
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-500 italic">
                      Khách hàng chưa để lại phản hồi
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </TabsContent>
  );
};