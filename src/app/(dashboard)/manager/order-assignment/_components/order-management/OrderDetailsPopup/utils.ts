import { format } from "date-fns";

export const formatCurrency = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined) return "N/A";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0, 
  }).format(amount);
};

export const formatDateTime = (dateString: string | null | undefined) => {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), "dd/MM/yy HH:mm");
  } catch {
    return dateString;
  }
};

export const getStatusColor = (status: string) => {
  const statusMap: Record<string, string> = {
    draft: "bg-gray-50 text-gray-400 text-xs",      
    pending: "bg-yellow-50 text-yellow-400 text-xs",
    accepted: "bg-blue-50 text-blue-400 text-xs",
    completed: "bg-green-50 text-green-400 text-xs",
    cancelled: "bg-red-50 text-red-400 text-xs",
    in_progress: "bg-indigo-50 text-indigo-400 text-xs",
    scheduled: "bg-purple-50 text-purple-400 text-xs",
  };
  return statusMap[status.toLowerCase()] || "bg-gray-50 text-gray-400 text-xs";
};

export const getPriorityColor = (priority: string | null | undefined) => {
  if (!priority) return "bg-gray-50 text-gray-600 text-xs";
  const priorityMap: Record<string, string> = {
    high: "bg-red-50 text-red-600 text-xs",        
    medium: "bg-orange-50 text-orange-600 text-xs",
    low: "bg-green-50 text-green-600 text-xs",
  };
  return priorityMap[priority.toLowerCase()] || "bg-gray-50 text-gray-600 text-xs";
};