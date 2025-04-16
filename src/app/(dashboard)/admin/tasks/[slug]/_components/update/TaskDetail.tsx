"use client";

import { TTaskResponse } from "@/schema/VinLaudry/task.schema";
import PageContainer from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Tag,
  FileText,
  ArrowLeft,
  Copy,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type TaskStatus = "Completed" | "Pending" | "inProgress";

type Props = {
  task: TTaskResponse & { status: TaskStatus };
};

export default function TaskDetail({ task }: Props) {
  const [copyStatus, setCopyStatus] = useState<{
    id: string;
    status: "idle" | "success" | "failed";
  }>({
    id: "",
    status: "idle",
  });

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopyStatus({ id, status: "success" });
        setTimeout(() => setCopyStatus({ id: "", status: "idle" }), 2000);
      })
      .catch(() => {
        setCopyStatus({ id, status: "failed" });
        setTimeout(() => setCopyStatus({ id: "", status: "idle" }), 2000);
      });
  };

  const statusConfig: Record<
    TaskStatus,
    { badge: string; icon: React.JSX.Element }
  > = {
    Completed: {
      badge: "bg-green-100 text-green-800 border-green-300",
      icon: <CheckCircle className="h-4 w-4 mr-1" />,
    },
    Pending: {
      badge: "bg-yellow-100 text-yellow-800 border-yellow-300",
      icon: <Clock className="h-4 w-4 mr-1" />,
    },
    inProgress: {
      badge: "bg-blue-100 text-blue-800 border-blue-300",
      icon: <AlertTriangle className="h-4 w-4 mr-1" />,
    },
  };

  const priorityConfig: Record<string, { badge: string; text: string }> = {
    "1": { badge: "bg-red-100 text-red-800 border-red-300", text: "Cao" },
    "2": {
      badge: "bg-yellow-100 text-yellow-800 border-yellow-300",
      text: "Trung bình",
    },
    "3": {
      badge: "bg-green-100 text-green-800 border-green-300",
      text: "Thấp",
    },
  };

  const formatDate = (date: string | null) => {
    return date
      ? format(new Date(date), "dd/MM/yyyy HH:mm", { locale: vi })
      : "—";
  };

  return (
    <PageContainer>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between bg-white shadow-sm rounded-lg px-0 py-3">
          <div className="w-1/4">
            <Link href="/admin/tasks">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-slate-100"
              >
                <ArrowLeft className="h-5 w-5 text-slate-600" />
              </Button>
            </Link>
          </div>

          <div className="w-2/4 text-center">
            <h1 className="text-xl font-bold text-gray-800 line-clamp-1">
              {task.taskName}
            </h1>
            <div className="flex items-center justify-center mt-1 text-gray-500 text-sm">
              <span>Mã nhiệm vụ: {task.taskCode}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 ml-1 hover:bg-gray-100 rounded-full"
                      onClick={() => copyToClipboard(task.taskCode, "taskCode")}
                    >
                      <Copy className="h-3.5 w-3.5 text-gray-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {copyStatus.id === "taskCode" ? (
                      copyStatus.status === "success" ? (
                        <p className="flex items-center text-green-600">
                          <CheckCircle className="h-3.5 w-3.5 mr-1" /> Đã sao
                          chép!
                        </p>
                      ) : (
                        <p className="flex items-center text-red-600">
                          <AlertTriangle className="h-3.5 w-3.5 mr-1" /> Lỗi sao
                          chép
                        </p>
                      )
                    ) : (
                      <p>Sao chép mã</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="w-1/4 flex justify-end">
            <Badge
              className={`${
                statusConfig[task.status].badge
              } px-3 py-1 text-sm font-medium flex items-center`}
            >
              {statusConfig[task.status].icon}
              {task.status === "Completed"
                ? "Hoàn thành"
                : task.status === "Pending"
                ? "Đang chờ"
                : "Đang xử lý"}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-gray-50 px-4 py-3">
              <h2 className="text-md font-semibold text-gray-800 flex items-center">
                <Tag className="h-4 w-4 text-blue-600 mr-2" />
                Thông tin nhiệm vụ
              </h2>
            </div>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between py-1 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">
                    Độ ưu tiên
                  </span>
                  <Badge
                    className={
                      priorityConfig[task.priority]?.badge ||
                      "bg-gray-100 text-gray-600"
                    }
                  >
                    {priorityConfig[task.priority]?.text || "Không xác định"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">
                    Nhân viên
                  </span>
                  <span className="text-sm">{task.employeeName || "—"}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">
                    Người giao
                  </span>
                  <span className="text-sm">{task.managerName || "—"}</span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-sm font-medium text-gray-600">
                    Mã đơn hàng
                  </span>
                  <div className="flex items-center">
                    <span className="text-sm font-mono truncate max-w-xs">
                      {task.orderId
                        ? task.orderId.substring(0, 8) + "..."
                        : "—"}
                    </span>
                    {task.orderId && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 ml-1 hover:bg-gray-100 rounded-full"
                              onClick={() =>
                                copyToClipboard(task.orderId || "", "orderId")
                              }
                            >
                              <Copy className="h-3.5 w-3.5 text-gray-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {copyStatus.id === "orderId" ? (
                              copyStatus.status === "success" ? (
                                <p className="flex items-center text-green-600">
                                  <CheckCircle className="h-3.5 w-3.5 mr-1" />{" "}
                                  Đã sao chép!
                                </p>
                              ) : (
                                <p className="flex items-center text-red-600">
                                  <AlertTriangle className="h-3.5 w-3.5 mr-1" />{" "}
                                  Lỗi sao chép
                                </p>
                              )
                            ) : (
                              <p>Sao chép mã đơn hàng</p>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-gray-50 px-4 py-3">
              <h2 className="text-md font-semibold text-gray-800 flex items-center">
                <Calendar className="h-4 w-4 text-blue-600 mr-2" />
                Thời gian
              </h2>
            </div>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between py-1 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">
                    Ngày tạo
                  </span>
                  <span className="text-sm">{formatDate(task.createdAt)}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">
                    Ngày sửa đổi
                  </span>
                  <span className="text-sm">{formatDate(task.updatedAt)}</span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-sm font-medium text-gray-600">
                    Ngày hoàn thành
                  </span>
                  <span className="text-sm">
                    {formatDate(task.completedDate)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-gray-50 px-4 py-3">
            <h2 className="text-md font-semibold text-gray-800 flex items-center">
              <FileText className="h-4 w-4 text-blue-600 mr-2" />
              Ghi chú và Mô tả
            </h2>
          </div>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">
                  Mô tả:
                </h3>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  {task.description || "Không có mô tả"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">
                  Ghi chú:
                </h3>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  {task.notes || "Không có ghi chú"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
