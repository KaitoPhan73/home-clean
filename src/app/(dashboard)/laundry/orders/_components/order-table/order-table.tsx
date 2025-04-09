/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { laundryColumns } from "./columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCcw, Search, Layers, X, FileText, Clock, Loader2, CheckCircle, DollarSign, XCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePickerWithRange } from "@/app/(dashboard)/laundry/orders/_components/order-table/DatePickerWithRange";
import { TOrderLaundryResponse } from "@/schema/VinLaudry/laundry-order";
import { Badge } from "@/components/ui/badge";
import { DateRange } from "react-day-picker";
import { DataTableProps } from "@/app/(dashboard)/laundry/orders/_components/order-table/DataTable";
import { Button } from "@/components/ui/button";
import FilterBar from "@/app/(dashboard)/laundry/orders/_components/order-table/FilterBar";

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
}: OrderTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [filteredData, setFilteredData] = useState<TOrderLaundryResponse[]>(data);

  const getFilteredCounts = () => {
    const filtered = data.filter((order) => {
      const matchesSearch = !searchTerm
        ? true
        : order.orderCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (order.type &&
            order.type.toLowerCase().includes(searchTerm.toLowerCase()));

      let matchesDateRange = true;
      if (dateRange?.from && dateRange?.to) {
        const orderDate = order.orderDate ? new Date(order.orderDate) : null;
        if (orderDate) {
          matchesDateRange =
            orderDate >= dateRange.from &&
            orderDate <= (dateRange.to || new Date());
        }
      }

      return matchesSearch && matchesDateRange;
    });

    return {
      all: filtered.length,
      draft: filtered.filter((order) => order.status === "Draft").length,
      pendingPayment: filtered.filter((order) => order.status === "PendingPayment").length,
      processing: filtered.filter((order) => order.status === "Processing").length,
      completed: filtered.filter((order) => order.status === "Completed").length,
      cancelled: filtered.filter((order) => order.status === "Cancelled").length,
      paid: filtered.filter((order) => order.status === "Paid").length,
    };
  };

  useEffect(() => {
    const filtered = data.filter((order) => {
      const matchesSearch = !searchTerm
        ? true
        : order.orderCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (order.type &&
            order.type.toLowerCase().includes(searchTerm.toLowerCase()));

      let matchesStatus = true;
      if (activeTab !== "all") {
        const tabToStatus: Record<string, string> = {
          draft: "Draft",
          pendingPayment: "PendingPayment",
          processing: "Processing",
          completed: "Completed",
          cancelled: "Cancelled",
          paid: "Paid",
        };
        matchesStatus = order.status === tabToStatus[activeTab];
      }

      let matchesDateRange = true;
      if (dateRange?.from && dateRange?.to) {
        const orderDate = order.orderDate ? new Date(order.orderDate) : null;
        if (orderDate) {
          matchesDateRange =
            orderDate >= dateRange.from &&
            orderDate <= (dateRange.to || new Date());
        }
      }

      return matchesSearch && matchesStatus && matchesDateRange;
    });

    setFilteredData(filtered);
  }, [data, searchTerm, activeTab, dateRange]);

  const orderCounts = getFilteredCounts();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setDateRange(undefined);
  };

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  const hasFilters = searchTerm || (dateRange?.from && dateRange?.to);

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
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <FilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          dateRange={dateRange}
          onDateChange={handleDateChange}
          onClearFilters={handleClearFilters}
          isLoading={isLoading}
          onRefresh={onRefresh}
        />

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <div className="border-b border-gray-100">
            <TabsList className="h-auto p-0 bg-transparent border-b-0 w-full overflow-x-auto flex rounded-none">
              <TabsTrigger
                value="all"
                className="flex-1 rounded-none data-[state=active]:bg-blue-100 data-[state=active]:shadow-none py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
              >
                <Layers className="h-4 w-4 mr-2" />
                Tất cả đơn
                <Badge className="ml-2 bg-gray-100 text-gray-600 hover:bg-gray-100">
                  {orderCounts.all}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="draft"
                className="flex-1 rounded-none data-[state=active]:bg-yellow-100 data-[state=active]:shadow-none py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-yellow-600 data-[state=active]:text-yellow-600"
              >
                <FileText className="h-4 w-4 mr-2" />
                Nháp
                <Badge className="ml-2 bg-gray-100 text-gray-600 hover:bg-gray-100">
                  {orderCounts.draft}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="pendingPayment"
                className="flex-1 rounded-none data-[state=active]:bg-orange-100 data-[state=active]:shadow-none py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-orange-600 data-[state=active]:text-orange-600"
              >
                <Clock className="h-4 w-4 mr-2" />
                Chờ thanh toán
                <Badge className="ml-2 bg-gray-100 text-gray-600 hover:bg-gray-100">
                  {orderCounts.pendingPayment}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="processing"
                className="flex-1 rounded-none data-[state=active]:bg-purple-100 data-[state=active]:shadow-none py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600"
              >
                <Loader2 className="h-4 w-4 mr-2" />
                Đang xử lý
                <Badge className="ml-2 bg-gray-100 text-gray-600 hover:bg-gray-100">
                  {orderCounts.processing}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="flex-1 rounded-none data-[state=active]:bg-green-100 data-[state=active]:shadow-none py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-600"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Hoàn thành
                <Badge className="ml-2 bg-gray-100 text-gray-600 hover:bg-gray-100">
                  {orderCounts.completed}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="paid"
                className="flex-1 rounded-none data-[state=active]:bg-teal-100 data-[state=active]:shadow-none py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-teal-600 data-[state=active]:text-teal-600"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Đã thanh toán
                <Badge className="ml-2 bg-gray-100 text-gray-600 hover:bg-gray-100">
                  {orderCounts.paid}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="cancelled"
                className="flex-1 rounded-none data-[state=active]:bg-red-100 data-[state=active]:shadow-none py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-red-600 data-[state=active]:text-red-600"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Đã hủy
                <Badge className="ml-2 bg-gray-100 text-gray-600 hover:bg-gray-100">
                  {orderCounts.cancelled}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-0">
            <DataTableProps<TOrderLaundryResponse, unknown>
              columns={laundryColumns}
              data={filteredData}
              isLoading={isLoading}
              totalItems={filteredData.length}
            />

            {filteredData.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="bg-gray-100 rounded-full p-3 mb-4">
                  <Search className="h-6 w-6 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  Không tìm thấy dữ liệu
                </h3>
                <p className="text-gray-500 max-w-md mb-4">
                  {activeTab !== "all"
                    ? `Hiện không có đơn hàng nào ở trạng thái "${
                        activeTab === "draft"
                          ? "Nháp"
                          : activeTab === "pendingPayment"
                          ? "Chờ thanh toán"
                          : activeTab === "processing"
                          ? "Đang xử lý"
                          : activeTab === "completed"
                          ? "Hoàn thành"
                          : activeTab === "paid"
                          ? "Đã thanh toán"
                          : "Đã hủy"
                      }"`
                    : "Không tìm thấy đơn hàng nào phù hợp với các điều kiện tìm kiếm"}
                </p>
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  Xóa bộ lọc
                </Button>
              </div>
            )}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default OrderTable;