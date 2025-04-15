/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { TOrderLaundryResponse } from "@/schema/VinLaudry/laundry-order";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Clock, 
  Package, 
  Tag, 
  User, 
  Weight,
  ShoppingBag,
  ArrowLeft,
  Printer,
  FileText,
  CreditCard,
  Truck,
  AlertCircle
} from "lucide-react";

interface FormLaundryOrderDetailProps {
  initialData: TOrderLaundryResponse;
}

const FormLaundryOrderDetail: React.FC<FormLaundryOrderDetailProps> = ({ initialData }) => {
  const router = useRouter();
  const order = initialData;

  // Format currency with Vietnamese formatting
  const formatCurrency = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) return "0 ₫";
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  // Get status badge with appropriate styling
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "outline" | "secondary" | "destructive" | "success" }> = {
      Draft: { label: "Nháp", variant: "outline" },
      Paid: { label: "Đã thanh toán", variant: "success" },
      Completed: { label: "Hoàn thành", variant: "secondary" },
      Processing: { label: "Đang xử lý", variant: "default" },
      PendingPayment: { label: "Chờ thanh toán", variant: "destructive" },
    };
    
    const statusInfo = statusMap[status] || { label: status, variant: "outline" };
    
    return (
      <Badge variant={statusInfo.variant as any}>
        {statusInfo.label}
      </Badge>
    );
  };

  // Calculate totals
  const itemTotal = order.orderDetailsByItem?.reduce((sum, item) => sum + (item.subtotal || 0), 0) || 0;
  const kgTotal = order.orderDetailsByKg?.reduce((sum, item) => sum + (item.subtotal || 0), 0) || 0;
  const additionalServicesTotal = order.orderAdditionalServicesResponse?.reduce((sum, service) => sum + service.price, 0) || 0;
  
  const subtotal = itemTotal + kgTotal + additionalServicesTotal;
  const discount = order.discountAmount || 0;
  const total = (order.totalAmount != null) ? order.totalAmount : subtotal - discount;

  // Format date helper
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Chưa xác định";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header section with back button and action buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Chi tiết đơn hàng</h2>
            <div className="flex items-center gap-2 mt-1">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{order.orderCode}</span>
              {getStatusBadge(order.status)}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            In đơn hàng
          </Button>
          <Button variant="default" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Xuất hóa đơn
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main order details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order information card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Thông tin đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-sm font-medium">Ngày đặt:</span>
                      <p className="text-sm">{formatDate(order.orderDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-sm font-medium">Ngày giao dự kiến:</span>
                      <p className="text-sm">{formatDate(order.deliveryDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-sm font-medium">Trạng thái:</span>
                      <p className="text-sm">{order.status}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-sm font-medium">ID khách hàng:</span>
                      <p className="text-sm">{order.userId}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-sm font-medium">Loại đơn:</span>
                      <p className="text-sm">{order.type}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-sm font-medium">Hoàn thành dự kiến:</span>
                      <p className="text-sm">{formatDate(order.estimatedCompletionTime)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order items section - display only if there are items */}
          {order.orderDetailsByItem && order.orderDetailsByItem.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Danh sách đồ giặt theo món
                </CardTitle>
                <CardDescription>
                  Tổng cộng {order.orderDetailsByItem.length} món đồ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tên sản phẩm</TableHead>
                        <TableHead>Số lượng</TableHead>
                        <TableHead>Đơn giá</TableHead>
                        <TableHead>Thành tiền</TableHead>
                        <TableHead>Ghi chú</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.orderDetailsByItem.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.itemTypeResponse.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                          <TableCell className="font-medium">{formatCurrency(item.subtotal)}</TableCell>
                          <TableCell>{item.notes || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <div className="text-right">
                  <span className="text-sm text-muted-foreground">Tổng cộng theo món:</span>
                  <p className="text-base font-medium">{formatCurrency(itemTotal)}</p>
                </div>
              </CardFooter>
            </Card>
          )}

          {/* Order by kg section - display only if there are kg items */}
          {order.orderDetailsByKg && order.orderDetailsByKg.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Weight className="h-5 w-5" />
                  Danh sách đồ giặt theo kg
                </CardTitle>
                <CardDescription>
                  Tổng cộng {order.orderDetailsByKg.reduce((sum, item) => sum + (item.weight || 0), 0)} kg đồ giặt
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Loại đồ</TableHead>
                        <TableHead>Khối lượng (kg)</TableHead>
                        <TableHead>Thực tế (kg)</TableHead>
                        <TableHead>Đơn giá</TableHead>
                        <TableHead>Thành tiền</TableHead>
                        <TableHead>Ghi chú</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.orderDetailsByKg.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.itemTypeResponse?.name || 'Chưa xác định'}
                          </TableCell>
                          <TableCell>{item.weight}</TableCell>
                          <TableCell>{item.actualWeight || "-"}</TableCell>
                          <TableCell>{formatCurrency(item.itemTypeResponse?.pricePerKg || 0)}</TableCell>
                          <TableCell className="font-medium">{formatCurrency(item.subtotal || 0)}</TableCell>
                          <TableCell>{item.notes || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <div className="text-right">
                  <span className="text-sm text-muted-foreground">Tổng cộng theo kg:</span>
                  <p className="text-base font-medium">{formatCurrency(kgTotal)}</p>
                </div>
              </CardFooter>
            </Card>
          )}

          {/* Additional services section - display only if there are services */}
          {order.orderAdditionalServicesResponse && order.orderAdditionalServicesResponse.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Dịch vụ thêm
                </CardTitle>
                <CardDescription>
                  {order.orderAdditionalServicesResponse.length} dịch vụ bổ sung
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Dịch vụ</TableHead>
                        <TableHead>Mô tả</TableHead>
                        <TableHead>Giá</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.orderAdditionalServicesResponse.map((service) => (
                        <TableRow key={service.id}>
                          <TableCell className="font-medium">{service.name}</TableCell>
                          <TableCell>{service.description}</TableCell>
                          <TableCell>{formatCurrency(service.price)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <div className="text-right">
                  <span className="text-sm text-muted-foreground">Tổng phụ phí:</span>
                  <p className="text-base font-medium">{formatCurrency(additionalServicesTotal)}</p>
                </div>
              </CardFooter>
            </Card>
          )}
        </div>

        {/* Summary card */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Order summary */}
            <Card className="top-4">
              <CardHeader>
                <CardTitle>Tổng quan đơn hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.orderDetailsByItem && order.orderDetailsByItem.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Tổng tiền theo món</span>
                      <span className="font-medium">{formatCurrency(itemTotal)}</span>
                    </div>
                  )}
                  
                  {order.orderDetailsByKg && order.orderDetailsByKg.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Tổng tiền theo kg</span>
                      <span className="font-medium">{formatCurrency(kgTotal)}</span>
                    </div>
                  )}
                  
                  {order.orderAdditionalServicesResponse && order.orderAdditionalServicesResponse.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Dịch vụ bổ sung</span>
                      <span className="font-medium">{formatCurrency(additionalServicesTotal)}</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Tổng tiền hàng</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Giảm giá</span>
                    <span className="font-medium">{formatCurrency(discount)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between">
                    <span className="font-medium">Tổng thanh toán</span>
                    <span className="text-lg font-bold">{formatCurrency(total)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button className="w-full" disabled={order.status === "Completed"}>
                  {order.status === "Draft" 
                    ? "Xác nhận đơn hàng" 
                    : order.status === "PendingPayment" 
                      ? "Xác nhận thanh toán" 
                      : order.status === "Processing" 
                        ? "Hoàn thành đơn" 
                        : order.status === "Completed" 
                          ? "Đã hoàn thành" 
                          : "Cập nhật trạng thái"}
                </Button>
                {order.status !== "Completed" && order.status !== "Draft" && (
                  <Button variant="outline" className="w-full">
                    Chỉnh sửa đơn hàng
                  </Button>
                )}
              </CardFooter>
            </Card>
            
            {/* Order tracking status card */}
            <Card>
              <CardHeader>
                <CardTitle>Trạng thái đơn hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Package className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Đơn hàng tạo</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${order.status !== "Draft" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Thanh toán</p>
                      <p className="text-sm text-muted-foreground">
                        {order.status !== "Draft" ? "Đã xác nhận" : "Đang chờ"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${order.status === "Processing" || order.status === "Completed" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      <Weight className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Đang xử lý</p>
                      <p className="text-sm text-muted-foreground">
                        {order.status === "Processing" || order.status === "Completed" ? "Đang tiến hành" : "Chưa bắt đầu"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${order.status === "Completed" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      <Truck className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Hoàn thành</p>
                      <p className="text-sm text-muted-foreground">
                        {order.status === "Completed" ? "Đã hoàn thành" : "Đang chờ"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormLaundryOrderDetail;