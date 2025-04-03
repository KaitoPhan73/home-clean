"use server";
import { httpHomePlus } from "@/lib/http";

interface OrderStatus {
  status: string;
  count: number;
  revenue: number;
}

interface DailyTrend {
  date: string;
  orderCount: number;
  revenue: number;
}

interface SummaryResponse {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: OrderStatus[];
  dailyTrend: DailyTrend[];
  fromDate: string;
  toDate: string;
}

export const getSummary = async (fromDate: string, toDate: string, groupId?: string) => {
  // Nếu có groupId, truyền vào params, nếu không middleware sẽ xử lý
  const params: Record<string, string> = {
    fromDate,
    toDate,
  };
  
  // Nếu có groupId cụ thể, thêm vào params
  if (groupId) {
    params.groupId = groupId;
  }
  
  const response = await httpHomePlus.get<SummaryResponse>("/summary", {
    params,
  });

  return response;
};

interface StatusBreakdown {
  status: string;
  count: number;
  revenue: number;
}

interface DailyTrend {
  date: string;
  orderCount: number;
  revenue: number;
}

interface ServiceSummary {
  serviceId: string;
  serviceName: string;
  orderCount: number;
  totalRevenue: number;
  averageOrderValue: number;
  statusBreakdown: StatusBreakdown[];
  dailyTrend: DailyTrend[];
}

interface ServiceComparison {
  serviceName: string;
  orderCount: number;
  revenue: number;
  percentage: number;
}

interface MonthlyTrend {
  month: string;
  serviceId: string;
  serviceName: string;
  orderCount: number;
  revenue: number;
}

interface ServiceSummaryResponse {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  serviceSummaries: ServiceSummary[];
  serviceComparison: ServiceComparison[];
  monthlyTrends: MonthlyTrend[];
  fromDate: string;
  toDate: string;
}

export const getServiceSummary = async (fromDate: string, toDate: string, groupId?: string) => {
  // Tạo object params
  const params: Record<string, string> = {
    fromDate,
    toDate,
  };
  
  // Nếu có groupId cụ thể, thêm vào params
  if (groupId) {
    params.groupId = groupId;
  }

  const response = await httpHomePlus.get<ServiceSummaryResponse>("/summary-by-service", {
    params,
  });

  return response;
};