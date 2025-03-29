/* eslint-disable @typescript-eslint/no-explicit-any */
// components/OrderDetailsPopup/ServicesTab.tsx
import { TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Package, Wrench } from "lucide-react";
import { getPriorityColor } from "@/app/(dashboard)/manager/order-assignment/_components/order-management/OrderDetailsPopup/utils";

interface ServicesTabProps {
  order: any;
}

export const ServicesTab: React.FC<ServicesTabProps> = ({ order }) => {
  const priorityClass = getPriorityColor(order.priorityLevel || "");

  return (
    <TabsContent value="services" className="space-y-6">
      <div className="bg-indigo-50 p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold text-indigo-800 mb-3 flex items-center gap-2">
          <Package size={18} />
          Thông tin dịch vụ
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">Loại dịch vụ</div>
            <div className="font-medium">{order.serviceType || "N/A"}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">ID Dịch vụ</div>
            <div className="font-medium">{order.serviceId}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Mức độ ưu tiên</div>
            <Badge className={priorityClass}>{order.priorityLevel || "Bình thường"}</Badge>
          </div>
          <div>
            <div className="text-sm text-gray-500">Khoảng cách</div>
            <div className="font-medium">{order.distanceToCustomer ? `${order.distanceToCustomer} km` : "N/A"}</div>
          </div>
        </div>
      </div>

      <div className="bg-orange-50 p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
          <Wrench size={18} />
          Dụng cụ vệ sinh
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">Yêu cầu dụng cụ</div>
            <div className="font-medium">{order.cleaningToolsRequired ? "Có" : "Không"}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Cung cấp dụng cụ</div>
            <div className="font-medium">{order.cleaningToolsProvided ? "Có" : "Không"}</div>
          </div>
        </div>
      </div>

      {order.cleaningAreas && order.cleaningAreas.length > 0 && (
        <div className="bg-teal-50 p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-teal-800 mb-3">Khu vực vệ sinh</h3>
          <div className="flex flex-wrap gap-2">
            {order.cleaningAreas.map((area: string, index: number) => (
              <Badge key={index} className="bg-teal-100 text-teal-800">{area}</Badge>
            ))}
          </div>
        </div>
      )}

      {order.itemsToClean && order.itemsToClean.length > 0 && (
        <div className="bg-cyan-50 p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-cyan-800 mb-3">Đồ cần vệ sinh</h3>
          <div className="flex flex-wrap gap-2">
            {order.itemsToClean.map((item: string, index: number) => (
              <Badge key={index} className="bg-cyan-100 text-cyan-800">{item}</Badge>
            ))}
          </div>
        </div>
      )}

      {order.extraServices && order.extraServices.length > 0 && (
        <div className="bg-pink-50 p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-pink-800 mb-3">Dịch vụ thêm</h3>
          <div className="flex flex-wrap gap-2">
            {order.extraServices.map((service: string, index: number) => (
              <Badge key={index} className="bg-pink-100 text-pink-800">{service}</Badge>
            ))}
          </div>
        </div>
      )}

      {order.options && order.options.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">Tùy chọn khác</h3>
          <div className="flex flex-wrap gap-2">
            {order.options.map((option: string, index: number) => (
              <Badge key={index} className="bg-gray-200 text-gray-800">{option}</Badge>
            ))}
          </div>
        </div>
      )}
    </TabsContent>
  );
};