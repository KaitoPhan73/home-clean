import React from "react";
import { Card } from "@/components/ui/card";
import { Bell } from "lucide-react";

const ProcessGuide: React.FC = () => {
  return (
    <Card className="p-4 bg-blue-50 border-blue-200 mt-0">
      <div className="flex items-start gap-3">
        <div className="bg-blue-100 rounded-full p-2">
          <Bell className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h4 className="font-medium text-blue-800">Hướng dẫn quy trình</h4>
          <ul className="mt-2 text-sm text-blue-700 space-y-1">
            <li className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              <span>Hoàn thành bước 1 để mở khóa bước 2</span>
            </li>
            <li className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              <span>Hoàn thành bước 2 để chờ thanh toán</span>
            </li>
            <li className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              <span>Thanh toán để mở khóa bước 3</span>
            </li>
            <li className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              <span>Hoàn thành tất cả các bước để hoàn tất đơn hàng</span>
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default ProcessGuide;