/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Task, TaskStatusEnum, OrderStatusEnum } from "./TaskEnums";
import {
  CheckCircle,
  Clock,
  CreditCard,
  PlayCircle,
  Lock,
  Unlock,
  Scale,
  XCircle,
} from "lucide-react";
import EmployeeDetail from "@/app/(dashboard)/laundry/orders/[slug]/OrderDetailLaundry/_components/order-task/EmployeeDetail";

interface TaskCardProps {
  staff: any | null;
  task: Task;
  index: number;
  currentUser: any;
  orderStatus: OrderStatusEnum;
  processingTask: string | null;
  canCheckoutTask: (task: Task, index: number) => boolean;
  isTaskLocked: (index: number) => boolean;
  onCheckout: () => void;
  onWeightEdit?: () => void;
  tasks: Task[];
  employeeCache: { [key: string]: { name: string; data: any } };
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  staff,
  index,
  currentUser,
  orderStatus,
  processingTask,
  canCheckoutTask,
  isTaskLocked,
  onCheckout,
  onWeightEdit,
  tasks,
  employeeCache,
}) => {
  const [assignedByEmployee, setAssignedByEmployee] = useState<any | null>(null);
  const [assignedToEmployee, setAssignedToEmployee] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(!!task.employeeId || !!task.assignedBy);

  useEffect(() => {
    if (task.employeeId && employeeCache[task.employeeId]) {
      setAssignedToEmployee(employeeCache[task.employeeId].data);
      setLoading(false);
    } else if (task.employeeId) {
      setAssignedToEmployee({ staffName: "Đang tải..." });
    }

    if (task.assignedBy && employeeCache[task.assignedBy]) {
      setAssignedByEmployee(employeeCache[task.assignedBy].data);
      setLoading(false);
    } else if (task.assignedBy) {
      setAssignedByEmployee({ staffName: "Đang tải..." });
    }
  }, [task.employeeId, task.assignedBy, employeeCache]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Chưa xác định";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const isStep2Unlocked =
    index === 1 &&
    orderStatus === OrderStatusEnum.Paid &&
    tasks[0]?.status === TaskStatusEnum.Completed;

  const isStep3Unlocked =
    index === 2 &&
    tasks[0]?.status === TaskStatusEnum.Completed &&
    tasks[1]?.status === TaskStatusEnum.Completed;

  const isStep2PendingPayment =
    index === 1 &&
    orderStatus === OrderStatusEnum.PendingPayment &&
    tasks[0]?.status === TaskStatusEnum.Completed;

  const getTaskActionText = (task: Task, index: number) => {
    if (task.status === TaskStatusEnum.Completed) {
      return (
        <span className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          Đã hoàn thành
        </span>
      );
    }

    if (task.status === TaskStatusEnum.Canceled) {
      return (
        <span className="flex items-center gap-2">
          <XCircle className="h-4 w-4" />
          Đã hủy
        </span>
      );
    }

    if (
      task.status === TaskStatusEnum.InProgress &&
      canCheckoutTask(task, index)
    ) {
      return (
        <span className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          Hoàn thành
        </span>
      );
    }

    if (
      task.status === TaskStatusEnum.Pending &&
      canCheckoutTask(task, index)
    ) {
      return (
        <span className="flex items-center gap-2">
          <PlayCircle className="h-4 w-4" />
          Bắt đầu
        </span>
      );
    }

    if (isStep2PendingPayment) {
      return (
        <span className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Chờ thanh toán
        </span>
      );
    }

    if (isStep3Unlocked && task.status === TaskStatusEnum.InProgress) {
      return (
        <span className="flex items-center gap-2">
          <Unlock className="h-4 w-4" />
          Hoàn thành công việc
        </span>
      );
    }

    if (isStep2Unlocked) {
      return (
        <span className="flex items-center gap-2">
          <Unlock className="h-4 w-4" />
          {task.status === TaskStatusEnum.Pending
            ? "Sẵn sàng bắt đầu"
            : "Chờ xử lý"}
        </span>
      );
    }

    if (isTaskLocked(index)) {
      return (
        <span className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          {orderStatus === OrderStatusEnum.Cancelled
            ? "Đã hủy"
            : index === 1 && orderStatus !== OrderStatusEnum.Paid
            ? "Chờ thanh toán"
            : "Đang khóa"}
        </span>
      );
    }

    return (
      <span className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Chờ xử lý
      </span>
    );
  };

  const getButtonColor = (task: Task, index: number) => {
    if (task.status === TaskStatusEnum.Completed) {
      return "border-green-300 text-green-600";
    }

    if (task.status === TaskStatusEnum.Canceled) {
      return "border-red-300 text-red-600";
    }

    if (
      task.status === TaskStatusEnum.InProgress &&
      canCheckoutTask(task, index)
    ) {
      return "bg-green-600 hover:bg-green-700";
    }

    if (
      (task.status === TaskStatusEnum.Pending &&
        canCheckoutTask(task, index)) ||
      isStep3Unlocked ||
      (isStep2Unlocked && task.status === TaskStatusEnum.Pending)
    ) {
      return "bg-blue-600 hover:bg-blue-700";
    }

    if (isStep2PendingPayment) {
      return "bg-yellow-500 hover:bg-yellow-600";
    }

    if (isTaskLocked(index)) {
      return "bg-gray-300 cursor-not-allowed";
    }

    return "bg-gray-400";
  };

  const getCardBackground = () => {
    if (task.status === TaskStatusEnum.Completed) {
      return "border-green-200 bg-green-50";
    }

    if (task.status === TaskStatusEnum.Canceled) {
      return "border-red-200 bg-red-50";
    }

    if (task.status === TaskStatusEnum.InProgress) {
      return "bg-blue-50";
    }

    if (isStep3Unlocked && task.status === TaskStatusEnum.Pending) {
      return "border-blue-200 bg-blue-50 animate-pulse";
    }

    if (isStep2PendingPayment) {
      return "border-yellow-200 bg-yellow-50 animate-pulse";
    }

    if (isStep2Unlocked && task.status === TaskStatusEnum.Pending) {
      return "border-blue-200 bg-blue-50 animate-pulse";
    }

    if (isTaskLocked(index)) {
      return "border-gray-200 bg-gray-50 opacity-70";
    }

    return "border-gray-200";
  };

  const showWeightEditButton =
    index === 0 &&
    task.status === TaskStatusEnum.Completed &&
    onWeightEdit &&
    orderStatus !== OrderStatusEnum.Cancelled;

  return (
    <Card
      className={`task-card p-6 border transition-all duration-300 hover:shadow-md ${getCardBackground()}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                task.status === TaskStatusEnum.Completed
                  ? "bg-green-100 text-green-800"
                  : task.status === TaskStatusEnum.Canceled
                  ? "bg-red-100 text-red-800"
                  : task.status === TaskStatusEnum.InProgress
                  ? "bg-blue-100 text-blue-800"
                  : isStep3Unlocked && task.status === TaskStatusEnum.Pending
                  ? "bg-blue-100 text-blue-800"
                  : isStep2PendingPayment
                  ? "bg-yellow-100 text-yellow-800"
                  : isStep2Unlocked && task.status === TaskStatusEnum.Pending
                  ? "bg-blue-100 text-blue-800"
                  : isTaskLocked(index)
                  ? "bg-gray-100 text-gray-500"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {task.status === TaskStatusEnum.Completed
                ? "Hoàn thành"
                : task.status === TaskStatusEnum.Canceled
                ? "Đã hủy"
                : task.status === TaskStatusEnum.InProgress
                ? "Đang thực hiện"
                : isStep3Unlocked && task.status === TaskStatusEnum.Pending
                ? "Sẵn sàng"
                : isStep2PendingPayment
                ? "Chờ thanh toán"
                : isStep2Unlocked && task.status === TaskStatusEnum.Pending
                ? "Sẵn sàng"
                : isTaskLocked(index)
                ? orderStatus === OrderStatusEnum.Cancelled
                  ? "Đã hủy"
                  : "Đang khóa"
                : "Chờ xử lý"}
            </span>
            <h3
              className={`text-lg font-semibold ${
                isTaskLocked(index) && !isStep2Unlocked && !isStep3Unlocked
                  ? "text-gray-500"
                  : ""
              }`}
            >
              {task.taskName}
            </h3>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Mã công việc: {task.taskCode}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Nhân viên: {loading ? "Đang tải..." : task.employeeName}
          </p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-xs text-gray-500">Ngày tạo</p>
              <p className="text-sm">{formatDate(task.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Ngày cập nhật</p>
              <p className="text-sm">{formatDate(task.updatedAt)}</p>
            </div>
            {task.startDate && (
              <div>
                <p className="text-xs text-gray-500">Ngày bắt đầu</p>
                <p className="text-sm">{formatDate(task.startDate)}</p>
              </div>
            )}
            {task.completedDate && (
              <div>
                <p className="text-xs text-gray-500">Ngày hoàn thành</p>
                <p className="text-sm">{formatDate(task.completedDate)}</p>
              </div>
            )}
          </div>
          {task.notes && (
            <div className="mt-4">
              <p className="text-xs text-gray-500">Ghi chú</p>
              <p className="text-sm">{task.notes}</p>
            </div>
          )}
          {task.status === TaskStatusEnum.Canceled && (
            <p className="text-sm text-red-600 font-medium mt-4">
              <XCircle className="h-4 w-4 inline mr-1" />
              Công việc này đã bị hủy do đơn hàng bị hủy.
            </p>
          )}
          {isStep2Unlocked &&
            task.status !== TaskStatusEnum.Completed &&
            task.status !== TaskStatusEnum.Canceled && (
              <p className="text-sm text-blue-600 font-medium mt-4">
                Thanh toán đã hoàn tất. Bạn có thể tiến hành công việc này ngay
                bây giờ.
              </p>
            )}
          {isStep2PendingPayment && task.status != TaskStatusEnum.Completed && (
            <p className="text-sm text-yellow-600 font-medium mt-4 animate-pulse">
              <CreditCard className="h-4 w-4 inline mr-1" />
              Cần thanh toán trước khi tiếp tục công việc này!
            </p>
          )}
          {isStep3Unlocked &&
            task.status !== TaskStatusEnum.Completed &&
            task.status !== TaskStatusEnum.Canceled && (
              <p className="text-sm text-blue-600 font-medium mt-4">
                Quá trình giặt sấy đã hoàn thành. Bạn có thể tiến hành giao nhân
                viên trả đồ ngay bây giờ.
              </p>
            )}
        </div>
        <div className="ml-4 flex flex-col gap-2">
          <Button
            variant={
              task.status === TaskStatusEnum.Completed ||
              task.status === TaskStatusEnum.Canceled
                ? "outline"
                : "default"
            }
            size="sm"
            disabled={
              task.status === TaskStatusEnum.Completed ||
              task.status === TaskStatusEnum.Canceled ||
              (!canCheckoutTask(task, index) &&
                !isStep3Unlocked &&
                !(isStep2Unlocked && task.status === TaskStatusEnum.Pending)) ||
              processingTask !== null
            }
            onClick={onCheckout}
            className={`${getButtonColor(
              task,
              index
            )} min-w-32 transition-all duration-300`}
          >
            {processingTask === task.id ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Đang xử lý
              </span>
            ) : (
              getTaskActionText(task, index)
            )}
          </Button>
          {showWeightEditButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={onWeightEdit}
              className="border-purple-300 text-purple-600 hover:bg-purple-50 min-w-32"
            >
              <span className="flex items-center gap-2">
                <Scale className="h-4 w-4" />
                Nhập trọng lượng
              </span>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;