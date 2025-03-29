/* eslint-disable @typescript-eslint/no-explicit-any */
// components/OrderDetailsPopup/SchedulingTab.tsx
import { TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin } from "lucide-react";
import { formatDateTime, getStatusColor } from "@/app/(dashboard)/manager/order-assignment/_components/order-management/OrderDetailsPopup/utils";

interface SchedulingTabProps {
  order: any;
}

export const SchedulingTab: React.FC<SchedulingTabProps> = ({ order }) => {
  return (
    <TabsContent value="scheduling" className="space-y-6">
      <div className="bg-violet-50 p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold text-violet-800 mb-3 flex items-center gap-2">
          <Clock size={18} />
          Thông tin lịch trình
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">Ngày đặt lịch</div>
            <div className="font-medium">{formatDateTime(order.bookingDate)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">ID Khung giờ</div>
            <div className="font-medium">{order.timeSlotId}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Thời gian ước tính</div>
            <div className="font-medium">{order.estimatedDuration ? `${order.estimatedDuration} phút` : "N/A"}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Thời gian thực tế</div>
            <div className="font-medium">{order.actualDuration ? `${order.actualDuration} phút` : "N/A"}</div>
          </div>
        </div>
      </div>

      <div className="bg-emerald-50 p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold text-emerald-800 mb-3">Chi tiết thời gian</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <div className="text-gray-700">Thời gian đến dự kiến</div>
            </div>
            <div className="font-medium">{formatDateTime(order.estimatedArrivalTime)}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="text-gray-700">Thời gian bắt đầu</div>
            </div>
            <div className="font-medium">{formatDateTime(order.jobStartTime)}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="text-gray-700">Thời gian kết thúc</div>
            </div>
            <div className="font-medium">{formatDateTime(order.jobEndTime)}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="text-gray-700">Hạn chót hủy</div>
            </div>
            <div className="font-medium">{formatDateTime(order.cancellationDeadline)}</div>
          </div>
        </div>
      </div>

      <div className="bg-stone-50 p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold text-stone-800 mb-3 flex items-center gap-2">
          <MapPin size={18} />
          Địa chỉ
        </h3>
        <div className="text-gray-700">{order.address}</div>
      </div>

      <div className="bg-amber-50 p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold text-amber-800 mb-3">Trạng thái thực</h3>
        <Badge className={getStatusColor(order.realTimeStatus || order.status)}>
          {order.realTimeStatus || order.status}
        </Badge>
      </div>
    </TabsContent>
  );
};