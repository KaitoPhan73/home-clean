/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertTriangle, Copy } from "lucide-react";
import { TTaskResponse } from "@/schema/VinLaudry/task.schema";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";

export const taskColumns: ColumnDef<TTaskResponse>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const id = row.getValue<string>("id");
      
      const copyToClipboard = () => {
        navigator.clipboard.writeText(id)
          .then(() => {
            toast({
              description: "ID đã được sao chép!",
              variant: "success"
            });
          })
          .catch(() => {
            toast({
              variant: "destructive",
              description: "Không thể sao chép ID!"
            });
          });
      };
      
      return (
        <div className="flex items-center space-x-1">
          <div className="font-medium text-xs text-gray-500 max-w-[100px] truncate" title={id}>
            {id}
          </div>
          <Copy 
            className="h-4 w-4 text-gray-500 cursor-pointer hover:text-blue-600 transition-colors" 
            onClick={copyToClipboard}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "taskCode",
    header: "Mã Nhiệm Vụ",
    cell: ({ row }) => (
      <div className="font-medium text-sm">
        {row.getValue("taskCode")}
      </div>
    ),
  },
  {
    accessorKey: "taskName",
    header: "Tên Nhiệm Vụ",
    cell: ({ row }) => (
      <div
        className="max-w-[200px] truncate font-medium cursor-pointer hover:text-blue-600 transition-colors"
        title={row.getValue("taskName")}
        onClick={() => window.open(`/admin/tasks/${row.original.id}`, "_blank")}
      >
        {row.getValue("taskName")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng Thái",
    enableSorting: true,
    // This is the key part for filtering
    filterFn: (row, id, value) => {
      // If value is empty string or array, show all
      if (!value || (Array.isArray(value) && value.length === 0)) {
        return true;
      }
      
      const status = row.getValue(id) as string;
      // Check if the row's status is in the filter value array
      if (Array.isArray(value)) {
        return value.includes(status);
      }
      // Check if the row's status matches the filter value string
      return status === value;
    },
    cell: ({ row }) => {
      const status = row.getValue<string>("status");
      
      let icon;
      let badgeStyles = "";
      let statusText = "";
      
      switch (status) {
        case "Completed":
          icon = <CheckCircle className="h-4 w-4" />;
          badgeStyles = "bg-green-100 text-green-800 border-green-300";
          statusText = "Hoàn thành";
          break;
        case "Pending":
          icon = <Clock className="h-4 w-4" />;
          badgeStyles = "bg-yellow-100 text-yellow-800 border-yellow-300";
          statusText = "Đang chờ";
          break;
        case "inProgress":
          icon = <AlertTriangle className="h-4 w-4" />;
          badgeStyles = "bg-blue-100 text-blue-800 border-blue-300";
          statusText = "Đang xử lý";
          break;
        default:
          icon = <Clock className="h-4 w-4" />;
          badgeStyles = "bg-gray-100 text-gray-800 border-gray-300";
          statusText = status || "Không xác định";
      }
      
      return (
        <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${badgeStyles}`}>
          <span className="mr-1">{icon}</span>
          {statusText}
        </div>
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Độ ưu tiên",
    cell: ({ row }) => {
      const priority = row.getValue<string>("priority");
      
      let priorityClass = "bg-gray-100 text-gray-800";
      let priorityText = "Không xác định";
      
      switch (priority) {
        case "1":
          priorityClass = "bg-red-100 text-red-800";
          priorityText = "Cao";
          break;
        case "2":
          priorityClass = "bg-yellow-100 text-yellow-800";
          priorityText = "Trung bình";
          break;
        case "3":
          priorityClass = "bg-green-100 text-green-800";
          priorityText = "Thấp";
          break;
      }
      
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityClass}`}>
          {priorityText}
        </span>
      );
    },
  },
  {
    accessorKey: "employeeName",
    header: "Nhân viên",
    cell: ({ row }) => {
      const employeeName = row.getValue<string | null>("employeeName");
      return (
        <div className="text-sm">
          {employeeName || <span className="text-gray-400 italic">Chưa phân công</span>}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Ngày Tạo",
    cell: ({ row }) => {
      const date = row.getValue<string>("createdAt");
      if (!date) return null;
      
      try {
        const formattedDate = format(new Date(date), "dd/MM/yyyy HH:mm", { locale: vi });
        return <div className="text-sm text-gray-500">{formattedDate}</div>;
      } catch (error) {
        return <div className="text-sm text-gray-500">{date}</div>;
      }
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];