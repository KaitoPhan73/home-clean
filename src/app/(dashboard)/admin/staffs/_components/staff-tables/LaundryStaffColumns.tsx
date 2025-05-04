"use client"

import { ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle,
  XCircle,
  User,
  Hash,
  Clock,
  Calendar,
} from "lucide-react";
import React from "react";
import { TEmployeeLaundryResponse } from "@/schema/VinLaudry/employee.schema";

export const LaundryStaffColumns: ColumnDef<TEmployeeLaundryResponse>[] = [
  {
    accessorKey: "fullName",
    header: "Họ và Tên",
    cell: ({ row }) => {
      const fullName = row.getValue("fullName") as string;
      return (
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <User className="text-blue-500 h-5 w-5" />
          </div>
          <div>
            <div
              className="font-semibold text-gray-800 w-44 truncate cursor-pointer hover:text-blue-600 transition-colors"
              title={fullName}
            >
              {fullName || 'Chưa cập nhật'}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "employeeCode",
    header: "Mã Nhân Viên",
    cell: ({ row }) => {
      const employeeCode = row.getValue("employeeCode") as string;
      return (
        <div className="flex items-center space-x-2">
          <Hash className="text-gray-500 h-5 w-5" />
          <span className="text-gray-700 font-mono bg-gray-100 px-2 py-1 rounded-md">
            {employeeCode || 'Chưa có mã'}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Chức Vụ",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <div className="flex items-center space-x-2">
          <span className="text-gray-700 font-mono bg-red-300 px-2 py-1 rounded-md">
            {role || 'Chưa có mã'}
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
      const statusMap: Record<string, { label: string, color: string, icon: React.ReactNode }> = {
        "Available": { 
          label: "Sẵn sàng", 
          color: "text-green-600", 
          icon: <CheckCircle className="text-green-500 h-5 w-5" /> 
        },
        "Busy": { 
          label: "Đang làm việc", 
          color: "text-orange-600", 
          icon: <Clock className="text-orange-500 h-5 w-5" /> 
        },
        "Offline": { 
          label: "Không hoạt động", 
          color: "text-red-600", 
          icon: <XCircle className="text-red-500 h-5 w-5" /> 
        },
        "OnBreak": { 
          label: "Đang nghỉ", 
          color: "text-blue-600", 
          icon: <Clock className="text-blue-500 h-5 w-5" /> 
        }
      };

      const statusInfo = statusMap[status] || { 
        label: status, 
        color: "text-gray-600", 
        icon: <CheckCircle className="text-gray-500 h-5 w-5" /> 
      };

      return (
        <div className="flex items-center space-x-2">
          {statusInfo.icon}
          <span className={`font-medium ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Cập Nhật Cuối",
    cell: ({ row }) => {
      const updatedAt = row.getValue("updatedAt") as string;
      const formattedDate = updatedAt ? new Date(updatedAt).toLocaleString('vi-VN') : 'Chưa cập nhật';
      
      return (
        <div className="flex items-center space-x-2">
          <Calendar className="text-purple-500 h-5 w-5" />
          <span className="text-gray-700">
            {formattedDate}
          </span>
        </div>
      );
    },
  },
//   {
//     id: "actions",
//     header: "Thao Tác",
//     cell: ({ row }) => (
//       <div className="flex items-center justify-center">
//         <CellAction data={row.original} />
//       </div>
//     ),
//   },
];
