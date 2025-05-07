"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { CheckCircle, XCircle, User, Clock, Calendar, Hash } from "lucide-react";
import { EmployeRealTimeStatus } from "@/apis/laudry/employee";

export const EmployeeColumns: ColumnDef<EmployeRealTimeStatus>[] = [
  {
    accessorKey: "staffName",
    header: "Họ và Tên",
    cell: ({ row }) => {
      const staffName = row.getValue("staffName") as string;
      return (
        <div className="flex items-center space-x-3 group">
          <div className="bg-blue-100 p-2 rounded-full transition-transform group-hover:scale-110">
            <User className="text-blue-600 h-5 w-5" />
          </div>
          <div className="relative">
            <span
              className="font-semibold text-gray-800 w-36 truncate cursor-pointer hover:text-blue-600 transition-colors"
              title={staffName}
            >
              {staffName || <span className="text-gray-400 italic">Chưa cập nhật</span>}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "staffCode",
    header: "Mã Nhân Viên",
    cell: ({ row }) => {
      const staffCode = row.getValue("staffCode") as string;
      return (
        <div className="flex items-center space-x-2 group">
          <Hash className="text-gray-600 h-5 w-5 transition-transform group-hover:scale-110" />
          <span className="text-gray-700 font-mono bg-gray-100 px-2 py-1 rounded-md hover:bg-gray-200 transition-colors">
            {staffCode || <span className="text-gray-400 italic">Chưa có mã</span>}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Trạng Thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      
      let statusDisplay;
      let statusIcon;
      let statusColorClass;
      
      switch(status) {
        case "Ready":
          statusDisplay = "Sẵn sàng";
          statusIcon = <CheckCircle className="text-green-600 h-5 w-5" />;
          statusColorClass = "bg-green-100 text-green-800";
          break;
        case "Working":
          statusDisplay = "Đang làm việc";
          statusIcon = <Clock className="h-4 w-4 text-blue-600 animate-spin" /> 
          statusColorClass = "bg-blue-100 text-blue-800";
          break;
        case "Unavailable":
          statusDisplay = "Không khả dụng";
          statusIcon = <XCircle className="text-red-600 h-5 w-5" />;
          statusColorClass = "bg-red-100 text-red-800";
          break;
        default:
          statusDisplay = status;
          statusIcon = <Clock className="text-gray-600 h-5 w-5" />;
          statusColorClass = "bg-gray-100 text-gray-800";
      }
      
      return (
        <div className="flex items-center space-x-2">
          {statusIcon}
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColorClass}`}
          >
            {statusDisplay}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "lastUpdated",
    header: "Cập Nhật Lần Cuối",
    cell: ({ row }) => {
      const lastUpdated = row.getValue("lastUpdated") as string;
      return (
        <div className="flex items-center space-x-2 group">
          <Calendar className="text-purple-600 h-5 w-5 transition-transform group-hover:scale-110" />
          <span className="text-gray-700 hover:text-purple-600 transition-colors">
            {lastUpdated
              ? new Date(lastUpdated).toLocaleString("vi-VN", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : <span className="text-gray-400 italic">Chưa xác định</span>}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Thao Tác",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <CellAction data={row.original} />
      </div>
    ),
  },
];