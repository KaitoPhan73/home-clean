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
import { getOrderTasks, ApiTask } from "@/apis/laudry/task";
import {
  assignTask,
  getNextTaskStatus,
  convertToTaskStatusEnum,
} from "@/app/(dashboard)/laundry/orders/[slug]/OrderDetailLaundry/_components/order-task/taskService";
import PaymentStatusNotification from "@/app/(dashboard)/laundry/orders/[slug]/OrderDetailLaundry/_components/order-task/PaymentNotification";

interface OrderTasksProps {
  orderId: string;
  currentUser: any;
  orderStatusOverride?: OrderStatusEnum;
}

const OrderTasks: React.FC<OrderTasksProps> = ({
  orderId,
  currentUser,
  orderStatusOverride,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingTask, setProcessingTask] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<OrderStatusEnum>(
    OrderStatusEnum.Processing
  );
  const [checkoutTaskInfo, setCheckoutTaskInfo] = useState<{
    taskId: string;
    currentStatus: TaskStatusEnum;
  } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showPaymentNotification, setShowPaymentNotification] = useState(false);
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

        // Convert API tasks to application Task type with proper enum conversion
        const convertedTasks: Task[] = response.payload.items.map(
          (apiTask: ApiTask) => ({
            ...apiTask,
            // Convert string status to TaskStatusEnum
            status: convertToTaskStatusEnum(apiTask.status),
          })
        );

        // Sort tasks by priority
        const sortedTasks = convertedTasks.sort(
          (a: Task, b: Task) => Number(a.priority) - Number(b.priority)
        );

        setTasks(sortedTasks);

        if (orderStatusOverride === undefined) {
          updateOrderStatusFromTasks(sortedTasks);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Không thể tải danh sách công việc. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchTasks();
    }
  }, [orderId, orderStatusOverride]);

  const updateOrderStatusFromTasks = (taskList: Task[]) => {
    const step1Completed =
      taskList.length > 0 && taskList[0].status === TaskStatusEnum.Completed;
    const step2Completed =
      taskList.length > 1 && taskList[1].status === TaskStatusEnum.Completed;
    const allTasksCompleted = taskList.every(
      (task) => task.status === TaskStatusEnum.Completed
    );

    if (allTasksCompleted) {
      setOrderStatus(OrderStatusEnum.Completed);
    } else if (step2Completed && !allTasksCompleted) {
      setOrderStatus(OrderStatusEnum.PendingPayment);
    } else if (
      step1Completed ||
      taskList.some((task) => task.status === TaskStatusEnum.InProgress)
    ) {
      setOrderStatus(OrderStatusEnum.Processing);
    } else {
      setOrderStatus(OrderStatusEnum.Draft);
    }
  };

  const handleTaskCheckout = async (employeeId: string) => {
    if (!checkoutTaskInfo) return;

    // Prevent action if the task is already completed
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

      const response = await getOrderTasks(orderId);

      // Convert API tasks to application Task type with proper enum conversion
      const convertedTasks: Task[] = response.payload.items.map(
        (apiTask: ApiTask) => ({
          ...apiTask,
          status: convertToTaskStatusEnum(apiTask.status),
        })
      );

      // Sort tasks by priority
      const sortedTasks = convertedTasks.sort(
        (a: Task, b: Task) => Number(a.priority) - Number(b.priority)
      );

      setTasks(sortedTasks);

      const taskIndex = sortedTasks.findIndex(
        (task) => task.id === checkoutTaskInfo.taskId
      );
      const updatedTask = sortedTasks[taskIndex];
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

      if (
        taskIndex === 1 &&
        sortedTasks[1].status === TaskStatusEnum.Completed
      ) {
        setOrderStatus(OrderStatusEnum.PendingPayment);
        setShowPaymentNotification(true);

        toast({
          variant: "pendingPayment",
          title: "Chờ thanh toán",
          description:
            "Đã cập nhật trạng thái đơn hàng. Vui lòng thanh toán để tiếp tục bước tiếp theo.",
          duration: 10000,
        });
      }

      updateOrderStatusFromTasks(sortedTasks);
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

  const canCheckoutTask = (task: Task, index: number) => {
    if (!hasManagerRole) return false;

    if (index === 0) return task.status !== TaskStatusEnum.Completed;
    if (index === 1) {
      return (
        tasks[0].status === TaskStatusEnum.Completed &&
        task.status !== TaskStatusEnum.Completed
      );
    }
    if (index === 2) {
      return (
        orderStatus === OrderStatusEnum.Paid &&
        task.status !== TaskStatusEnum.Completed
      );
    }
    return false;
  };

  const isTaskLocked = (index: number) => {
    if (index === 0) return false;
    if (index === 1) {
      return tasks[0]?.status !== TaskStatusEnum.Completed;
    }
    if (index === 2) {
      return orderStatus !== OrderStatusEnum.Paid;
    }
    return true;
  };

  const handleCheckoutClick = (task: Task) => {
    console.log("Task status before checkout:", task.status);
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

        <PaymentStatusNotification
          orderId={orderId}
          orderStatus={orderStatus}
          onWeightSubmitted={() => {
            // Optionally refresh data after weight submission
            const fetchTasks = async () => {
              try {
                setLoading(true);
                const response = await getOrderTasks(orderId);

                // Convert API tasks to application Task type with proper enum conversion
                const convertedTasks: Task[] = response.payload.items.map(
                  (apiTask: ApiTask) => ({
                    ...apiTask,
                    status: convertToTaskStatusEnum(apiTask.status),
                  })
                );

                // Sort tasks by priority
                const sortedTasks = convertedTasks.sort(
                  (a: Task, b: Task) => Number(a.priority) - Number(b.priority)
                );

                setTasks(sortedTasks);
                setOrderStatus(OrderStatusEnum.Paid);
                updateOrderStatusFromTasks(sortedTasks);

                toast({
                  title: "Đã cập nhật trọng lượng",
                  description:
                    "Trọng lượng đã được cập nhật và đơn hàng đã được chuyển sang trạng thái thanh toán.",
                  duration: 5000,
                });
              } catch (err) {
                console.error("Error refreshing tasks:", err);
              } finally {
                setLoading(false);
              }
            };

            fetchTasks();
          }}
        />

        <OrderStatusHeader orderStatus={orderStatus} />

        <TaskProgress tasks={tasks} isTaskLocked={isTaskLocked} />

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
              tasks={tasks}
            />
          ))}
        </div>

        {!hasManagerRole && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mt-4">
            <p className="text-sm text-gray-600 text-center">
              Chỉ người dùng có vai trò Manager mới có thể cập nhật trạng thái
              công việc.
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
