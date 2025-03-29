/* eslint-disable @typescript-eslint/no-explicit-any */
// components/OrderDetailsPopup/StaffingTab.tsx
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { User, UserPlus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StaffingTabProps {
  order: any;
  availableStaffs: any[];
  selectedStaffId: string;
  setSelectedStaffId: (value: string) => void;
  isAssigning: boolean;
  isLoading: boolean;
  handleAssignStaff: () => void;
}

export const StaffingTab: React.FC<StaffingTabProps> = ({
  order,
  availableStaffs,
  selectedStaffId,
  setSelectedStaffId,
  isAssigning,
  isLoading,
  handleAssignStaff,
}) => {
  const assignedStaffName = availableStaffs.find((s) => s.staffId === order.employeeId)?.fullName || order.employeeId || "Chưa phân công";
  const isPendingAndAssigned = order.status.toLowerCase() === "InProgress" && order.employeeId;

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
                <div>
                  <div className="font-medium">{assignedStaffName}</div>
                  <div className="text-xs text-gray-500">ID: {order.employeeId.substring(0, 8)}...</div>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 italic">Chưa có nhân viên nào được phân công</div>
            )}
          </div>

          <div className="p-4 bg-white rounded-md border border-green-100">
            <h4 className="text-green-700 font-medium mb-2">Chọn nhân viên sẵn sàng</h4>
            {isPendingAndAssigned ? (
              <div className="py-3 text-center text-gray-700 font-medium">
                Đơn hàng này đã được phân công nhân viên
              </div>
            ) : isLoading ? (
              <div className="py-3 text-center text-gray-500">
                <div className="inline-block animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full mr-2"></div>
                Đang tải danh sách nhân viên...
              </div>
            ) : availableStaffs.length === 0 ? (
              <div className="py-3 text-center text-gray-500 italic">Không có nhân viên sẵn sàng</div>
            ) : (
              <div className="space-y-3">
                <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Chọn nhân viên sẵn sàng" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStaffs.map((staff) => (
                      <SelectItem key={staff.staffId} value={staff.staffId}>
                        {staff.fullName || `Nhân viên (${staff.staffId.substring(0, 8)}...)`}
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
                          `Nhân viên (${selectedStaffId.substring(0, 8)}...)`}
                      </span>
                    </div>
                  </div>
                )}
                <Button
                  className="w-full mt-4 bg-green-600 hover:bg-green-700"
                  disabled={!selectedStaffId || selectedStaffId === order.employeeId || isAssigning || availableStaffs.length === 0}
                  onClick={handleAssignStaff}
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

          <div className="p-4 bg-white rounded-md border border-gray-100">
            <h4 className="text-gray-600 font-medium mb-2">Lịch sử phân công</h4>
            <div className="bg-gray-50 rounded p-3 text-sm text-gray-400 italic">Chức năng này đang được phát triển</div>
          </div>
        </div>
      </div>
    </TabsContent>
  );
};