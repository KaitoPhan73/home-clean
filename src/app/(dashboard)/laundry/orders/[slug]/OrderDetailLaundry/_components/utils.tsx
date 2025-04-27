import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import React from "react"; // đảm bảo bạn đã import React nếu dùng JSX

export const getStatusBadge = (status?: string): React.ReactNode => {
  if (!status) {
    return <Badge className="bg-gray-100">Không xác định</Badge>;
  }
  switch (status) {
    case "Draft":
      return <Badge className="bg-gray-100 text-gray-800">Đơn mới</Badge>;
    case "Pending":
      return <Badge className="bg-yellow-100 text-yellow-800">Đang xử lý</Badge>;
    case "Completed":
      return <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>;
    case "Cancelled":
      return <Badge className="bg-red-100 text-red-800">Đã hủy</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export const formatDate = (date: Date | string | null): string => {
  if (!date) return "N/A";
  return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: vi });
};
