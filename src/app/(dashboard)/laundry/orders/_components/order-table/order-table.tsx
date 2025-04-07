"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/table/data-table";
import { laundryColumns } from "./columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  FilterX,
  FilterIcon,
  PlusIcon,
  RefreshCcw,
  Search,
  Layers,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePickerWithRange } from "@/app/(dashboard)/laundry/orders/_components/order-table/DatePickerWithRange";
import { TOrderLaundryResponse } from "@/schema/VinLaudry/laundry-order";
import { Badge } from "@/components/ui/badge";

// Enum cho trạng thái đơn hàng
enum OrderStatusEnum {
  Draft = 0,
  PendingPayment = 1,
  Processing = 2,
  Completed = 3,
  Cancelled = 4,
  Paid = 5,
}

interface OrderTableProps {
  data: TOrderLaundryResponse[];
  totalItems: number;
  isLoading?: boolean;
  onRefresh?: () => void;
  onCreateOrder?: () => void;
}

const OrderTable = ({
  data,
  totalItems,
  isLoading = false,
  onRefresh,
  onCreateOrder,
}: OrderTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const uniqueTypes = Array.from(
    new Set(data.map((order) => order.type))
  ).filter(Boolean);

  // Đếm số lượng đơn hàng theo trạng thái
  const orderCounts = {
    all: data.length,
    [OrderStatusEnum.Draft]: data.filter(
      (order) => Number(order.status) === OrderStatusEnum.Draft
    ).length,
    [OrderStatusEnum.PendingPayment]: data.filter(
      (order) => Number(order.status) === OrderStatusEnum.PendingPayment
    ).length,
    [OrderStatusEnum.Processing]: data.filter(
      (order) => Number(order.status) === OrderStatusEnum.Processing
    ).length,
    [OrderStatusEnum.Completed]: data.filter(
      (order) => Number(order.status) === OrderStatusEnum.Completed
    ).length,
    [OrderStatusEnum.Cancelled]: data.filter(
      (order) => Number(order.status) === OrderStatusEnum.Cancelled
    ).length,
    [OrderStatusEnum.Paid]: data.filter(
      (order) => Number(order.status) === OrderStatusEnum.Paid
    ).length,
  };

  // Trong hàm filteredOrders
const filteredOrders = data.filter((order) => {
  const matchesSearch =
    order.orderCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.type &&
      order.type.toLowerCase().includes(searchTerm.toLowerCase()));

  // Kiểm tra kỹ kiểu dữ liệu
  const orderStatus = Number(order.status);
  const filterStatus = statusFilter === "all" ? -1 : Number(statusFilter);
  
  const matchesStatus = statusFilter === "all" || orderStatus === filterStatus;
  const matchesType = typeFilter === "all" || order.type === typeFilter;

  return matchesSearch && matchesStatus && matchesType;
});

  const hasFilters =
    searchTerm || statusFilter !== "all" || typeFilter !== "all";

  return (
    <Card className="shadow-lg border-gray-100 overflow-hidden">
      <CardHeader className="bg-white border-b border-gray-100 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Layers className="h-6 w-6 text-blue-600" />
            <CardTitle className="text-xl font-bold">
              Quản lý đơn giặt ủi
            </CardTitle>
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-600 border-blue-200"
            >
              {totalItems} đơn hàng
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="hover:bg-slate-50"
            >
              <RefreshCcw className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Làm mới</span>
            </Button>
            <Button
              size="sm"
              onClick={onCreateOrder}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Tạo đơn mới</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="all" className="w-full">
          <div className="border-b border-gray-100">
            <TabsList className="h-auto p-0 bg-transparent border-b-0 w-full overflow-x-auto flex rounded-none">
              <TabsTrigger
                value="all"
                className="flex-1 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
              >
                Tất cả đơn
                <Badge className="ml-2 bg-gray-100 text-gray-600 hover:bg-gray-100">
                  {orderCounts.all}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="draft"
                onClick={() => setStatusFilter(OrderStatusEnum.Draft.toString())}
                className="flex-1 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
              >
                Nháp
                <Badge className="ml-2 bg-gray-100 text-gray-600 hover:bg-gray-100">
                  {orderCounts[OrderStatusEnum.Draft]}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="pendingPayment"
                onClick={() => setStatusFilter(OrderStatusEnum.PendingPayment.toString())}
                className="flex-1 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
              >
                Chờ thanh toán
                <Badge className="ml-2 bg-gray-100 text-gray-600 hover:bg-gray-100">
                  {orderCounts[OrderStatusEnum.PendingPayment]}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="processing"
                className="flex-1 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
              >
                Đang xử lý
                <Badge className="ml-2 bg-gray-100 text-gray-600 hover:bg-gray-100">
                  {orderCounts[OrderStatusEnum.Processing]}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="flex-1 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
              >
                Hoàn thành
                <Badge className="ml-2 bg-gray-100 text-gray-600 hover:bg-gray-100">
                  {orderCounts[OrderStatusEnum.Completed]}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="paid"
                className="flex-1 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
              >
                Đã thanh toán
                <Badge className="ml-2 bg-gray-100 text-gray-600 hover:bg-gray-100">
                  {orderCounts[OrderStatusEnum.Paid]}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="cancelled"
                className="flex-1 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
              >
                Đã hủy
                <Badge className="ml-2 bg-gray-100 text-gray-600 hover:bg-gray-100">
                  {orderCounts[OrderStatusEnum.Cancelled]}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="w-full sm:w-64 lg:w-96 relative">
                <Input
                  placeholder="Tìm kiếm đơn hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-10 bg-white border-gray-200 focus:border-blue-300"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 hover:bg-gray-100"
                    onClick={() => setSearchTerm("")}
                  >
                    ✕
                  </Button>
                )}
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant={showFilters ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center ${
                    showFilters
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : ""
                  }`}
                >
                  <FilterIcon className="h-4 w-4 mr-1" />
                  <span>Bộ lọc</span>
                  {hasFilters && (
                    <Badge className="ml-1 bg-blue-600 text-white">
                      {(searchTerm ? 1 : 0) +
                        (statusFilter !== "all" ? 1 : 0) +
                        (typeFilter !== "all" ? 1 : 0)}
                    </Badge>
                  )}
                </Button>

                <DatePickerWithRange className="w-auto" />

                {hasFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setStatusFilter("all");
                      setTypeFilter("all");
                      setSearchTerm("");
                    }}
                    className="flex items-center text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                  >
                    <FilterX className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Xóa bộ lọc</span>
                  </Button>
                )}
              </div>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-white rounded-lg mt-4 border border-gray-200 shadow-sm">
                <div>
                  <label className="text-sm font-medium mb-1 block text-gray-700">
                    Trạng thái đơn hàng
                  </label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Tất cả trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả trạng thái</SelectItem>
                      <SelectItem value={OrderStatusEnum.Draft.toString()}>
                        Nháp
                      </SelectItem>
                      <SelectItem
                        value={OrderStatusEnum.PendingPayment.toString()}
                      >
                        Chờ thanh toán
                      </SelectItem>
                      <SelectItem value={OrderStatusEnum.Processing.toString()}>
                        Đang xử lý
                      </SelectItem>
                      <SelectItem value={OrderStatusEnum.Completed.toString()}>
                        Hoàn thành
                      </SelectItem>
                      <SelectItem value={OrderStatusEnum.Paid.toString()}>
                        Đã thanh toán
                      </SelectItem>
                      <SelectItem value={OrderStatusEnum.Cancelled.toString()}>
                        Đã hủy
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block text-gray-700">
                    Loại dịch vụ
                  </label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Tất cả loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả loại</SelectItem>
                      {uniqueTypes.map((type) => (
                        <SelectItem key={type} value={type as string}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          <TabsContent value="all" className="mt-0">
            <DataTable<TOrderLaundryResponse, unknown>
              columns={laundryColumns}
              data={filteredOrders}
              isLoading={isLoading}
              totalItems={0}
            />
          </TabsContent>

          <TabsContent value="draft" className="mt-0">
            <DataTable<TOrderLaundryResponse, unknown>
              columns={laundryColumns}
              data={filteredOrders.filter(
                (order) => Number(order.status) === OrderStatusEnum.Draft
              )}
              isLoading={isLoading}
              totalItems={0}
            />
          </TabsContent>

          <TabsContent value="pendingPayment" className="mt-0">
            <DataTable<TOrderLaundryResponse, unknown>
              columns={laundryColumns}
              data={filteredOrders.filter(
                (order) =>
                  Number(order.status) === OrderStatusEnum.PendingPayment
              )}
              isLoading={isLoading}
              totalItems={0}
            />
          </TabsContent>

          <TabsContent value="processing" className="mt-0">
            <DataTable<TOrderLaundryResponse, unknown>
              columns={laundryColumns}
              data={filteredOrders.filter(
                (order) => Number(order.status) === OrderStatusEnum.Processing
              )}
              isLoading={isLoading}
              totalItems={0}
            />
          </TabsContent>

          <TabsContent value="completed" className="mt-0">
            <DataTable<TOrderLaundryResponse, unknown>
              columns={laundryColumns}
              data={filteredOrders.filter(
                (order) => Number(order.status) === OrderStatusEnum.Completed
              )}
              isLoading={isLoading}
              totalItems={0}
            />
          </TabsContent>

          <TabsContent value="paid" className="mt-0">
            <DataTable<TOrderLaundryResponse, unknown>
              columns={laundryColumns}
              data={filteredOrders.filter(
                (order) => Number(order.status) === OrderStatusEnum.Paid
              )}
              isLoading={isLoading}
              totalItems={0}
            />
          </TabsContent>

          <TabsContent value="cancelled" className="mt-0">
            <DataTable<TOrderLaundryResponse, unknown>
              columns={laundryColumns}
              data={filteredOrders.filter(
                (order) => Number(order.status) === OrderStatusEnum.Cancelled
              )}
              isLoading={isLoading}
              totalItems={0}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default OrderTable;
