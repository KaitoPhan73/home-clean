/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Timer, CheckCircle2 } from "lucide-react";
import {
  formatDateTime,
} from "@/app/(dashboard)/manager/order-assignment/_components/order-management/OrderDetailsPopup/utils";
import { getTrackingOrderById } from "@/apis/order";
import { Skeleton } from "@/components/ui/skeleton";

interface SchedulingTabProps {
  order: any;
}

interface TrackingSubActivity {
  activityId: string;
  title: string;
  estimatedTime: string;
  status: "Completed" | "Pending" | "InProgress";
}

interface TrackingStep {
  title: string;
  description: string;
  time: string | null;
  status: "Completed" | "Pending" | "InProgress";
  subActivities: TrackingSubActivity[] | null;
}

interface OrderTracking {
  orderId: string;
  steps: TrackingStep[];
}

export const SchedulingTab: React.FC<SchedulingTabProps> = ({ order }) => {
  const [tracking, setTracking] = useState<OrderTracking | null>(null);
  const [isLoadingTracking, setIsLoadingTracking] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrderTracking = async () => {
      setIsLoadingTracking(true);
      try {
        if (order.id) {
          const response = await getTrackingOrderById(order.id);
          setTracking(response.payload);
        }
      } catch (error) {
        if (order.note) {
          try {
            const parsedNote = JSON.parse(order.note);
            setTracking(parsedNote);
          } catch (e) {}
        }
      } finally {
        setIsLoadingTracking(false);
      }
    };

    fetchOrderTracking();
    const pollingInterval = setInterval(fetchOrderTracking, 30000);
    return () => clearInterval(pollingInterval);
  }, [order.id, order.note]);

  const calculateProgress = () => {
    if (!tracking || !tracking.steps || tracking.steps.length === 0) return 0;
    const totalSteps = tracking.steps.length;
    const completedSteps = tracking.steps.filter(
      (step) => step.status === "Completed"
    ).length;
    return Math.round((completedSteps / totalSteps) * 100);
  };

  return (
    <TabsContent value="scheduling" className="space-y-6">
      <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-5 rounded-lg shadow-sm border border-violet-100">
        <h3 className="font-semibold text-violet-800 mb-3 flex items-center gap-2">
          <Clock size={18} />
          Thông tin lịch trình
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500 mb-1">Ngày đặt lịch</div>
            <div className="font-medium flex items-center gap-1">
              <Calendar size={16} className="text-violet-500" />
              {order.createdAt
                ? formatDateTime(order.createdAt)
                : "Chưa xác định"}
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-500 mb-1">Khung giờ</div>
              <div className="font-medium flex items-center gap-1">
                <Clock size={16} className="text-violet-500" />
                {order.timeSlotDetail || "N/A"}
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-500 mb-1">
                Thời gian ước tính
              </div>
              <div className="font-medium flex items-center gap-1">
                <Timer size={16} className="text-violet-500" />
                {order.estimatedDuration
                  ? `${order.estimatedDuration} giờ`
                  : "N/A"}
              </div>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1 mt-2">
              Thời gian bắt đầu công việc
            </div>
            <div className="font-medium flex items-center gap-1">
              <Timer size={16} className="text-violet-500" />
              {order.jobStartTime ? formatDateTime(order.jobStartTime) : "Công việc chưa bắt đầu"}
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-500 mb-1">
                Thời gian kết thúc công việc
              </div>
              <div className="font-medium flex items-center gap-1">
                <Timer size={16} className="text-violet-500" />
                {order.jobEndTime ? formatDateTime(order.jobEndTime) : "Công việc chưa kết thúc"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-lg shadow-sm border border-blue-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-blue-800 flex items-center gap-2">
            <CheckCircle2 size={18} />
            Theo dõi tiến trình
          </h3>
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <div className="w-24 h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-blue-600 rounded-full"
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
            <span className="font-medium">{calculateProgress()}%</span>
          </div>
        </div>
        {isLoadingTracking ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : tracking && tracking.steps ? (
          <div className="space-y-1">
            {tracking.steps.map((step, index) => (
              <div
                key={index}
                className={`border-l-2 pl-4 pb-6 relative ${
                  step.status === "Completed"
                    ? "border-green-500"
                    : step.status === "InProgress"
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
              >
                <div
                  className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${
                    step.status === "Completed"
                      ? "bg-green-500"
                      : step.status === "InProgress"
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }`}
                />
                <div className="mb-2">
                  <h4 className="font-semibold text-gray-800">{step.title}</h4>
                  <p className="text-gray-600">{step.description}</p>
                  {step.time && (
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDateTime(step.time)}
                    </p>
                  )}
                  <Badge
                    className={`mt-2 px-2 py-1 ${
                      step.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : step.status === "InProgress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {step.status === "Completed"
                      ? "Hoàn thành"
                      : step.status === "InProgress"
                      ? "Đang thực hiện"
                      : "Chờ xử lý"}
                  </Badge>
                </div>
                {step.subActivities && step.subActivities.length > 0 && (
                  <div className="ml-4 mt-2 space-y-2 border-l border-dashed border-gray-300 pl-4">
                    {step.subActivities.map((activity) => (
                      <div key={activity.activityId} className="relative">
                        <div
                          className={`absolute -left-[5px] top-[10px] w-2 h-2 rounded-full ${
                            activity.status === "Completed"
                              ? "bg-green-500"
                              : activity.status === "InProgress"
                              ? "bg-blue-500"
                              : "bg-gray-300"
                          }`}
                        />
                        <div className="bg-white p-2 rounded-md border border-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-700">
                              {activity.title}
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                activity.status === "Completed"
                                  ? "bg-green-50 text-green-600"
                                  : activity.status === "InProgress"
                                  ? "bg-blue-50 text-blue-600"
                                  : "bg-gray-50 text-gray-600"
                              }`}
                            >
                              {activity.status}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Ước tính: {activity.estimatedTime} phút
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            Không có dữ liệu theo dõi
          </div>
        )}
      </div>
    </TabsContent>
  );
};