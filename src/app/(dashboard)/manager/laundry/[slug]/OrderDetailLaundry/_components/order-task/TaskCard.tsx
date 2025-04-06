/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Task, TaskStatusEnum, OrderStatusEnum } from "./TaskEnums";
import { CheckCircle, Clock, CreditCard, ArrowRight } from "lucide-react";

interface TaskCardProps {
  task: Task;
  index: number;
  currentUser: any;
  orderStatus: OrderStatusEnum;
  processingTask: string | null;
  canCheckoutTask: (task: Task, index: number) => boolean;
  isTaskLocked: (index: number) => boolean;
  onCheckout: () => void;
  tasks: Task[];
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  index,
  currentUser,
  orderStatus,
  processingTask,
  canCheckoutTask,
  isTaskLocked,
  onCheckout,
  tasks,
}) => {
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

  const getTaskActionText = (task: Task, index: number) => {
    if (task.status === TaskStatusEnum.Completed) {
      return (
        <span className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          Đã hoàn thành
        </span>
      );
    }

    if (canCheckoutTask(task, index)) {
      return (
        <span className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          Hoàn thành
        </span>
      );
    }

    if (index === 2 && orderStatus === OrderStatusEnum.PendingPayment) {
      return (
        <span className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Chờ thanh toán
        </span>
      );
    }

    if (isTaskLocked(index)) {
      return (
        <span className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Đang khóa
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

  return (
    <Card
      className={`task-card p-6 border transition-all duration-300 hover:shadow-md ${
        task.status === TaskStatusEnum.Completed
          ? "border-green-200 bg-green-50"
          : task.status === TaskStatusEnum.InProgress
          ? "border-blue-200 bg-blue-50"
          : isTaskLocked(index)
          ? "border-gray-200 bg-gray-50 opacity-70"
          : "border-gray-200"
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                task.status === TaskStatusEnum.Completed
                  ? "bg-green-100 text-green-800"
                  : task.status === TaskStatusEnum.InProgress
                  ? "bg-blue-100 text-blue-800"
                  : isTaskLocked(index)
                  ? "bg-gray-100 text-gray-500"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {task.status === TaskStatusEnum.Completed
                ? "Hoàn thành"
                : task.status === TaskStatusEnum.InProgress
                ? "Đang thực hiện"
                : isTaskLocked(index)
                ? "Đang khóa"
                : "Chờ xử lý"}
            </span>
            <h3
              className={`text-lg font-semibold ${
                isTaskLocked(index) ? "text-gray-500" : ""
              }`}
            >
              {task.taskName}
            </h3>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Mã công việc: {task.taskCode}
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
        </div>

        <div className="ml-4">
          <Button
            variant={
              task.status === TaskStatusEnum.Completed ? "outline" : "default"
            }
            size="sm"
            disabled={
              task.status === TaskStatusEnum.Completed ||
              !canCheckoutTask(task, index) ||
              processingTask !== null
            }
            onClick={onCheckout}
            className={`${
              task.status === TaskStatusEnum.Completed
                ? "border-green-300 text-green-600"
                : canCheckoutTask(task, index)
                ? "bg-blue-600 hover:bg-blue-700"
                : isTaskLocked(index)
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-400"
            } min-w-32 transition-all duration-300`}
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
          {isTaskLocked(index) && (
            <p className="text-xs text-gray-500 mt-2 text-right">
              {index === 1
                ? "Hoàn thành bước 1 để mở khóa"
                : index === 2 && orderStatus === OrderStatusEnum.PendingPayment
                ? "Cần thanh toán để mở khóa"
                : "Đang khóa"}
            </p>
          )}
        </div>
      </div>

      {task.employeeId && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">Người xử lý</p>
          <p className="text-sm font-medium">
            {task.employeeId === currentUser?.id
              ? `${currentUser?.fullName || "Bạn"} (Người dùng hiện tại)`
              : task.employeeId}
          </p>
        </div>
      )}

      {task.status === TaskStatusEnum.Completed && index < tasks.length - 1 && (
        <div className="mt-4 flex justify-end">
          <div
            className={`flex items-center text-sm ${
              tasks[index + 1].status === TaskStatusEnum.InProgress
                ? "text-blue-600"
                : "text-gray-500"
            }`}
          >
            <span>Bước tiếp theo</span>
            <ArrowRight className="ml-1 h-4 w-4" />
          </div>
        </div>
      )}

      {index === 1 &&
        task.status === TaskStatusEnum.Completed &&
        tasks.length > 2 && (
          <div className="mt-4 pt-3 border-t border-yellow-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-yellow-600">
                <CreditCard className="mr-2 h-4 w-4" />
                <span className="text-sm font-medium">
                  Cần thanh toán để tiếp tục
                </span>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
              >
                Thanh toán ngay
              </Button>
            </div>
          </div>
        )}
    </Card>
  );
};

export default TaskCard;