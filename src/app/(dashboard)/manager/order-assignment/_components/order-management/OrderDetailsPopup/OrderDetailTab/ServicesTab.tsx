/* eslint-disable @typescript-eslint/no-unused-vars */
import { TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Calendar,
  Clock,
  AlertTriangle,
  Tag,
  ArrowRight,
  MapPin,
} from "lucide-react";
import {
  getPriorityColor,
  getStatusColor,
  formatDateTime,
} from "@/app/(dashboard)/manager/order-assignment/_components/order-management/OrderDetailsPopup/utils";
import { useEffect, useState } from "react";
import { getServiceById } from "@/apis/service";
import { getHouseById } from "@/apis/house";
import { z } from "zod";
import { OrderSchema } from "@/schema/order.schema";

type OrderType = z.infer<typeof OrderSchema>;

interface ServicesTabProps {
  order: OrderType;
}

export const ServicesTab: React.FC<ServicesTabProps> = ({ order }) => {
  const [serviceName, setServiceName] = useState<string>("Đang tải...");
  const [houseName, setHouseName] = useState<string>("Đang tải...");
  const priorityClass = getPriorityColor(order.priorityLevel || "");

  useEffect(() => {
    if (order.serviceId) {
      const fetchService = async () => {
        try {
          const response = await getServiceById(order.serviceId);
          if (response && response.payload.name) {
            setServiceName(response.payload.name || "Không có dịch vụ");
          } else {
            setServiceName("Không tìm thấy");
          }
        } catch (error) {
          console.error("Error fetching service:", error);
          setServiceName("Lỗi tải dữ liệu");
        }
      };
      fetchService();
    } else {
      setServiceName("N/A");
    }
  }, [order.serviceId]);

  useEffect(() => {
    const fetchHouseName = async () => {
      try {
        if (order.address) {
          const houseData = await getHouseById(order.address);
          setHouseName(houseData.payload.no || "Không xác định");
        } else {
          setHouseName("N/A");
        }
      } catch (error) {
        setHouseName("Lỗi khi tải");
      }
    };

    fetchHouseName();
  }, [order.address]);

  // Helper function to extract display text from string or object
  const getDisplayText = (item: string | { name: string }): string => {
    return typeof item === "string" ? item : item.name || "Không xác định";
  };

  return (
    <TabsContent value="services" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-indigo-50 p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-indigo-800 mb-3 flex items-center gap-2">
            <Package size={18} />
            Thông tin dịch vụ
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-500 whitespace-nowrap">Tên dịch vụ :</div>
              <div className="font-medium whitespace-nowrap">{serviceName}</div>
            </div>
            {order.priorityLevel && (
              <div>
                <div className="text-sm text-gray-500">Mức độ ưu tiên</div>
                <Badge className={priorityClass}>{order.priorityLevel}</Badge>
              </div>
            )}
          </div>

          {order.emergencyRequest && (
            <div className="mt-4 p-3 bg-red-50 rounded-md border border-red-100">
              <div className="font-semibold text-red-800 mb-1 flex items-center gap-2">
                <AlertTriangle size={16} />
                Dịch vụ khẩn cấp
              </div>
              <div className="text-red-700 text-sm">
                Dịch vụ này được đánh dấu là ĐẶT NGAY và cần được ưu tiên xử lý.
              </div>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-stone-50 to-amber-50 p-4 rounded-lg shadow-sm border border-stone-100">
          <h3 className="font-semibold text-stone-800 mb-3 flex items-center gap-2">
            <MapPin size={18} />
            Địa điểm & Trạng thái
          </h3>
          <div className="mb-4 flex items-center space-x-2">
            <div className="text-sm text-gray-500 mb-1">Địa chỉ :</div>
            <div className="text-gray-700 font-medium">{houseName}</div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-500 mb-1">Trạng thái thực</div>
            <Badge
              variant="outline"
              className={`px-4 py-2 ${getStatusColor(
                order.realTimeStatus || order.status
              )}`}
            >
              {order.realTimeStatus || order.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Calendar size={18} />
          Thời gian dịch vụ
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {order.timeSlotDetail && (
            <div>
              <div className="text-sm text-gray-500">Khung giờ</div>
              <div className="font-medium">{order.timeSlotDetail}</div>
            </div>
          )}
          {order.jobStartTime && (
            <div>
              <div className="text-sm text-gray-500">Thời gian bắt đầu</div>
              <div className="font-medium">
                {formatDateTime(order.jobStartTime)}
              </div>
            </div>
          )}
          <div className="flex items-center gap-1">
            <div>
              <div className="text-sm text-gray-500">Thời lượng</div>
              <div className="font-medium flex items-center">
                <span>{order.estimatedDuration} giờ</span>
                {order.actualDuration && (
                  <>
                    <ArrowRight size={14} className="mx-1" />
                    <span>{order.actualDuration} giờ (thực tế)</span>
                  </>
                )}
              </div>
            </div>
          </div>
          {order.jobEndTime && (
            <div>
              <div className="text-sm text-gray-500">Thời gian kết thúc</div>
              <div className="font-medium">
                {formatDateTime(order.jobEndTime)}
              </div>
            </div>
          )}
        </div>
      </div>

      {order.notes && (
        <div className="bg-yellow-50 p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
            <Tag size={18} />
            Ghi chú
          </h3>
          <p className="text-gray-700 whitespace-pre-line">{order.notes}</p>
        </div>
      )}

      {order.extraServices && order.extraServices.length > 0 && (
        <div className="bg-pink-50 p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-pink-800 mb-3">Dịch vụ thêm</h3>
          <div className="flex flex-wrap gap-2">
            {order.extraServices.map((service, index) => (
              <Badge key={index} className="bg-pink-100 text-pink-800">
                {getDisplayText(service)}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {order.options && order.options.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">Tùy chọn khác</h3>
          <div className="flex flex-wrap gap-2">
            {order.options.map((option, index) => (
              <Badge key={index} className="bg-gray-200 text-gray-800">
                {getDisplayText(option)}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </TabsContent>
  );
};
