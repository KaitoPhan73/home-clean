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
import { getNextTaskStatus } from "@/app/(dashboard)/laundry/orders/[slug]/OrderDetailLaundry/_components/order-task/taskService";
import { EmployeRealTimeStatus, getEmployeesRealTimeStatus } from "@/apis/laudry/employee";

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
  const [employees, setEmployees] = useState<EmployeRealTimeStatus[]>([]);
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
        fetchEmployees();
      } else if (isCompletingTask) {
        setSelectedEmployeeId(currentUser?.id || "");
      }
    }
  }, [open, currentUser, isFirstCheckout, isCompletingTask]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);

      const fetchedEmployees = await getEmployeesRealTimeStatus();
      console.log("Fetched employees:", fetchedEmployees);

      // Filter out employees with status "Working"
      const filteredEmployees = fetchedEmployees.filter(
        (employee) => employee.status !== "Working"
      );

      setEmployees(filteredEmployees);

      if (filteredEmployees.length === 0) {
        setError("Không có nhân viên nào sẵn sàng để phân công.");
        setSelectedEmployeeId("");
      } else {
        setSelectedEmployeeId(filteredEmployees[0].id);
      }
    } catch (err: any) {
      console.error("Failed to fetch employees:", err);
      setError(
        err.response?.data?.description ||
          "Không thể tải danh sách nhân viên. Vui lòng thử lại sau."
      );
      setSelectedEmployeeId("");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!selectedEmployeeId && isCompletingTask) {
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
    return false;
  };

  // Format lastUpdated to a readable date
  const formatLastUpdated = (lastUpdated: string) => {
    try {
      const date = new Date(lastUpdated);
      return date.toLocaleString("vi-VN", {
        dateStyle: "short",
        timeStyle: "short",
      });
    } catch {
      return lastUpdated; // Fallback if date parsing fails
    }
  };

  // Get the selected employee's details
  const selectedEmployee = employees.find((emp) => emp.id === selectedEmployeeId);

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
                <>
                  <Select
                    value={selectedEmployeeId}
                    onValueChange={setSelectedEmployeeId}
                    disabled={processing || loading || employees.length === 0}
                  >
                    <SelectTrigger id="employee" className="w-full">
                      <SelectValue
                        placeholder={
                          employees.length === 0
                            ? "Không có nhân viên Staff"
                            : "Chọn nhân viên"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.staffName}{" "}
                          {employee.id === currentUser?.id &&
                            "(Người dùng hiện tại)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedEmployee && (
                    <div className="text-sm text-gray-600">
                      <p>
                        <span className="font-medium">Mã nhân viên:</span>{" "}
                        {selectedEmployee.staffCode}
                      </p>
                      <p>
                        <span className="font-medium">Trạng thái:</span>{" "}
                        {selectedEmployee.status}
                      </p>
                      <p>
                        <span className="font-medium">Cập nhật lần cuối:</span>{" "}
                        {formatLastUpdated(selectedEmployee.lastUpdated)}
                      </p>
                    </div>
                  )}
                </>
              )}
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Lưu ý:</span> Sau khi bắt đầu,
                trạng thái sẽ chuyển từ {currentStatus} sang {nextStatus}.
              </p>
            </div>
          </div>
        )}

        {isCompletingTask && (
          <div className="flex items-center gap-3 p-3 rounded-md border border-yellow-200 bg-yellow-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-yellow-500"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <p className="text-sm text-yellow-700">
              Sau khi hoàn thành, trạng thái sẽ chuyển từ{" "}
              <span className="font-medium">{currentStatus}</span> sang{" "}
              <span className="font-medium">{nextStatus}</span> và không thể
              hoàn tác.
            </p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isActionDisabled()}
            className={
              isCompletingTask
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            }
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