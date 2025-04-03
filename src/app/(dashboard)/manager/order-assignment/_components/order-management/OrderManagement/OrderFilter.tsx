/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw, Calendar, ArrowRightCircle } from "lucide-react";
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
  <div className="flex flex-col gap-2">
    <div className="flex items-center gap-2">
      <Tabs
        value={filterMode}
        onValueChange={(value) => setFilterMode(value as "single" | "range")}
        className="flex items-center"
      >
        <TabsList className="flex h-10 mb-0">
          <TabsTrigger value="single" className="px-3 py-1 text-sm">Một ngày</TabsTrigger>
          <TabsTrigger value="range" className="px-3 py-1 text-sm">Khoảng ngày</TabsTrigger>
        </TabsList>
        <TabsContent value="single" className="m-0">
          <div className="flex items-center ml-2">
            <Calendar className="mr-2 h-4 w-4 text-gray-600" />
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                handleDateChange(e);
                handleRefresh();
              }}
              className="w-40 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </TabsContent>
        <TabsContent value="range" className="m-0">
          <div className="flex items-center ml-2 gap-2">
            <div className="flex items-center">
              <Label htmlFor="fromDate" className="mr-1 text-sm">Từ:</Label>
              <Input
                id="fromDate"
                type="date"
                value={fromDate}
                onChange={(e) => {
                  handleFromDateChange(e);
                  handleRefresh();
                }}
                className="w-36 border-gray-300 rounded-md"
              />
            </div>
            <ArrowRightCircle className="h-4 w-4 text-gray-400" />
            <div className="flex items-center">
              <Label htmlFor="toDate" className="mr-1 text-sm">Đến:</Label>
              <Input
                id="toDate"
                type="date"
                value={toDate}
                onChange={(e) => {
                  handleToDateChange(e);
                  handleRefresh();
                }}
                className="w-36 border-gray-300 rounded-md"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
      <Button onClick={handleRefresh} variant="outline" className="ml-2 flex items-center px-2 py-1 text-sm">
        <RefreshCw className="mr-1 h-4 w-4" /> Làm mới
      </Button>
    </div>
  </div>
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
      <div className="flex flex-col items-start gap-2">
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
        <div className="flex justify-between w-full items-center">
          <span className="text-gray-600 font-medium text-sm">
            {filterMode === "single" ? `Đơn hàng ngày: ${dateDisplayText}` : `Đơn hàng từ ${dateDisplayText}`}
          </span>
          <span className="text-gray-600 text-sm">Hiển thị {filteredOrders.length} đơn hàng</span>
        </div>
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
          employeeRating: order.employeeRating ?? null,
          customerFeedback: order.customerFeedback ?? null,
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