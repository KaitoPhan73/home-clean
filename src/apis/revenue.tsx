/* eslint-disable @typescript-eslint/no-explicit-any */
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

export const getSummary = async (
  fromDate: string,
  toDate: string,
  groupId?: string
) => {
  const params: Record<string, string> = {
    fromDate,
    toDate,
  };

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

export interface GroupComparisonData {
  fromDate: string;
  toDate: string;
  totalOrders: number;
  totalRevenue: number;
  groupPerformanceData: {
    groupId: string;
    groupName: string;
    orderCount: number;
    revenue: number;
    completionRate: number;
    cancellationRate: number;
    averageOrderValue: number;
    marketShare: number;
    revenueShare: number;
  }[];
  groupTrends: {
    month: string;
    groupId: string;
    groupName: string;
    orderCount: number;
    revenue: number;
  }[];
}

// Định nghĩa kiểu dữ liệu cho API /summary-by-staff
export interface SummaryByStaffData {
  fromDate: string;
  toDate: string;
  totalOrders: number;
  totalRevenue: number;
  staffSummaries: {
    staffId: string;
    staffName: string;
    orderCount: number;
    totalRevenue: number;
    averageOrderValue: number;
    completedOrders: number;
    cancelledOrders: number;
    completionRate: number;
    averageRating: number;
    serviceBreakdown: {
      serviceId: string;
      serviceName: string;
      orderCount: number;
      revenue: number;
    }[];
    dailyPerformance: {
      date: string;
      orderCount: number;
      revenue: number;
      completedOrders: number;
    }[];
  }[];
  staffComparison: {
    staffName: string;
    orderCount: number;
    revenue: number;
    completionRate: number;
    averageRating: number;
  }[];
}

export const getServiceSummary = async (
  fromDate: string,
  toDate: string,
  groupId?: string
) => {
  const params: Record<string, string> = {
    fromDate,
    toDate,
  };
  if (groupId) {
    params.groupId = groupId;
  }
  const response = await httpHomePlus.get<ServiceSummaryResponse>(
    "/summary-by-service",
    {
      params,
    }
  );

  return response;
};

export const getSummaryByPeriod = async (
  startDate: string,
  endDate: string,
  groupBy: "day" | "week" | "month" | "year",
  groupId?: string
) => {
  const params: Record<string, string> = {
    startDate,
    endDate,
    groupBy,
  };

  if (groupId) {
    params.groupId = groupId;
  }

  try {
    const response = await httpHomePlus.get("/by-period", {
      params,
    });

    // Kiểm tra và xử lý dữ liệu trả về
    if (response && response.payload) {
      return response;
    } else {
      console.error("Invalid response format from by-period API:", response);
      return { payload: [] };
    }
  } catch (error) {
    console.error("Error fetching period data:", error);
    return { payload: [] };
  }
};

export const getGroupComparison = async (fromDate: string, toDate: string) => {
  const response = await httpHomePlus.get("/group-comparison", {
    params: { fromDate, toDate },
  });
  return response;
};

// API mới: /summary-by-staff
export const getSummaryByStaff = async (
  fromDate: string,
  toDate: string,
  groupId?: string
) => {
  const response = await httpHomePlus.get("/summary-by-staff", {
    params: { fromDate, toDate, ...(groupId ? { groupId } : {}) },
  });
  return response;
};


export interface ExtraServiceData {
  fromDate: string;
  toDate: string;
  totalOrders: number;
  ordersWithExtraServices: number;
  extraServiceAttachRate: number;
  extraServiceUsage: {
    extraServiceId: string;
    extraServiceName: string;
    orderCount: number;
    revenue: number;
    attachRate: number;
    monthlyTrend: {
      month: string;
      orderCount: number;
      revenue: number;
    }[];
  }[];
  coOccurrences: any[]; // Thay bằng kiểu dữ liệu cụ thể nếu cần
}

// Định nghĩa kiểu dữ liệu cho API /option-usage
export interface OptionUsageData {
  fromDate: string;
  toDate: string;
  totalOrders: number;
  ordersWithOptions: number;
  optionAttachRate: number;
  optionUsage: {
    optionId: string;
    optionName: string;
    orderCount: number;
    revenue: number;
    attachRate: number;
    monthlyTrend: {
      month: string;
      orderCount: number;
      revenue: number;
    }[];
  }[];
  optionsByService: {
    serviceId: string;
    serviceName: string;
    optionId: string;
    optionName: string;
    orderCount: number;
    attachRate: number;
  }[];
}

// Hàm gọi API /extra-service-usage
export const getExtraServiceUsage = async (
  fromDate: string,
  toDate: string,
  groupId?: string
) => {
  const params: Record<string, string> = {
    fromDate,
    toDate,
  };

  if (groupId) {
    params.groupId = groupId;
  }

  const response = await httpHomePlus.get<ExtraServiceData>("/extra-service-usage", {
    params,
  });
  return response;
};

// Hàm gọi API /option-usage
export const getOptionUsage = async (
  fromDate: string,
  toDate: string,
  groupId?: string
) => {
  const params: Record<string, string> = {
    fromDate,
    toDate,
  };

  if (groupId) {
    params.groupId = groupId;
  }

  const response = await httpHomePlus.get<OptionUsageData>("/option-usage", {
    params,
  });
  return response;
};