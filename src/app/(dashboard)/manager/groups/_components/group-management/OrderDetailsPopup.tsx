import { useState, useEffect } from "react";
import { Package, X, Loader2, AlertCircle, CheckCircle2, Clock, Filter, ArrowUpDown, CalendarDays, Info } from "lucide-react";
import { getOrderByStaffId } from "@/apis/staff";
import { TOrderResponse } from "@/schema/order.schema";

interface Staff {
  id: string;
  status: "Ready" | "Offline";
  lastUpdated: string;
  fullName: string;
  phoneNumber: string;
}

interface StaffOrdersPopupProps {
  staff: Staff;
  onClose: () => void;
}

interface OrderDetailsPopupProps {
  order: TOrderResponse;
  onClose: () => void;
}

const OrderDetailsPopup = ({ order, onClose }: OrderDetailsPopupProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <Info size={20} className="mr-2 text-blue-600" />
            Chi Tiết Đơn Hàng
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-600" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-blue-800">{order.code}</h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${
                  order.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {order.status === "Completed" ? (
                  <CheckCircle2 size={12} className="mr-1" />
                ) : (
                  <Clock size={12} className="mr-1" />
                )}
                {order.status === "Completed" ? "Hoàn Thành" : "Đang Chờ"}
              </span>
            </div>
            <div className="text-sm text-gray-600 flex items-center">
              <CalendarDays size={14} className="mr-1 text-blue-600" />
              {new Date(order.createdAt).toLocaleString("vi-VN")}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-xs font-medium text-gray-500 mb-1">Tổng Tiền</h4>
              <p className="text-lg font-semibold text-gray-800">{order.totalAmount.toLocaleString("vi-VN")} VND</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-xs font-medium text-gray-500 mb-1">Loại Dịch Vụ</h4>
              <p className="text-lg font-semibold text-gray-800">{order.serviceType || "Không xác định"}</p>
            </div>
          </div>
          {/* {order.description && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-xs font-medium text-gray-500 mb-1">Mô Tả</h4>
              <p className="text-sm text-gray-800">{order.description}</p>
            </div>
          )} */}
          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={onClose}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StaffOrdersPopup = ({ staff, onClose }: StaffOrdersPopupProps) => {
  const [orders, setOrders] = useState<TOrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<"createdAt" | "totalAmount">("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filterStatus, setFilterStatus] = useState<"All" | "Completed" | "Pending">("All");
  const [selectedOrder, setSelectedOrder] = useState<TOrderResponse | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await getOrderByStaffId(staff.id);
        if (response && response.payload && Array.isArray(response.payload)) {
          setOrders(response.payload);
        } else {
          setOrders([]);
        }
      } catch (err) {
        setError("Lỗi khi tải đơn hàng");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [staff.id]);

  const getSortedAndFilteredOrders = () => {
    let filteredOrders = [...orders];
    if (filterStatus !== "All") {
      filteredOrders = filteredOrders.filter(
        (order) => (filterStatus === "Completed" ? order.status === "Completed" : order.status !== "Completed")
      );
    }
    filteredOrders.sort((a, b) => {
      if (sortField === "createdAt") {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        return sortDirection === "asc" ? a.totalAmount - b.totalAmount : b.totalAmount - a.totalAmount;
      }
    });
    return filteredOrders;
  };

  const handleSort = (field: "createdAt" | "totalAmount") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedAndFilteredOrders = getSortedAndFilteredOrders();

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
        <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <Package size={20} className="mr-2 text-blue-600" />
              Đơn Hàng của {staff.fullName}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} className="text-gray-600" />
            </button>
          </div>
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <div className="flex flex-wrap gap-2 justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="text-sm font-medium text-gray-700 flex items-center">
                  <Filter size={14} className="mr-1" />
                  Lọc:
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as "All" | "Completed" | "Pending")}
                  className="text-sm border border-gray-200 rounded-md p-1 bg-white"
                >
                  <option value="All">Tất Cả</option>
                  <option value="Completed">Hoàn Thành</option>
                  <option value="Pending">Đang Chờ</option>
                </select>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleSort("createdAt")}
                  className={`flex items-center text-sm px-2 py-1 rounded-md border ${
                    sortField === "createdAt" ? "border-blue-200 bg-blue-50 text-blue-700" : "border-gray-200"
                  }`}
                >
                  <ArrowUpDown size={14} className="mr-1" />
                  Ngày Tạo {sortField === "createdAt" && (sortDirection === "asc" ? "↑" : "↓")}
                </button>
                <button
                  onClick={() => handleSort("totalAmount")}
                  className={`flex items-center text-sm px-2 py-1 rounded-md border ${
                    sortField === "totalAmount" ? "border-blue-200 bg-blue-50 text-blue-700" : "border-gray-200"
                  }`}
                >
                  <ArrowUpDown size={14} className="mr-1" />
                  Giá Trị {sortField === "totalAmount" && (sortDirection === "asc" ? "↑" : "↓")}
                </button>
              </div>
            </div>
          </div>
          <div className="p-4 flex-1 overflow-y-auto">
            {loading && (
              <div className="flex justify-center items-center py-8">
                <Loader2 size={24} className="animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Đang tải đơn hàng...</span>
              </div>
            )}
            {error && (
              <div className="flex items-center justify-center py-8 text-red-600">
                <AlertCircle size={20} className="mr-2" />
                {error}
              </div>
            )}
            {!loading && !error && sortedAndFilteredOrders.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <Package size={40} className="text-gray-300 mb-2" />
                <p className="font-medium">Không có đơn hàng nào</p>
                {filterStatus !== "All" && (
                  <p className="text-sm mt-2">Thử thay đổi bộ lọc để xem các đơn hàng khác</p>
                )}
              </div>
            )}
            {!loading && !error && sortedAndFilteredOrders.length > 0 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Hiển thị {sortedAndFilteredOrders.length} đơn hàng</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sortedAndFilteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-800">{order.code}</h3>
                          <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString("vi-VN")}</p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${
                            order.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status === "Completed" ? (
                            <CheckCircle2 size={12} className="mr-1" />
                          ) : (
                            <Clock size={12} className="mr-1" />
                          )}
                          {order.status === "Completed" ? "Hoàn Thành" : "Đang Chờ"}
                        </span>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-medium text-gray-600">Tổng Tiền</p>
                          <p className="text-sm text-gray-800">{order.totalAmount.toLocaleString("vi-VN")} VND</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-600">Loại Dịch Vụ</p>
                          <p className="text-sm text-gray-800">{order.serviceType || "Không xác định"}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {selectedOrder && <OrderDetailsPopup order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </>
  );
};

export default StaffOrdersPopup;