/* eslint-disable @typescript-eslint/no-explicit-any */
// components/StaffAssignBoard.tsx
"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw, Calendar, ArrowRightCircle, Search } from "lucide-react";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useStaffAssignBoard } from "@/hooks/useStaffAssignBoard";
import { TaskBoard } from "@/app/(dashboard)/manager/order-assignment/_components/order-management/OrderManagement/TaskBoard";

const DateFilter = ({
  filterMode,
  setFilterMode,
  selectedDate,
  fromDate,
  toDate,
  handleDateChange,
  handleFromDateChange,
  handleToDateChange,
  handleRefresh,
}: any) => (
  <Tabs
    value={filterMode}
    onValueChange={(value) => setFilterMode(value as "single" | "range")}
    className="w-full"
  >
    <TabsList className="grid grid-cols-2 mb-4 w-64">
      <TabsTrigger value="single">Một ngày</TabsTrigger>
      <TabsTrigger value="range">Khoảng ngày</TabsTrigger>
    </TabsList>
    <TabsContent value="single" className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4 text-gray-600" />
          <Input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="w-30 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          className="flex items-center"
        >
          <Search className="mr-2 h-4 w-4" /> Tìm Kiếm
        </Button>
      </div>
    </TabsContent>
    <TabsContent value="range" className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          <Label htmlFor="fromDate" className="mr-2">Từ:</Label>
          <Input
            id="fromDate"
            type="date"
            value={fromDate}
            onChange={handleFromDateChange}
            className="border-gray-300 rounded-md"
          />
        </div>
        <ArrowRightCircle className="h-4 w-4 text-gray-400" />
        <div className="flex items-center">
          <Label htmlFor="toDate" className="mr-2">Đến:</Label>
          <Input
            id="toDate"
            type="date"
            value={toDate}
            onChange={handleToDateChange}
            className="border-gray-300 rounded-md"
          />
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          className="flex items-center"
        >
          <Search className="mr-2 h-4 w-4" /> Tìm Kiếm
        </Button>
      </div>
    </TabsContent>
  </Tabs>
);

const StaffAssignBoard = () => {
  const {
    filteredOrders,
    isLoading,
    error,
    groupId,
    filterMode,
    setFilterMode,
    selectedDate,
    fromDate,
    toDate,
    handleRefresh,
    handleDateChange,
    handleFromDateChange,
    handleToDateChange,
  } = useStaffAssignBoard();

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin h-10 w-10 text-blue-500 mx-auto" />
          <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-700 font-bold">Đã xảy ra lỗi khi tải dữ liệu đơn hàng</h3>
        <p className="text-red-600">{error}</p>
        <Button onClick={handleRefresh} className="mt-4">
          <RefreshCw className="mr-2 h-4 w-4" /> Thử lại
        </Button>
      </div>
    );
  }

  const dateDisplayText =
    filterMode === "single"
      ? format(parseISO(selectedDate), "EEEE, dd/MM/yyyy", { locale: vi })
      : `${format(parseISO(fromDate), "dd/MM/yyyy", { locale: vi })} đến ${format(
          parseISO(toDate),
          "dd/MM/yyyy",
          { locale: vi }
        )}`;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
        <Button onClick={handleRefresh} variant="outline" className="flex items-center">
          <RefreshCw className="mr-2 h-4 w-4" /> Làm mới
        </Button>
      </div>

      <DateFilter
        filterMode={filterMode}
        setFilterMode={setFilterMode}
        selectedDate={selectedDate}
        fromDate={fromDate}
        toDate={toDate}
        handleDateChange={handleDateChange}
        handleFromDateChange={handleFromDateChange}
        handleToDateChange={handleToDateChange}
        handleRefresh={handleRefresh}
      />

      <div className="flex justify-between items-center">
        <span className="text-gray-600 font-medium">
          {filterMode === "single" ? `Đơn hàng ngày: ${dateDisplayText}` : `Đơn hàng từ ${dateDisplayText}`}
        </span>
        <span className="text-gray-600">Hiển thị {filteredOrders.length} đơn hàng</span>
      </div>

      <TaskBoard
        orders={filteredOrders.map((order) => ({
          status: order.status,
          options: Array.isArray(order.options) ? order.options.map(String) : [],
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          code: order.code,
          id: order.id,
          note: order.note,
          price: order.price,
          address: order.address,
          bookingDate: order.bookingDate,
          employeeId: order.employeeId,
          employeeRating: order.employeeRating ?? null, // Đảm bảo không undefined
          customerFeedback: order.customerFeedback ?? null, // Thêm giá trị mặc định
          cleaningToolsRequired: order.cleaningToolsRequired,
          cleaningToolsProvided: order.cleaningToolsProvided,
          serviceType: order.serviceType,
          distanceToCustomer: order.distanceToCustomer,
          priorityLevel: order.priorityLevel,
          notes: order.notes,
          discountCode: order.discountCode,
          discountAmount: order.discountAmount,
          totalAmount: order.totalAmount,
          realTimeStatus: order.realTimeStatus,
          jobStartTime: order.jobStartTime,
          jobEndTime: order.jobEndTime,
          emergencyRequest: order.emergencyRequest,
          cleaningAreas: Array.isArray(order.cleaningAreas)
            ? order.cleaningAreas.map(String)
            : [],
          itemsToClean: Array.isArray(order.itemsToClean)
            ? order.itemsToClean.map(String)
            : [],
          estimatedArrivalTime: order.estimatedArrivalTime,
          estimatedDuration: order.estimatedDuration,
          actualDuration: order.actualDuration,
          cancellationDeadline: order.cancellationDeadline,
          timeSlotId: order.timeSlotId,
          serviceId: order.serviceId,
          userId: order.userId,
          extraServices: Array.isArray(order.extraServices)
            ? order.extraServices.map(String)
            : [],
        }))}
        groupId={groupId || undefined}
      />
    </div>
  );
};

export default StaffAssignBoard;