// components/revenue/types.ts

export interface OrderStatus {
    status: string;
    count: number;
    revenue: number;
}

export interface DailyTrend {
    date: string;
    orderCount: number;
    revenue: number;
}

export interface SummaryData {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    ordersByStatus: OrderStatus[];
    dailyTrend: DailyTrend[];
    fromDate: string;
    toDate: string;
}

export interface StatusBreakdown {
    status: string;
    count: number;
    revenue: number;
}

export interface ServiceSummary {
    serviceId: string;
    serviceName: string;
    orderCount: number;
    totalRevenue: number;
    averageOrderValue: number;
    statusBreakdown: StatusBreakdown[];
    dailyTrend: DailyTrend[];
}

export interface ServiceComparisonItem {
    serviceName: string;
    orderCount: number;
    revenue: number;
    percentage: number;
}

export interface StatusBreakdown {
    status: string;
    count: number;
    revenue: number;
  }

export interface DailyTrend {
    date: string;
    orderCount: number;
    revenue: number;
  }

export interface MonthlyTrend {
    month: string;
    serviceId: string;
    serviceName: string;
    orderCount: number;
    revenue: number;
}

export interface ServiceSummary {
    serviceId: string;
    serviceName: string;
    orderCount: number;
    totalRevenue: number;
    averageOrderValue: number;
    statusBreakdown: StatusBreakdown[];
    dailyTrend: DailyTrend[];
  }

export interface ServiceSummaryData {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    serviceSummaries: ServiceSummary[];
    serviceComparison: ServiceComparisonItem[];
    monthlyTrends: MonthlyTrend[];
    fromDate: string;
    toDate: string;
}


export const chartColors = [
    "#4ade80", // Green
    "#60a5fa", // Blue
    "#f87171", // Red
    "#facc15", // Yellow
    "#a78bfa", // Purple
    "#64d2ff", // Light blue
    "#fb923c", // Orange
    "#22d3ee", // Cyan
    "#c084fc", // Violet
    "#94a3b8", // Gray
];