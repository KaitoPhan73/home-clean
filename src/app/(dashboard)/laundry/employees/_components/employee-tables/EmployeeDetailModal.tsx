"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProgressEmployeeById, EmployeRealTimeStatus } from "@/apis/laudry/employee";
import { getOrderById } from "@/apis/laudry/order";
import { TProgressEmployeeResponse } from "@/schema/VinLaudry/employee.schema";
import { Calendar, Clock, FileText, AlertCircle, CheckCircle, User, Hash, Shield, Briefcase, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formattedDateTime } from "@/lib/formatter";
import { TOrderLaundryResponse } from "@/schema/VinLaudry/laundry-order";

interface EmployeeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: EmployeRealTimeStatus | null;
  accessToken?: string;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  isOpen,
  onClose,
  employee,
  accessToken,
}) => {
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<TProgressEmployeeResponse | null>(null);
  const [orderDetails, setOrderDetails] = useState<TOrderLaundryResponse | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(false);

  useEffect(() => {
    const fetchEmployeeTask = async () => {
      if (!employee?.id) return;
      
      setLoading(true);
      try {
        const response = await getProgressEmployeeById(employee.id);
        setActiveTask(response.payload);
        
        // If the task has an orderId, fetch the order details
        if (response.payload?.orderId) {
          setLoadingOrder(true);
          try {
            const orderData = await getOrderById(response.payload.orderId);
            setOrderDetails(orderData);
          } catch (orderError) {
            console.error("Error fetching order details:", orderError);
          } finally {
            setLoadingOrder(false);
          }
        }
      } catch (error) {
        console.error("Error fetching employee task:", error);
        setActiveTask(null);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && employee) {
      fetchEmployeeTask();
    } else {
      // Reset states when modal closes
      setActiveTask(null);
      setOrderDetails(null);
    }
  }, [isOpen, employee, accessToken]);

  // Get status display data
  const getStatusDisplay = (status: string | null) => {
    if (!status) return { label: "Không xác định", color: "bg-gray-100 text-gray-800", icon: <Clock className="h-4 w-4 text-gray-500" /> };
    
    switch(status) {
      case "Ready":
        return { 
          label: "Sẵn sàng", 
          color: "bg-green-100 text-green-800", 
          icon: <CheckCircle className="h-4 w-4 text-green-600" /> 
        };
      case "Working":
        return { 
          label: "Đang làm việc", 
          color: "bg-blue-100 text-blue-800",
          icon: <Clock className="h-4 w-4 text-blue-600 animate-spin" /> 
        };
      case "Unavailable":
        return { 
          label: "Không khả dụng", 
          color: "bg-red-100 text-red-800",
          icon: <AlertCircle className="h-4 w-4 text-red-600" /> 
        };
      case "InProgress":
        return { 
          label: "Đang tiến hành", 
          color: "bg-amber-100 text-amber-800",
          icon: <Clock className="h-4 w-4 text-amber-600" /> 
        };
      case "Completed":
        return { 
          label: "Hoàn thành", 
          color: "bg-green-100 text-green-800",
          icon: <CheckCircle className="h-4 w-4 text-green-600" /> 
        };
      default:
        return { 
          label: status, 
          color: "bg-gray-100 text-gray-800",
          icon: <FileText className="h-4 w-4 text-gray-600" /> 
        };
    }
  };

  // Get priority display
  const getPriorityDisplay = (priority: string | null) => {
    if (!priority) return { label: "Không xác định", color: "bg-gray-100 text-gray-800" };
    
    switch(priority) {
      case "1":
        return { label: "Cao", color: "bg-red-100 text-red-800" };
      case "2":
        return { label: "Trung bình", color: "bg-amber-100 text-amber-800" };
      case "3":
        return { label: "Thấp", color: "bg-blue-100 text-blue-800" };
      default:
        return { label: priority, color: "bg-gray-100 text-gray-800" };
    }
  };

  // Get order status display
  const getOrderStatusDisplay = (status: string | null) => {
    if (!status) return { label: "Không xác định", color: "bg-gray-100 text-gray-800" };
    
    switch(status) {
      case "Pending":
        return { label: "Chờ xử lý", color: "bg-amber-100 text-amber-800" };
      case "Processing":
        return { label: "Đang xử lý", color: "bg-blue-100 text-blue-800" };
      case "Completed":
        return { label: "Hoàn thành", color: "bg-green-100 text-green-800" };
      case "Cancelled":
        return { label: "Đã hủy", color: "bg-red-100 text-red-800" };
      case "Delivered":
        return { label: "Đã giao", color: "bg-purple-100 text-purple-800" };
      default:
        return { label: status, color: "bg-gray-100 text-gray-800" };
    }
  };

  // Check if the task is empty/null
  const isEmptyTask = !activeTask || 
    (activeTask.id === "00000000-0000-0000-0000-000000000000" && !activeTask.taskCode);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Chi tiết nhân viên
          </DialogTitle>
        </DialogHeader>

        {!employee ? (
          <div className="space-y-4 mt-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : (
          <>
            {/* Employee Basic Info Card */}
            <Card className="border-blue-100 shadow-sm bg-gradient-to-r from-blue-50 to-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User className="text-blue-600 h-5 w-5" />
                  </div>
                  {employee.staffName || "Chưa cập nhật tên"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Hash className="text-gray-600 h-4 w-4" />
                    <span className="text-sm font-medium">Mã nhân viên:</span>
                    <span className="text-sm font-mono bg-gray-100 px-2 py-0.5 rounded">
                      {employee.staffCode || "Chưa có mã"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="text-gray-600 h-4 w-4" />
                    <span className="text-sm font-medium">Trạng thái:</span>
                    <Badge 
                      className={`${getStatusDisplay(employee.status).color} text-xs`}
                      variant="outline"
                    >
                      <span className="flex items-center gap-1">
                        {getStatusDisplay(employee.status).icon}
                        {getStatusDisplay(employee.status).label}
                      </span>
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <Calendar className="text-purple-600 h-4 w-4" />
                    <span className="text-sm font-medium">Cập nhật lần cuối:</span>
                    <span className="text-sm text-gray-700">
                      {formattedDateTime(employee.lastUpdated)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Separator className="my-4" />

            {/* Tabs section */}
            <Tabs defaultValue="task" className="w-full">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="task" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Công việc hiện tại
                </TabsTrigger>
                <TabsTrigger value="order" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Thông tin đơn hàng
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="task" className="pt-4">
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                ) : isEmptyTask ? (
                  <Card className="border-dashed border-gray-300 bg-gray-50">
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <div className="bg-gray-100 p-3 rounded-full mb-3">
                        <FileText className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-center">
                        Nhân viên này hiện không tham gia công việc nào
                      </p>
                      <Button variant="outline" className="mt-4" disabled>
                        Giao việc mới
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Briefcase className="text-blue-600 h-5 w-5" />
                          {activeTask.taskName}
                        </CardTitle>
                        <Badge 
                          className={`${getStatusDisplay(activeTask.status).color}`}
                          variant="outline"
                        >
                          <span className="flex items-center gap-1">
                            {getStatusDisplay(activeTask.status).icon}
                            {getStatusDisplay(activeTask.status).label}
                          </span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                        <div>
                          <div className="text-sm font-medium text-gray-600">Mã công việc</div>
                          <div className="font-mono bg-gray-100 px-2 py-1 rounded text-sm inline-block mt-1">
                            {activeTask.taskCode}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-600">Độ ưu tiên</div>
                          <Badge 
                            className={`${getPriorityDisplay(activeTask.priority).color} mt-1`}
                            variant="outline"
                          >
                            {getPriorityDisplay(activeTask.priority).label}
                          </Badge>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-600">Thời gian bắt đầu</div>
                          <div className="text-sm mt-1 flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-gray-500" />
                            {formattedDateTime(activeTask.startDate)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-600">Dự kiến hoàn thành</div>
                          <div className="text-sm mt-1 flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-gray-500" />
                            {activeTask.dueDate ? formattedDateTime(activeTask.dueDate) : "Chưa xác định"}
                          </div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-sm font-medium text-gray-600">Người giao việc</div>
                          <div className="text-sm mt-1 flex items-center gap-1">
                            <User className="h-3 w-3 text-gray-500" />
                            {activeTask.managerName || "Chưa xác định"}
                          </div>
                        </div>
                        {activeTask.description && (
                          <div className="col-span-2">
                            <div className="text-sm font-medium text-gray-600">Mô tả</div>
                            <div className="text-sm mt-1 bg-gray-50 p-2 rounded-md">
                              {activeTask.description}
                            </div>
                          </div>
                        )}
                        {activeTask.notes && (
                          <div className="col-span-2">
                            <div className="text-sm font-medium text-gray-600">Ghi chú</div>
                            <div className="text-sm mt-1 bg-gray-50 p-2 rounded-md">
                              {activeTask.notes}
                            </div>
                          </div>
                        )}
                        {activeTask.orderId && (
                          <div className="col-span-2">
                            <div className="text-sm font-medium text-gray-600">Mã đơn hàng</div>
                            <div className="text-sm mt-1 flex items-center gap-1">
                              <Package className="h-3 w-3 text-gray-500" />
                              <div className="font-mono bg-blue-50 px-2 py-1 rounded text-sm">
                                {orderDetails?.orderCode || "Đang tải..."}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="order" className="pt-4">
                {isEmptyTask || !activeTask?.orderId ? (
                  <Card className="border-dashed border-gray-300 bg-gray-50">
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <div className="bg-gray-100 p-3 rounded-full mb-3">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-center">
                        Không có thông tin đơn hàng liên quan
                      </p>
                    </CardContent>
                  </Card>
                ) : loadingOrder ? (
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                ) : !orderDetails ? (
                  <Card className="border-dashed border-red-200 bg-red-50">
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <div className="bg-red-100 p-3 rounded-full mb-3">
                        <AlertCircle className="h-8 w-8 text-red-500" />
                      </div>
                      <p className="text-red-500 text-center">
                        Không thể tải thông tin đơn hàng
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Package className="text-purple-600 h-5 w-5" />
                          Đơn hàng #{orderDetails.orderCode}
                        </CardTitle>
                        <Badge 
                          className={`${getOrderStatusDisplay(orderDetails.status).color}`}
                          variant="outline"
                        >
                          {getOrderStatusDisplay(orderDetails.status).label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                        <div>
                          <div className="text-sm font-medium text-gray-600">Tên đơn hàng</div>
                          <div className="text-sm mt-1">
                            {orderDetails.name}
                          </div>
                        </div>
                        {/* <div>
                          <div className="text-sm font-medium text-gray-600">Loại đơn</div>
                          <div className="text-sm mt-1">
                            {orderDetails.type === "ByWeight" ? "Theo cân nặng" : 
                             orderDetails.type === "ByItem" ? "Theo món" : orderDetails.type}
                          </div>
                        </div> */}
                        <div>
                          <div className="text-sm font-medium text-gray-600">Ngày đặt hàng</div>
                          <div className="text-sm mt-1 flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-gray-500" />
                            {formattedDateTime(orderDetails.orderDate)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-600">Dự kiến giao hàng</div>
                          <div className="text-sm mt-1 flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-gray-500" />
                            {orderDetails.deliveryDate ? formattedDateTime(orderDetails.deliveryDate) : "Chưa xác định"}
                          </div>
                        </div>
                        {/* <div>
                          <div className="text-sm font-medium text-gray-600">Tổng tiền</div>
                          <div className="text-sm mt-1 font-semibold text-green-700">
                            {orderDetails.totalAmount?.toLocaleString('vi-VN')} {orderDetails.balance || 'Point'}
                          </div>
                        </div> */}
                        {/* <div>
                          <div className="text-sm font-medium text-gray-600">Giảm giá</div>
                          <div className="text-sm mt-1 text-red-600">
                            {orderDetails.discountAmount ? `-${orderDetails.discountAmount.toLocaleString('vi-VN')}` : '0'} {orderDetails.currency || 'VND'}
                          </div>
                        </div> */}
                        
                        {orderDetails.estimatedCompletionTime && (
                          <div className="col-span-2">
                            <div className="text-sm font-medium text-gray-600">Dự kiến hoàn thành</div>
                            <div className="text-sm mt-1 flex items-center gap-1">
                              <Clock className="h-3 w-3 text-gray-500" />
                              {formattedDateTime(orderDetails.estimatedCompletionTime)}
                            </div>
                          </div>
                        )}
                        
                        {/* Display by-item details if available */}
                        {orderDetails.orderDetailsByItem && orderDetails.orderDetailsByItem.length > 0 && (
                          <div className="col-span-2 mt-2">
                            <div className="text-sm font-medium text-gray-600 mb-2">Chi tiết theo món</div>
                            <div className="bg-gray-50 p-3 rounded-md">
                              <div className="grid grid-cols-3 gap-2 text-xs font-medium text-gray-500 pb-1 border-b border-gray-200">
                                <div>Tên món</div>
                                <div>Số lượng</div>
                                <div>Thành tiền</div>
                              </div>
                              {orderDetails.orderDetailsByItem.map((item, index) => (
                                <div key={item.id} className={`grid grid-cols-3 gap-2 text-sm py-2 ${index !== orderDetails.orderDetailsByItem.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                  <div className="font-medium text-gray-700">{item.itemTypeResponse.name}</div>
                                  <div>{item.quantity} món</div>
                                  <div>{item.subtotal.toLocaleString('vi-VN')} {orderDetails.currency || 'VND'}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Display by-kg details if available */}
                        {orderDetails.orderDetailsByKg && orderDetails.orderDetailsByKg.length > 0 && (
                          <div className="col-span-2 mt-2">
                            <div className="text-sm font-medium text-gray-600 mb-2">Chi tiết theo cân nặng</div>
                            <div className="bg-gray-50 p-3 rounded-md">
                              <div className="grid grid-cols-3 gap-2 text-xs font-medium text-gray-500 pb-1 border-b border-gray-200">
                                <div>Loại</div>
                                <div>Cân nặng</div>
                                <div>Thành tiền</div>
                              </div>
                              {orderDetails.orderDetailsByKg.map((item, index) => (
                                <div key={item.id} className={`grid grid-cols-3 gap-2 text-sm py-2 ${index !== orderDetails.orderDetailsByKg.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                  <div className="font-medium text-gray-700">{item.itemTypeResponse?.name || "Không có thông tin"}</div>
                                  <div>{item.weight} kg</div>
                                  <div>{item.subtotal?.toLocaleString('vi-VN') || "0"} {orderDetails.currency || 'VND'}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Display additional services if available */}
                        {orderDetails.orderAdditionalServicesResponse && orderDetails.orderAdditionalServicesResponse.length > 0 && (
                          <div className="col-span-2 mt-2">
                            <div className="text-sm font-medium text-gray-600 mb-2">Dịch vụ bổ sung</div>
                            <div className="bg-gray-50 p-3 rounded-md">
                              <div className="grid grid-cols-2 gap-2 text-xs font-medium text-gray-500 pb-1 border-b border-gray-200">
                                <div>Dịch vụ</div>
                                <div>Giá</div>
                              </div>
                              {orderDetails.orderAdditionalServicesResponse.map((service, index) => (
                                <div key={service.id} className={`grid grid-cols-2 gap-2 text-sm py-2 ${index !== orderDetails.orderAdditionalServicesResponse.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                  <div className="font-medium text-gray-700">{service.name}</div>
                                  <div>{service.price.toLocaleString('vi-VN')} {orderDetails.currency || 'VND'}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>

            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={onClose}>
                Đóng
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};