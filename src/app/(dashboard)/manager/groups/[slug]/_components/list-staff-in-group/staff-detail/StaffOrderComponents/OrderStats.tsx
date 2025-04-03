import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

export interface StatsData {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  cancelled: number;
  accepted: number;
}

interface OrderStatsProps {
  stats: StatsData;
}

const OrderStats: React.FC<OrderStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center">
          <CardTitle className="text-2xl font-bold">{stats.total}</CardTitle>
          <CardDescription>Tổng số đơn</CardDescription>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center">
          <CardTitle className="text-2xl font-bold text-green-600">{stats.completed}</CardTitle>
          <CardDescription>Hoàn thành</CardDescription>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center">
          <CardTitle className="text-2xl font-bold text-blue-600">{stats.inProgress}</CardTitle>
          <CardDescription>Đang xử lý</CardDescription>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center">
          <CardTitle className="text-2xl font-bold text-yellow-600">{stats.pending}</CardTitle>
          <CardDescription>Chờ xử lý</CardDescription>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center">
          <CardTitle className="text-2xl font-bold text-red-600">{stats.cancelled}</CardTitle>
          <CardDescription>Đã hủy</CardDescription>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderStats;