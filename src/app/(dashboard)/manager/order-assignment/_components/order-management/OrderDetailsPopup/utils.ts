// components/OrderDetailsPopup/utils.ts
import { format } from "date-fns";

export const formatCurrency = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined) return "N/A";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const formatDateTime = (dateString: string | null | undefined) => {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm");
  } catch {
    return dateString;
  }
};

export const getStatusColor = (status: string) => {
  const statusMap: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    in_progress: "bg-indigo-100 text-indigo-800",
    scheduled: "bg-purple-100 text-purple-800",
  };
  return statusMap[status.toLowerCase()] || "bg-gray-100 text-gray-800";
};

export const getPriorityColor = (priority: string | null | undefined) => {
  if (!priority) return "bg-gray-100 text-gray-800";
  const priorityMap: Record<string, string> = {
    high: "bg-red-100 text-red-800",
    medium: "bg-orange-100 text-orange-800",
    low: "bg-green-100 text-green-800",
  };
  return priorityMap[priority.toLowerCase()] || "bg-gray-100 text-gray-800";
};