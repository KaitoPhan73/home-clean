"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/table/data-table";
import { columns } from "./columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FilterIcon, PlusIcon, RefreshCcw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePickerWithRange } from "@/app/(dashboard)/laundry/orders/_components/order-table/DatePickerWithRange";
import { TOrderLaundryResponse } from "@/schema/VinLaudry/laundry-order";

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
  onCreateOrder 
}: OrderTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  
  const uniqueTypes = Array.from(new Set(data.map(order => order.type))).filter(Boolean);

  const filteredOrders = data.filter((order) => {
    const matchesSearch =
      order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.type && order.type.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesType = typeFilter === "all" || order.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-xl font-bold">Quản lý đơn giặt ủi</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh}
              disabled={isLoading}
            >
              <RefreshCcw className="h-4 w-4 mr-1" />
              Làm mới
            </Button>
            <Button 
              size="sm" 
              onClick={onCreateOrder}
              disabled={isLoading}
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Tạo đơn mới
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Tất cả đơn</TabsTrigger>
            <TabsTrigger value="draft">Nháp</TabsTrigger>
            <TabsTrigger value="pending">Đang xử lý</TabsTrigger>
            <TabsTrigger value="completed">Hoàn thành</TabsTrigger>
            <TabsTrigger value="canceled">Đã hủy</TabsTrigger>
          </TabsList>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="w-full sm:w-64 relative">
              <Input
                placeholder="Tìm kiếm theo mã, tên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10"
              />
              {searchTerm && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                  onClick={() => setSearchTerm("")}
                >
                  ✕
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center"
              >
                <FilterIcon className="h-4 w-4 mr-1" />
                Bộ lọc
              </Button>
              
              <DatePickerWithRange className="w-auto" />
            </div>
          </div>
          
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Trạng thái</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Tất cả trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="Draft">Nháp</SelectItem>
                    <SelectItem value="Pending">Đang xử lý</SelectItem>
                    <SelectItem value="Completed">Hoàn thành</SelectItem>
                    <SelectItem value="Canceled">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Loại dịch vụ</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Tất cả loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {uniqueTypes.map(type => (
                      <SelectItem key={type} value={type as string}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setStatusFilter("all");
                    setTypeFilter("all");
                    setSearchTerm("");
                  }}
                  className="text-blue-600"
                >
                  Xóa bộ lọc
                </Button>
              </div>
            </div>
          )}
          
          <TabsContent value="all">
            <DataTable
              data={filteredOrders}
              columns={columns}
              totalItems={totalItems}
              // isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="draft">
            <DataTable
              data={filteredOrders.filter(order => order.status === "Draft")}
              columns={columns}
              totalItems={filteredOrders.filter(order => order.status === "Draft").length}
            //   isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="pending">
            <DataTable
              data={filteredOrders.filter(order => order.status === "Pending")}
              columns={columns}
              totalItems={filteredOrders.filter(order => order.status === "Pending").length}
            //   isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="completed">
            <DataTable
              data={filteredOrders.filter(order => order.status === "Completed")}
              columns={columns}
              totalItems={filteredOrders.filter(order => order.status === "Completed").length}
            //   isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="canceled">
            <DataTable
              data={filteredOrders.filter(order => order.status === "Canceled")}
              columns={columns}
              totalItems={filteredOrders.filter(order => order.status === "Canceled").length}
            //   isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
        
        {filteredOrders.length === 0 && !isLoading && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Không tìm thấy đơn hàng nào phù hợp với điều kiện tìm kiếm.</p>
            <Button 
              variant="link" 
              className="mt-2"
              onClick={() => {
                setStatusFilter("all");
                setTypeFilter("all");
                setSearchTerm("");
              }}
            >
              Xóa bộ lọc
            </Button>
          </div>
        )}
        
        {isLoading && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderTable;