/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from "react";
import { getOrderTasks, taskAssign } from "@/apis/laudry/order";
import { ToastProvider, ToastViewport } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

import { Skeleton } from "@/components/ui/skeleton";
import { OrderStatusEnum, Task, TaskStatusEnum } from "@/app/(dashboard)/manager/laundry/[slug]/OrderDetailLaundry/_components/order-task/TaskEnums";
import { AlertCircle, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import OrderStatusHeader from "@/app/(dashboard)/manager/laundry/[slug]/OrderDetailLaundry/_components/order-task/OrderStatusHeader";
import PaymentNotification from "@/app/(dashboard)/manager/laundry/[slug]/OrderDetailLaundry/_components/order-task/PaymentNotification";
import ConfirmDialog from "@/app/(dashboard)/manager/laundry/[slug]/OrderDetailLaundry/_components/order-task/ConfirmDialog";
import TaskProgress from "@/app/(dashboard)/manager/laundry/[slug]/OrderDetailLaundry/_components/order-task/TaskProgress";
import TaskCard from "@/app/(dashboard)/manager/laundry/[slug]/OrderDetailLaundry/_components/order-task/TaskCard";
import ProcessGuide from "@/app/(dashboard)/manager/laundry/[slug]/OrderDetailLaundry/_components/order-task/ProcessGuide";

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
  const [taskToCheckout, setTaskToCheckout] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showPaymentNotification, setShowPaymentNotification] = useState(false);
  const { toast } = useToast();
  const tasksContainerRef = useRef<HTMLDivElement>(null);

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
        const sortedTasks = response.payload.items.sort(
          (a, b) => Number(a.priority) - Number(b.priority)
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

  const handleCheckoutTask = async () => {
    if (!taskToCheckout) return;

    try {
      setProcessingTask(taskToCheckout);
      setError(null);
      setDialogOpen(false);

      await taskAssign(taskToCheckout);

      const response = await getOrderTasks(orderId);
      const sortedTasks = response.payload.items.sort(
        (a, b) => Number(a.priority) - Number(b.priority)
      );

      setTasks(sortedTasks);

      const taskIndex = sortedTasks.findIndex(
        (task) => task.id === taskToCheckout
      );
      const completedTask = sortedTasks[taskIndex];

      toast({
        title: "Công việc đã hoàn thành",
        description: `${completedTask.taskName} đã được hoàn thành thành công.`,
        duration: 5000,
      });

      if (
        taskIndex === 1 &&
        sortedTasks[1].status === TaskStatusEnum.Completed
      ) {
        setOrderStatus(OrderStatusEnum.PendingPayment);
        setShowPaymentNotification(true);

        toast({
          variant: "destructive",
          title: "Chờ thanh toán",
          description:
            "Đã cập nhật trạng thái đơn hàng. Vui lòng thanh toán để tiếp tục bước tiếp theo.",
          duration: 10000,
        });
      }

      updateOrderStatusFromTasks(sortedTasks);
    } catch (err) {
      console.error("Error checking out task:", err);
      setError(
        "Không thể cập nhật trạng thái công việc. Vui lòng thử lại sau."
      );

      toast({
        variant: "destructive",
        title: "Lỗi",
        description:
          "Không thể cập nhật trạng thái công việc. Vui lòng thử lại sau.",
        duration: 5000,
      });
    } finally {
      setProcessingTask(null);
      setTaskToCheckout(null);
    }
  };

  const canCheckoutTask = (task: Task, index: number) => {
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
        <ConfirmDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onConfirm={handleCheckoutTask}
          processing={processingTask !== null}
        />

        <PaymentNotification
          show={showPaymentNotification}
          onClose={() => setShowPaymentNotification(false)}
        />

        <OrderStatusHeader orderStatus={orderStatus} />

        {orderStatus === OrderStatusEnum.PendingPayment && (
          <div className="px-4 py-3 rounded-lg bg-yellow-50 border border-yellow-200 animate-pulse">
            <div className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Đơn hàng đang chờ thanh toán
                </p>
                <p className="text-sm text-yellow-700">
                  Vui lòng thanh toán để tiếp tục xử lý đơn hàng.
                </p>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <Button
                size="sm"
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                <CreditCard className="mr-1 h-4 w-4" />
                Thanh toán ngay
              </Button>
            </div>
          </div>
        )}

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
              onCheckout={() => {
                setTaskToCheckout(task.id);
                setDialogOpen(true);
              }}
              tasks={tasks}
            />
          ))}
        </div>

        <ProcessGuide />

        <ToastViewport className="fixed bottom-0 right-0 flex flex-col p-6 gap-2 w-full max-w-sm m-0 z-50 outline-none" />
      </div>
    </ToastProvider>
  );
};

export default OrderTasks;