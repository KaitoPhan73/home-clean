/* eslint-disable @typescript-eslint/no-explicit-any */
// components/OrderDetailsPopup/OverviewTab.tsx
import { formatCurrency, formatDateTime } from "@/app/(dashboard)/manager/order-assignment/_components/order-management/OrderDetailsPopup/utils";
import { TabsContent } from "@/components/ui/tabs";
import { Clipboard, DollarSign, Tag, CheckCircle, User, Calendar } from "lucide-react";

interface OverviewTabProps {
  order: any;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ order }) => {
  const assignedStaffName = order.employeeId || "Chưa phân công";

  return (
    <TabsContent value="overview" className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Clipboard size={18} />
          Thông tin chính
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <User size={16} className="text-blue-600" />
            <div>
              <div className="text-sm text-gray-500">Khách hàng</div>
              <div className="font-medium">{order.userId || "N/A"}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <User size={16} className="text-green-600" />
            <div>
              <div className="text-sm text-gray-500">Nhân viên</div>
              <div className="font-medium">{assignedStaffName}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-purple-600" />
            <div>
              <div className="text-sm text-gray-500">Ngày tạo</div>
              <div className="font-medium">{formatDateTime(order.createdAt)}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-indigo-600" />
            <div>
              <div className="text-sm text-gray-500">Cập nhật</div>
              <div className="font-medium">{formatDateTime(order.updatedAt)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
          <DollarSign size={18} />
          Thông tin thanh toán
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">Giá gốc</div>
            <div className="font-medium">{formatCurrency(order.price)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Tổng thanh toán</div>
            <div className="font-bold text-lg text-green-700">{formatCurrency(order.totalAmount)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Mã giảm giá</div>
            <div className="font-medium">{order.discountCode || "Không có"}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Giảm giá</div>
            <div className="font-medium text-red-600">{formatCurrency(order.discountAmount)}</div>
          </div>
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

      {(order.customerFeedback || order.employeeRating) && (
        <div className="bg-purple-50 p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
            <CheckCircle size={18} />
            Đánh giá
          </h3>
          {order.customerFeedback && (
            <div className="mb-2">
              <div className="text-sm text-gray-500">Phản hồi khách hàng</div>
              <p className="text-gray-700">{order.customerFeedback}</p>
            </div>
          )}
          {order.employeeRating && (
            <div>
              <div className="text-sm text-gray-500">Đánh giá nhân viên</div>
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < order.employeeRating! ? "text-yellow-400" : "text-gray-300"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-gray-700 font-medium">{order.employeeRating}/5</span>
              </div>
            </div>
          )}
        </div>
      )}
    </TabsContent>
  );
};