/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { TaskStatusEnum } from "./TaskEnums";
import { getEmployeesService, getNextTaskStatus } from "@/app/(dashboard)/laundry/orders/[slug]/OrderDetailLaundry/_components/order-task/taskService";

interface Employee {
  id: string;
  employeeCode: string;
  fullName: string;
  role: string;
}

interface TaskCheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (employeeId: string) => void;
  processing: boolean;
  taskId: string;
  currentStatus: TaskStatusEnum;
  currentUser: any;
}

const TaskCheckoutDialog: React.FC<TaskCheckoutDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  processing,
  currentStatus,
  currentUser,
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextStatus = getNextTaskStatus(currentStatus);
  const isFirstCheckout = currentStatus === TaskStatusEnum.Pending;
  const isCompletingTask = currentStatus === TaskStatusEnum.InProgress;

  useEffect(() => {
    if (open) {
      setError(null);
      
      if (isFirstCheckout) {
        // For starting a task, fetch employees to assign
        fetchEmployees();
      } else if (isCompletingTask) {
        // For completing a task, use the current user's ID
        // If we're completing a task, we presume the current user has permission to complete it
        setSelectedEmployeeId(currentUser?.id || "");
      }
    }
  }, [open, currentUser, isFirstCheckout, isCompletingTask]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";
      const fetchedEmployees = await getEmployeesService(undefined, token);
      // Filter for Staff roles only
      const staffEmployees = fetchedEmployees.filter((emp: Employee) => emp.role === "Staff");
      setEmployees(staffEmployees);

      if (staffEmployees.length === 0) {
        setError("Không có nhân viên nào với vai trò Staff để phân công.");
        setSelectedEmployeeId("");
      } else {
        setSelectedEmployeeId(staffEmployees[0].id);
      }
    } catch (err: any) {
      console.error("Failed to fetch employees:", err);
      setError(err.response?.data?.description || "Không thể tải danh sách nhân viên. Vui lòng thử lại sau.");
      setSelectedEmployeeId("");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!selectedEmployeeId && isCompletingTask) {
      // If completing a task and no employee ID is available, use a fallback mechanism
      // This could be the task's existing assigned employeeId or another appropriate value
      // For now, we'll use the current user's ID even if it's empty, as the backend should handle this case
      onConfirm(currentUser?.id || "");
    } else if (selectedEmployeeId) {
      onConfirm(selectedEmployeeId);
    } else {
      setError("Vui lòng chọn nhân viên trước khi tiếp tục.");
    }
  };

  const getDialogTitle = () => {
    if (isFirstCheckout) {
      return "Bắt đầu thực hiện công việc";
    }
    return "Xác nhận hoàn thành công việc";
  };

  const getDialogDescription = () => {
    if (isFirstCheckout) {
      return "Vui lòng chọn nhân viên đảm nhận công việc này. Trạng thái công việc sẽ được chuyển sang 'Đang thực hiện'.";
    }
    return "Bạn có chắc chắn muốn hoàn thành công việc này không? Hành động này không thể hoàn tác.";
  };

  const isActionDisabled = () => {
    if (processing) return true;
    if (isFirstCheckout) return !selectedEmployeeId;
    // For task completion, we should allow proceeding even if no explicit employee ID is selected
    return false;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>{getDialogDescription()}</DialogDescription>
        </DialogHeader>

        {isFirstCheckout && (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="employee">Nhân viên thực hiện</Label>
              {loading ? (
                <div className="h-10 bg-gray-100 rounded animate-pulse"></div>
              ) : (
                <Select
                  value={selectedEmployeeId}
                  onValueChange={setSelectedEmployeeId}
                  disabled={processing || loading || employees.length === 0}
                >
                  <SelectTrigger id="employee" className="w-full">
                    <SelectValue placeholder={employees.length === 0 ? "Không có nhân viên Staff" : "Chọn nhân viên"} />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.fullName} {employee.id === currentUser?.id && "(Người dùng hiện tại)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Lưu ý:</span> Sau khi bắt đầu, trạng thái
                sẽ chuyển từ {currentStatus} sang {nextStatus}.
              </p>
            </div>
          </div>
        )}

        {isCompletingTask && (
          <div className="space-y-4 py-2">
            <div className="bg-yellow-50 p-3 rounded-md">
              <p className="text-sm text-yellow-700">
                <span className="font-medium">Lưu ý:</span> Sau khi hoàn thành, trạng thái
                sẽ chuyển từ {currentStatus} sang {nextStatus} và không thể hoàn tác.
              </p>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isActionDisabled()}
            className={isCompletingTask ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}
          >
            {processing ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Đang xử lý
              </span>
            ) : isFirstCheckout ? (
              "Bắt đầu thực hiện"
            ) : (
              "Xác nhận hoàn thành"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskCheckoutDialog;