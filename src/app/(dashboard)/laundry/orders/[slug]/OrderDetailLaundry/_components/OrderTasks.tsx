/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from "react";
import { ToastProvider, ToastViewport } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import {
  OrderStatusEnum,
  Task,
  TaskStatusEnum,
} from "@/app/(dashboard)/laundry/orders/[slug]/OrderDetailLaundry/_components/order-task/TaskEnums";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { getEmployeeById, getEmployeesRealTimeStatus } from "@/apis/laudry/employee";
import { Skeleton } from "@/components/ui/skeleton";

interface OrderTasksProps {
  orderId: string;
  currentUser: any;
  orderStatusOverride?: OrderStatusEnum;
  updateOrderStatus: (newStatus: string) => void;
  onRefresh: () => void;
}

interface EmployeeCache {
  [key: string]: { name: string; data: any };
}

const OrderTasks: React.FC<OrderTasksProps> = ({
  orderId,
  currentUser,
  orderStatusOverride,
  updateOrderStatus,
  onRefresh,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingTask, setProcessingTask] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<OrderStatusEnum>(
    orderStatusOverride || OrderStatusEnum.Processing
  );
  const [checkoutTaskInfo, setCheckoutTaskInfo] = useState<{
    taskId: string;
    currentStatus: TaskStatusEnum;
    employeeId?: string;
    employeeName?: string;
  } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showWeightDialog, setShowWeightDialog] = useState(false);
  const [weightSubmitted, setWeightSubmitted] = useState(false);
  const { toast } = useToast();
  const tasksContainerRef = useRef<HTMLDivElement>(null);
  const [employeeCache, setEmployeeCache] = useState<EmployeeCache>({});
  const [availableEmployees, setAvailableEmployees] = useState<any[]>([]);

  const hasManagerRole =
    currentUser?.role === "Manager" || currentUser?.role === "Admin";

  useEffect(() => {
    if (orderStatusOverride !== undefined) {
      setOrderStatus(orderStatusOverride);
    }
  }, [orderStatusOverride]);

  const fetchEmployees = async () => {
    try {
      const fetchedEmployees = await getEmployeesRealTimeStatus();
      const filteredEmployees = fetchedEmployees.filter(
        (employee) => employee.status !== "Working"
      );
      setAvailableEmployees(filteredEmployees);
      const newCache = { ...employeeCache };
      filteredEmployees.forEach((emp) => {
        if (!newCache[emp.id]) {
          newCache[emp.id] = { name: emp.staffName, data: emp };
        }
      });
      setEmployeeCache(newCache);
    } catch (err: any) {
      console.error("Failed to prefetch employees:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await getOrderTasks(orderId);
      if (!response?.payload?.items || !Array.isArray(response.payload.items)) {
        throw new Error("Dữ liệu công việc không hợp lệ hoặc không tồn tại.");
      }
      const convertedTasks: Task[] = await Promise.all(
        response.payload.items.map(async (apiTask: ApiTask) => {
          let employeeName = apiTask.employeeName || "Chưa phân công nhân viên";
          let managerName = apiTask.managerName || "Unknown Manager";

          if (apiTask.employeeId && employeeCache[apiTask.employeeId]) {
            employeeName = employeeCache[apiTask.employeeId].name;
          } else if (apiTask.employeeId) {
            const employee = await getEmployeeById(apiTask.employeeId);
            employeeName = employee?.staffName || employeeName;
            setEmployeeCache((prev) => ({
              ...prev,
              [String(apiTask.employeeId)]: { name: employeeName, data: employee },
            }));
          }

          if (apiTask.assignedBy && employeeCache[apiTask.assignedBy]) {
            managerName = employeeCache[apiTask.assignedBy].name;
          } else if (apiTask.assignedBy) {
            const manager = await getEmployeeById(apiTask.assignedBy);
            managerName = manager?.staffName || managerName;
            setEmployeeCache((prev) => ({
              ...prev,
              [String(apiTask.assignedBy)]: { name: managerName, data: manager },
            }));
          }

          return {
            ...apiTask,
            status: convertToTaskStatusEnum(apiTask.status),
            priority: String(apiTask.priority),
            employeeName,
            managerName,
          };
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

  useEffect(() => {
    if (orderId) {
      fetchTasks();
    }
  }, [orderId, orderStatusOverride]);

  const handleRefreshTasks = async () => {
    setRefreshing(true);
    try {
      await fetchTasks();
      await fetchEmployees();
      onRefresh();
      setError(null);
    } catch (err: any) {
      console.error("Error refreshing tasks:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      setError(
        err.response?.data?.message ||
          err.message ||
          "Không thể làm mới danh sách công việc. Vui lòng thử lại sau."
      );
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể làm mới danh sách công việc.",
        duration: 5000,
      });
    } finally {
      setRefreshing(false);
    }
  };

  const updateOrderStatusFromTasks = (taskList: Task[]) => {
    const step1Completed =
      taskList.length > 0 && taskList[0].status === TaskStatusEnum.Completed;
    const step2Completed =
      taskList.length > 1 && taskList[1].status === TaskStatusEnum.Completed;
    const allTasksCompleted = taskList.every(
      (task) => task.status === TaskStatusEnum.Completed
    );
    const anyTaskCanceled = taskList.some(
      (task) => task.status === TaskStatusEnum.Canceled
    );

    let newStatus: OrderStatusEnum;
    if (anyTaskCanceled && orderStatus === OrderStatusEnum.Cancelled) {
      newStatus = OrderStatusEnum.Cancelled;
    } else if (allTasksCompleted) {
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
    updateOrderStatus(newStatus.toString());
  };

  const handleTaskCheckout = async (
    employeeId: string,
    employeeName: string
  ) => {
    if (!checkoutTaskInfo) return;

    if (
      checkoutTaskInfo.currentStatus === TaskStatusEnum.Completed ||
      checkoutTaskInfo.currentStatus === TaskStatusEnum.Canceled
    ) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description:
          "Công việc đã hoàn thành hoặc bị hủy, không thể cập nhật thêm.",
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

      const updatedTasks = tasks.map((task) =>
        task.id === checkoutTaskInfo.taskId
          ? {
              ...task,
              status: getNextTaskStatus(checkoutTaskInfo.currentStatus),
              employeeId,
              employeeName:
                employeeName || currentUser?.fullName || "Chưa xác định",
              assignedBy: currentUser?.id || task.assignedBy,
              managerName: currentUser?.fullName || "Unknown Manager",
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
      if (taskIndex === 1 && nextStatus === TaskStatusEnum.Completed) {
        setOrderStatus(OrderStatusEnum.Processing);
        updateOrderStatus("Processing");
        setTasks([...updatedTasks]);
      }
      if (nextStatus === TaskStatusEnum.InProgress) {
        toast({
          title: "Bắt đầu công việc",
          description: `${updatedTask.taskName} đã được bắt đầu thực hiện bởi ${employeeName}.`,
          duration: 5000,
        });
      } else if (nextStatus === TaskStatusEnum.Completed) {
        toast({
          title: "Công việc đã hoàn thành",
          description: `${updatedTask.taskName} đã được hoàn thành bởi ${employeeName}.`,
          duration: 5000,
        });
      }

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
    updateOrderStatus("PendingPayment");
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
    updateOrderStatus("Paid");
    toast({
      title: "Thanh toán hoàn tất",
      description: "Đơn hàng đã được thanh toán. Task 2 đã được mở khóa.",
      duration: 5000,
    });
  };

  const canCheckoutTask = (task: Task, index: number) => {
    if (!hasManagerRole) return false;

    if (orderStatus === OrderStatusEnum.Cancelled) return false;

    if (isTaskLocked(index)) return false;

    if (index === 0)
      return (
        task.status !== TaskStatusEnum.Completed &&
        task.status !== TaskStatusEnum.Canceled
      );
    if (index === 1) {
      return (
        tasks[0].status === TaskStatusEnum.Completed &&
        (orderStatus === OrderStatusEnum.Processing ||
          orderStatus === OrderStatusEnum.Paid) &&
        task.status !== TaskStatusEnum.Completed &&
        task.status !== TaskStatusEnum.Canceled
      );
    }
    if (index === 2) {
      return (
        tasks[0]?.status === TaskStatusEnum.Completed &&
        tasks[1]?.status === TaskStatusEnum.Completed &&
        orderStatus === OrderStatusEnum.Processing &&
        task.status !== TaskStatusEnum.Completed &&
        task.status !== TaskStatusEnum.Canceled
      );
    }
    return false;
  };

  const isTaskLocked = (index: number) => {
    if (orderStatus === OrderStatusEnum.Cancelled) return true;

    if (index === 0) return false;

    if (index === 1) {
      if (tasks[0]?.status === TaskStatusEnum.Completed) {
        if (
          orderStatus === OrderStatusEnum.Paid ||
          (orderStatus === OrderStatusEnum.Processing &&
            tasks[1]?.status === TaskStatusEnum.InProgress)
        ) {
          return false;
        }
        return orderStatus === OrderStatusEnum.PendingPayment;
      }
      return true;
    }

    if (index === 2) {
      return !(
        tasks[1]?.status === TaskStatusEnum.Completed &&
        tasks[2]?.status === TaskStatusEnum.Pending
      );
    }

    return true;
  };

  const handleCheckoutClick = (task: Task) => {
    setCheckoutTaskInfo({
      taskId: task.id,
      currentStatus: task.status,
      employeeId: task.employeeId ?? undefined,
      employeeName: task.employeeName ?? undefined,
    });
    setDialogOpen(true);
  };

  if (loading || refreshing) {
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
          onClick={handleRefreshTasks}
          variant="outline"
          className="mt-4 text-red-600 border-red-300 hover:bg-red-50"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Tải lại
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
        <Button onClick={handleRefreshTasks} variant="outline" className="mt-4">
          <RefreshCw className="mr-2 h-4 w-4" />
          Làm mới
        </Button>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        {checkoutTaskInfo && (
          <TaskCheckoutDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onConfirm={handleTaskCheckout}
            processing={processingTask !== null}
            taskId={checkoutTaskInfo.taskId}
            currentStatus={checkoutTaskInfo.currentStatus}
            currentUser={currentUser}
            availableEmployees={availableEmployees}
            employeeId={checkoutTaskInfo.employeeId}
            employeeName={checkoutTaskInfo.employeeName}
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

        <TaskProgress
          tasks={tasks}
          isTaskLocked={isTaskLocked}
          orderStatus={orderStatus}
        />
        <div className="space-y-6" ref={tasksContainerRef}>
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
                !weightSubmitted &&
                orderStatus !== OrderStatusEnum.Cancelled
                  ? handleWeightEdit
                  : undefined
              }
              tasks={tasks}
              staff={employeeCache[String(task.employeeId)]?.data || null}
              employeeCache={employeeCache}
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
      </div>
      <ToastViewport className="fixed bottom-0 right-0 flex flex-col p-6 gap-2 w-full max-w-sm m-0 z-50 outline-none" />
    </ToastProvider>
  );
};

export default OrderTasks;