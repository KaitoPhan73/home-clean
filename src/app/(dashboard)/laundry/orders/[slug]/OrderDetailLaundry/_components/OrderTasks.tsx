/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from "react";
import { ToastProvider, ToastViewport } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  OrderStatusEnum,
  Task,
  TaskStatusEnum,
} from "@/app/(dashboard)/laundry/orders/[slug]/OrderDetailLaundry/_components/order-task/TaskEnums";
import { AlertCircle, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import OrderStatusHeader from "@/app/(dashboard)/laundry/orders/[slug]/OrderDetailLaundry/_components/order-task/OrderStatusHeader";
import TaskProgress from "@/app/(dashboard)/laundry/orders/[slug]/OrderDetailLaundry/_components/order-task/TaskProgress";
import TaskCard from "@/app/(dashboard)/laundry/orders/[slug]/OrderDetailLaundry/_components/order-task/TaskCard";
import ProcessGuide from "@/app/(dashboard)/laundry/orders/[slug]/OrderDetailLaundry/_components/order-task/ProcessGuide";
import TaskCheckoutDialog from "@/app/(dashboard)/laundry/orders/[slug]/OrderDetailLaundry/_components/order-task/TaskCheckoutDialog";
import {
  assignTask,
  getNextTaskStatus,
  convertToTaskStatusEnum,
} from "@/app/(dashboard)/laundry/orders/[slug]/OrderDetailLaundry/_components/order-task/taskService";
import { getOrderTasks, ApiTask } from "@/apis/laudry/task";
import PaymentStatusNotification from "@/app/(dashboard)/laundry/orders/[slug]/OrderDetailLaundry/_components/order-task/PaymentNotification";
import WeightSubmissionDialog from "@/app/(dashboard)/laundry/orders/[slug]/OrderDetailLaundry/_components/order-task/WeightSubmissionDialog";

interface OrderTasksProps {
  orderId: string;
  currentUser: any;
  orderStatusOverride?: OrderStatusEnum;
  updateOrderStatus: (newStatus: string) => void;
}

const OrderTasks: React.FC<OrderTasksProps> = ({
  orderId,
  currentUser,
  orderStatusOverride,
  updateOrderStatus,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingTask, setProcessingTask] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<OrderStatusEnum>(
    orderStatusOverride || OrderStatusEnum.Processing
  );
  const [checkoutTaskInfo, setCheckoutTaskInfo] = useState<{
    taskId: string;
    currentStatus: TaskStatusEnum;
  } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showWeightDialog, setShowWeightDialog] = useState(false);
  const [weightSubmitted, setWeightSubmitted] = useState(false);
  const { toast } = useToast();
  const tasksContainerRef = useRef<HTMLDivElement>(null);

  const hasManagerRole =
    currentUser?.role === "Manager" || currentUser?.role === "Admin";

  useEffect(() => {
    if (orderStatusOverride !== undefined) {
      setOrderStatus(orderStatusOverride);
    }
  }, [orderStatusOverride]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await getOrderTasks(orderId);
        if (!response?.payload?.items || !Array.isArray(response.payload.items)) {
          throw new Error("Dữ liệu công việc không hợp lệ hoặc không tồn tại.");
        }
        const convertedTasks: Task[] = response.payload.items.map(
          (apiTask: ApiTask) => ({
            ...apiTask,
            status: convertToTaskStatusEnum(apiTask.status),
            priority: String(apiTask.priority),
            employeeName: apiTask.employeeName || "Chưa phân công nhân viên",
            managerName: apiTask.managerName || "Unknown Manager",
          })
        );
        const sortedTasks = convertedTasks.sort((a: Task, b: Task) => {
          const priorityA = isNaN(Number(a.priority)) ? 0 : Number(a.priority);
          const priorityB = isNaN(Number(b.priority)) ? 0 : Number(b.priority);
          return priorityA - priorityB;
        });
        setTasks(sortedTasks);
        if (orderStatusOverride === undefined) {
          updateOrderStatusFromTasks(sortedTasks);
        }
        setError(null);
      } catch (err: any) {
        console.error("Error fetching tasks:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        setError(
          err.response?.data?.message ||
            err.message ||
            "Không thể tải danh sách công việc. Vui lòng thử lại sau."
        );
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, orderStatusOverride]);

  const updateOrderStatusFromTasks = (taskList: Task[]) => {
    const step1Completed =
      taskList.length > 0 && taskList[0].status === TaskStatusEnum.Completed;
    const step2Completed =
      taskList.length > 1 && taskList[1].status === TaskStatusEnum.Completed;
    const allTasksCompleted = taskList.every(
      (task) => task.status === TaskStatusEnum.Completed
    );

    let newStatus: OrderStatusEnum;
    if (allTasksCompleted) {
      newStatus = OrderStatusEnum.Completed;
    } else if (
      step2Completed &&
      !allTasksCompleted &&
      orderStatus !== OrderStatusEnum.Paid
    ) {
      newStatus = OrderStatusEnum.PendingPayment;
    } else if (
      step1Completed ||
      taskList.some((task) => task.status === TaskStatusEnum.InProgress)
    ) {
      newStatus = OrderStatusEnum.Processing;
    } else {
      newStatus = OrderStatusEnum.Draft;
    }

    setOrderStatus(newStatus);
    updateOrderStatus(newStatus.toString()); // Sync with parent
  };

  const handleTaskCheckout = async (employeeId: string) => {
    if (!checkoutTaskInfo) return;

    if (checkoutTaskInfo.currentStatus === TaskStatusEnum.Completed) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Công việc đã hoàn thành, không thể cập nhật thêm.",
        duration: 5000,
      });
      setDialogOpen(false);
      return;
    }

    try {
      setProcessingTask(checkoutTaskInfo.taskId);
      setError(null);
      setDialogOpen(false);

      const action =
        checkoutTaskInfo.currentStatus === TaskStatusEnum.Pending
          ? "start"
          : "complete";
      await assignTask(checkoutTaskInfo.taskId, employeeId, action);

      // Optimistically update tasks
      const updatedTasks = tasks.map((task) =>
        task.id === checkoutTaskInfo.taskId
          ? {
              ...task,
              status: getNextTaskStatus(checkoutTaskInfo.currentStatus),
              employeeId,
              employeeName: currentUser?.fullName || "Unknown",
              updatedAt: new Date().toISOString(),
            }
          : task
      );
      setTasks(updatedTasks);

      const taskIndex = updatedTasks.findIndex(
        (task) => task.id === checkoutTaskInfo.taskId
      );
      const updatedTask = updatedTasks[taskIndex];
      const nextStatus = getNextTaskStatus(checkoutTaskInfo.currentStatus);

      if (nextStatus === TaskStatusEnum.InProgress) {
        toast({
          title: "Bắt đầu công việc",
          description: `${updatedTask.taskName} đã được bắt đầu thực hiện.`,
          duration: 5000,
        });
      } else if (nextStatus === TaskStatusEnum.Completed) {
        toast({
          title: "Công việc đã hoàn thành",
          description: `${updatedTask.taskName} đã được hoàn thành thành công.`,
          duration: 5000,
        });
      }

      // Only show weight dialog when Task 1 is completed and weight not yet submitted
      if (
        taskIndex === 0 &&
        updatedTasks[0].status === TaskStatusEnum.Completed &&
        !weightSubmitted
      ) {
        setShowWeightDialog(true);
      }

      updateOrderStatusFromTasks(updatedTasks);
    } catch (err: any) {
      console.error("Error updating task:", err);
      const errorMessage =
        err.message ||
        err.response?.data?.message ||
        "Không thể cập nhật trạng thái công việc. Vui lòng thử lại sau.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setProcessingTask(null);
      setCheckoutTaskInfo(null);
    }
  };

  const handleWeightSubmit = () => {
    setWeightSubmitted(true);
    setShowWeightDialog(false);
    setOrderStatus(OrderStatusEnum.PendingPayment);
    updateOrderStatus("PendingPayment"); // Sync with parent
    toast({
      title: "Đã cập nhật trọng lượng",
      description: "Trọng lượng đã được cập nhật thành công.",
      duration: 5000,
    });
  };

  const handleWeightEdit = () => {
    setShowWeightDialog(true);
  };

  const handlePaymentComplete = () => {
    setOrderStatus(OrderStatusEnum.Paid);
    setWeightSubmitted(false);
    updateOrderStatus("Paid"); // Sync with parent
    toast({
      title: "Thanh toán hoàn tất",
      description: "Đơn hàng đã được thanh toán. Task 2 đã được mở khóa.",
      duration: 5000,
    });
  };

  const canCheckoutTask = (task: Task, index: number) => {
    if (!hasManagerRole) return false;

    if (isTaskLocked(index)) return false;

    if (index === 0) return task.status !== TaskStatusEnum.Completed;
    if (index === 1) {
      return (
        tasks[0].status === TaskStatusEnum.Completed &&
        (orderStatus === OrderStatusEnum.Processing ||
          orderStatus === OrderStatusEnum.Paid) &&
        task.status !== TaskStatusEnum.Completed
      );
    }
    if (index === 2) {
      return (
        tasks[0]?.status === TaskStatusEnum.Completed &&
        tasks[1]?.status === TaskStatusEnum.Completed &&
        orderStatus === OrderStatusEnum.Processing &&
        task.status !== TaskStatusEnum.Completed
      );
    }
    return false;
  };

  const isTaskLocked = (index: number) => {
    if (index === 0) return false; // Task 1 always unlocked

    if (index === 1) {
      if (tasks[0]?.status === TaskStatusEnum.Completed) {
        if (
          orderStatus === OrderStatusEnum.Paid ||
          (orderStatus === OrderStatusEnum.Processing &&
            tasks[1]?.status === TaskStatusEnum.InProgress)
        ) {
          return false;
        }
        return true;
      }
      return true;
    }

    if (index === 2) {
      return !(
        tasks[0]?.status === TaskStatusEnum.Completed &&
        tasks[1]?.status === TaskStatusEnum.Completed &&
        tasks[2]?.status === TaskStatusEnum.Pending &&
        orderStatus === OrderStatusEnum.Processing
      );
    }

    return true;
  };

  const handleCheckoutClick = (task: Task) => {
    setCheckoutTaskInfo({
      taskId: task.id,
      currentStatus: task.status,
    });
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg border border-red-200">
        <div className="flex items-center text-red-600 mb-3">
          <AlertCircle className="mr-2 h-5 w-5" />
          <h3 className="font-semibold">Lỗi</h3>
        </div>
        <p className="text-red-700">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="mt-4 text-red-600 border-red-300 hover:bg-red-50"
        >
          Tải lại trang
        </Button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
        <p className="text-gray-600">
          Không có công việc nào cho đơn hàng này.
        </p>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div
        className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2"
        ref={tasksContainerRef}
      >
        {checkoutTaskInfo && (
          <TaskCheckoutDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onConfirm={handleTaskCheckout}
            processing={processingTask !== null}
            taskId={checkoutTaskInfo.taskId}
            currentStatus={checkoutTaskInfo.currentStatus}
            currentUser={currentUser}
          />
        )}

        {showWeightDialog && (
          <WeightSubmissionDialog
            open={showWeightDialog}
            onOpenChange={setShowWeightDialog}
            orderId={orderId}
            onSubmit={handleWeightSubmit}
          />
        )}

        {weightSubmitted && orderStatus === OrderStatusEnum.PendingPayment && (
          <PaymentStatusNotification
            orderId={orderId}
            orderStatus={orderStatus}
            onWeightSubmitted={handlePaymentComplete}
          />
        )}

        <OrderStatusHeader orderStatus={orderStatus} />

        <TaskProgress
          tasks={tasks}
          isTaskLocked={isTaskLocked}
          orderStatus={orderStatus}
        />
        <div className="space-y-6">
          {tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              index={index}
              currentUser={currentUser}
              orderStatus={orderStatus}
              processingTask={processingTask}
              canCheckoutTask={canCheckoutTask}
              isTaskLocked={isTaskLocked}
              onCheckout={() => handleCheckoutClick(task)}
              onWeightEdit={
                index === 0 &&
                task.status === TaskStatusEnum.Completed &&
                !weightSubmitted
                  ? handleWeightEdit
                  : undefined
              }
              tasks={tasks}
              staff={null}
            />
          ))}
        </div>

        {!hasManagerRole && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mt-4">
            <p className="text-sm text-gray-600 text-center">
              Chỉ người dùng có vai trò Manager mới có thể cập nhật trạng thái công việc.
            </p>
          </div>
        )}

        <ProcessGuide />

        <ToastViewport className="fixed bottom-0 right-0 flex flex-col p-6 gap-2 w-full max-w-sm m-0 z-50 outline-none" />
      </div>
    </ToastProvider>
  );
};

export default OrderTasks;