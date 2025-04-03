/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  BarElement,
} from "chart.js";
import { Line, Pie, Bar } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TGroupResponse } from "@/schema/group.schema";
import { getAllGroups } from "@/apis/group";
import { getServiceSummary, getSummary } from "@/apis/revenue";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  BarElement
);

// Interface definitions based on API response
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

interface SummaryData {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: OrderStatus[];
  dailyTrend: DailyTrend[];
  fromDate: string;
  toDate: string;
}

// Interfaces cho API service summary
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

interface ServiceSummaryData {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  serviceSummaries: ServiceSummary[];
  serviceComparison: ServiceComparison[];
  monthlyTrends: MonthlyTrend[];
  fromDate: string;
  toDate: string;
}

// Line chart options configuration
const getLineChartOptions = (
  fromDate: string,
  toDate: string
): ChartOptions<"line"> => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        boxWidth: 12,
        padding: 15,
        font: { size: 12 },
      },
    },
    title: {
      display: true,
      text: `Số đơn và Doanh thu theo ngày (${new Date(
        fromDate
      ).toLocaleDateString()} - ${new Date(toDate).toLocaleDateString()})`,
      font: { size: 16, weight: "bold" },
      padding: { top: 10, bottom: 20 },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleFont: { size: 12 },
      bodyFont: { size: 12 },
      padding: 8,
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || "";
          if (label) {
            label += ": ";
          }
          if (context.dataset.yAxisID === "y1") {
            label += context.parsed.y + " đơn";
          } else if (context.dataset.yAxisID === "y2") {
            label +=
              new Intl.NumberFormat("vi-VN").format(context.parsed.y) + " VND";
          }
          return label;
        },
      },
    },
  },
  scales: {
    y1: {
      type: "linear" as const,
      position: "left" as const,
      title: {
        display: true,
        text: "Số đơn (orders)",
        font: { size: 12 },
      },
      beginAtZero: true,
      grid: { color: "rgba(0, 0, 0, 0.05)" },
    },
    y2: {
      type: "linear" as const,
      position: "right" as const,
      title: {
        display: true,
        text: "Doanh thu (VND)",
        font: { size: 12 },
      },
      beginAtZero: true,
      grid: { drawOnChartArea: false },
    },
    x: {
      title: {
        display: true,
        text: "Ngày",
        font: { size: 12 },
      },
      grid: { display: false },
    },
  },
});

// Pie chart options configuration
const pieChartOptions: ChartOptions<"pie"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: {
        boxWidth: 12,
        padding: 15,
        font: { size: 12 },
      },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleFont: { size: 12 },
      bodyFont: { size: 12 },
      padding: 8,
      callbacks: {
        label: function (context) {
          let label = context.label || "";
          if (label) {
            label += ": ";
          }

          if (context.dataset.label === "Doanh thu") {
            label +=
              new Intl.NumberFormat("vi-VN").format(context.parsed) + " VND";
          } else if (context.dataset.label === "Phần trăm") {
            label += context.parsed + "%";
          } else {
            label += context.parsed + " đơn";
          }
          return label;
        },
      },
    },
  },
};

// Bar chart options
const getBarChartOptions = (title: string): ChartOptions<"bar"> => ({
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: "y" as const,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: title,
      font: { size: 14, weight: "bold" },
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || "";
          if (label) {
            label += ": ";
          }
          if (label.includes("Doanh thu")) {
            label +=
              new Intl.NumberFormat("vi-VN").format(context.parsed.x) + " VND";
          } else {
            label += context.parsed.x + " đơn";
          }
          return label;
        },
      },
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Giá trị",
      },
    },
    y: {
      title: {
        display: true,
        text: "Dịch vụ",
      },
    },
  },
});

// Colors for charts
const chartColors = [
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

// Hằng số cho giá trị "tất cả các nhóm"
const ALL_GROUPS = "all_groups";

export default function RevenuePage() {
  const [activeTab, setActiveTab] = useState<"daily" | "services">("daily");
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [serviceSummaryData, setServiceSummaryData] =
    useState<ServiceSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<TGroupResponse[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(ALL_GROUPS);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("all");
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);

  // Format date as YYYY-MM-DD for API
  const formatDateForApi = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  // Default date range from API example
  const defaultFromDate = new Date("2025-04-01");
  const defaultToDate = new Date("2025-04-03");

  // Date range state
  const [dateFrom, setDateFrom] = useState<Date>(defaultFromDate);
  const [dateTo, setDateTo] = useState<Date>(defaultToDate);

  // Fetch groups on mount
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setIsLoadingGroups(true);
        const response = await getAllGroups();
        setGroups(response.payload.items || []);
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setIsLoadingGroups(false);
      }
    };

    fetchGroups();
  }, []);

  // Function to fetch data
  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Format dates for API
      const fromDateStr = formatDateForApi(dateFrom);
      const toDateStr = formatDateForApi(dateTo);

      // Chỉ truyền groupId nếu không phải là ALL_GROUPS
      const groupIdParam =
        selectedGroupId !== ALL_GROUPS ? selectedGroupId : undefined;

      // Gọi cả hai API đồng thời để cải thiện hiệu suất
      const [summaryResponse, serviceSummaryResponse] = await Promise.all([
        getSummary(fromDateStr, toDateStr, groupIdParam),
        getServiceSummary(fromDateStr, toDateStr, groupIdParam),
      ]);

      // Cập nhật state với kết quả từ cả hai API
      setSummaryData(summaryResponse.payload);
      setServiceSummaryData(serviceSummaryResponse.payload);
      setError(null);

      // Reset selectedServiceId khi tải dữ liệu mới
      setSelectedServiceId("all");
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Prepare line chart data from API response
  const dailyData: ChartData<"line", number[], string> = {
    labels: summaryData?.dailyTrend.map((item) => item.date) || [],
    datasets: [
      {
        label: "Số đơn",
        data: summaryData?.dailyTrend.map((item) => item.orderCount) || [],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
        yAxisID: "y1",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Doanh thu",
        data: summaryData?.dailyTrend.map((item) => item.revenue) || [],
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        fill: true,
        tension: 0.4,
        yAxisID: "y2",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Prepare service comparison pie chart data
  const serviceComparisonData: ChartData<"pie", number[], string> = {
    labels:
      serviceSummaryData?.serviceComparison.map((item) => item.serviceName) ||
      [],
    datasets: [
      {
        label: "Doanh thu",
        data:
          serviceSummaryData?.serviceComparison.map((item) => item.revenue) ||
          [],
        backgroundColor:
          serviceSummaryData?.serviceComparison.map(
            (_, index) => chartColors[index % chartColors.length]
          ) || [],
        hoverOffset: 8,
        borderWidth: 1,
        borderColor: "#fff",
      },
    ],
  };

  // Prepare service percentage pie chart data
  const servicePercentageData: ChartData<"pie", number[], string> = {
    labels:
      serviceSummaryData?.serviceComparison.map((item) => item.serviceName) ||
      [],
    datasets: [
      {
        label: "Phần trăm",
        data:
          serviceSummaryData?.serviceComparison.map(
            (item) => item.percentage
          ) || [],
        backgroundColor:
          serviceSummaryData?.serviceComparison.map(
            (_, index) => chartColors[index % chartColors.length]
          ) || [],
        hoverOffset: 8,
        borderWidth: 1,
        borderColor: "#fff",
      },
    ],
  };

  // Prepare service bar chart data
  const serviceBarData: ChartData<"bar", number[], string> = {
    labels:
      serviceSummaryData?.serviceComparison.map((item) => item.serviceName) ||
      [],
    datasets: [
      {
        label: "Doanh thu (VND)",
        data:
          serviceSummaryData?.serviceComparison.map((item) => item.revenue) ||
          [],
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
      {
        label: "Số đơn",
        data:
          serviceSummaryData?.serviceComparison.map(
            (item) => item.orderCount
          ) || [],
        backgroundColor: "rgba(239, 68, 68, 0.7)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Prepare status breakdown data for selected service
  // Prepare status breakdown data for selected service
const getStatusBreakdownData = () => {
  if (!serviceSummaryData || !serviceSummaryData.serviceSummaries) return null;

  // Nếu là "all", kết hợp tất cả các status breakdown từ tất cả các dịch vụ
  if (selectedServiceId === "all") {
    // Tạo một map để tổng hợp dữ liệu
    const statusMap = new Map<string, { count: number, revenue: number }>();
    
    serviceSummaryData.serviceSummaries.forEach(service => {
      if (service.statusBreakdown) {
        service.statusBreakdown.forEach(status => {
          if (statusMap.has(status.status)) {
            const current = statusMap.get(status.status)!;
            statusMap.set(status.status, {
              count: current.count + status.count,
              revenue: current.revenue + status.revenue
            });
          } else {
            statusMap.set(status.status, {
              count: status.count,
              revenue: status.revenue
            });
          }
        });
      }
    });

    // Chuyển map thành mảng
    const combinedStatusBreakdown = Array.from(statusMap.entries()).map(([status, data]) => ({
      status,
      count: data.count,
      revenue: data.revenue
    }));

    // Nếu không có dữ liệu, trả về null
    if (combinedStatusBreakdown.length === 0) return null;

    return {
      statusRevenueData: {
        labels: combinedStatusBreakdown.map(item => item.status),
        datasets: [
          {
            label: "Doanh thu",
            data: combinedStatusBreakdown.map(item => item.revenue),
            backgroundColor: combinedStatusBreakdown.map((item, index) => chartColors[index % chartColors.length]),
            borderWidth: 1,
            borderColor: "#fff",
          },
        ],
      },
      statusCountData: {
        labels: combinedStatusBreakdown.map(item => item.status),
        datasets: [
          {
            label: "Số đơn",
            data: combinedStatusBreakdown.map(item => item.count),
            backgroundColor: combinedStatusBreakdown.map((item, index) => chartColors[index % chartColors.length]),
            borderWidth: 1,
            borderColor: "#fff",
          },
        ],
      }
    };
  } 
  
  // Ngược lại, lấy dữ liệu của service được chọn
  const selectedService = serviceSummaryData.serviceSummaries.find(
    service => service.serviceId === selectedServiceId
  );
  
  if (!selectedService || !selectedService.statusBreakdown || selectedService.statusBreakdown.length === 0) return null;

  return {
    statusRevenueData: {
      labels: selectedService.statusBreakdown.map(item => item.status),
      datasets: [
        {
          label: "Doanh thu",
          data: selectedService.statusBreakdown.map(item => item.revenue),
          backgroundColor: selectedService.statusBreakdown.map((item, index) => chartColors[index % chartColors.length]),
          borderWidth: 1,
          borderColor: "#fff",
        },
      ],
    },
    statusCountData: {
      labels: selectedService.statusBreakdown.map(item => item.status),
      datasets: [
        {
          label: "Số đơn",
          data: selectedService.statusBreakdown.map(item => item.count),
          backgroundColor: selectedService.statusBreakdown.map((item, index) => chartColors[index % chartColors.length]),
          borderWidth: 1,
          borderColor: "#fff",
        },
      ],
    }
  };
};

  const statusBreakdownData = getStatusBreakdownData();

  // Display loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-5xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Trang Doanh Thu
        </h1>
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-5xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Trang Doanh Thu
        </h1>
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    // Thêm class "overflow-auto" để có thể cuộn khi nội dung dài
    <div className="h-screen flex flex-col">
      {/* Header cố định */}
      <div className="bg-white py-4 border-b">
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Trang Doanh Thu
        </h1>
      </div>

      {/* Nội dung có thể cuộn */}
      <div className="flex-1 overflow-auto p-4 bottom-60">
        <div className="container mx-auto max-w-5xl">
          {/* Filter Section - Sticky để luôn hiện ở đầu khi cuộn */}
          <div className="sticky top-0 z-10 flex flex-col sm:flex-row gap-4 mb-6 bg-gray-50 p-4 rounded-lg shadow">
            {/* Date From */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Từ ngày
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "Chọn ngày"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={(date) => date && setDateFrom(date)}
                    initialFocus
                    disabled={(date) => date > dateTo}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Date To */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Đến ngày
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "dd/MM/yyyy") : "Chọn ngày"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={(date) => date && setDateTo(date)}
                    initialFocus
                    disabled={(date) => date < dateFrom}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Group Select */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Chọn nhóm
              </label>
              <Select
                value={selectedGroupId}
                onValueChange={setSelectedGroupId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tất cả các nhóm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_GROUPS}>Tất cả các nhóm</SelectItem>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Apply Button */}
            <div className="flex items-end">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={fetchData}
                disabled={isLoading}
              >
                {isLoading ? "Đang tải..." : "Áp dụng"}
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="shadow">
              <CardContent className="p-4">
                <div className="text-sm font-medium text-gray-500">
                  Tổng số đơn hàng
                </div>
                <div className="text-2xl font-bold">
                  {summaryData?.totalOrders}
                </div>
              </CardContent>
            </Card>
            <Card className="shadow">
              <CardContent className="p-4">
                <div className="text-sm font-medium text-gray-500">
                  Tổng doanh thu
                </div>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat("vi-VN").format(
                    summaryData?.totalRevenue || 0
                  )}{" "}
                  VND
                </div>
              </CardContent>
            </Card>
            <Card className="shadow">
              <CardContent className="p-4">
                <div className="text-sm font-medium text-gray-500">
                  Giá trị trung bình
                </div>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat("vi-VN").format(
                    Math.round(summaryData?.averageOrderValue || 0)
                  )}{" "}
                  VND
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "daily" | "services")
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 rounded-lg p-1">
              <TabsTrigger
                value="daily"
                className="py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Theo ngày
              </TabsTrigger>
              <TabsTrigger
                value="services"
                className="py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Theo dịch vụ
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Line Chart - Giữ nguyên */}
            <TabsContent value="daily">
              <Card className="shadow-lg">
                <CardHeader className="border-b py-3">
                  <CardTitle className="text-lg text-gray-700">
                    Số đơn và Doanh thu theo ngày
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="h-[300px] w-full">
                    {summaryData?.dailyTrend &&
                    summaryData.dailyTrend.length > 0 ? (
                      <Line
                        data={dailyData}
                        options={getLineChartOptions(
                          summaryData.fromDate,
                          summaryData.toDate
                        )}
                      />
                    ) : (
                      <div className="flex justify-center items-center h-full">
                        <p className="text-gray-500">
                          Không có dữ liệu trong khoảng thời gian này
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 2: Service Summary - Đã cập nhật */}
            <TabsContent value="services">
              {/* Service Selection */}
              {serviceSummaryData &&
                serviceSummaryData.serviceSummaries &&
                serviceSummaryData.serviceSummaries.length > 0 && (
                  <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Chọn dịch vụ để xem chi tiết:
                    </label>
                    <Select
                      value={selectedServiceId}
                      onValueChange={setSelectedServiceId}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Tất cả các dịch vụ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả các dịch vụ</SelectItem>
                        {serviceSummaryData.serviceSummaries.map((service) => (
                          <SelectItem
                            key={service.serviceId}
                            value={service.serviceId}
                          >
                            {service.serviceName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

              {/* Service Comparison Chart */}
              <Card className="shadow-lg mb-6">
                <CardHeader className="border-b py-3">
                  <CardTitle className="text-lg text-gray-700">
                    So sánh dịch vụ
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="h-[300px] w-full">
                    {serviceSummaryData &&
                    serviceSummaryData.serviceComparison &&
                    serviceSummaryData.serviceComparison.length > 0 ? (
                      <Bar
                        data={serviceBarData}
                        options={getBarChartOptions(
                          "So sánh doanh thu và số đơn theo dịch vụ"
                        )}
                      />
                    ) : (
                      <div className="flex justify-center items-center h-full">
                        <p className="text-gray-500">
                          Không có dữ liệu về dịch vụ
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Pie Charts Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Revenue Pie Chart */}
                <Card className="shadow-lg">
                  <CardHeader className="border-b py-3">
                    <CardTitle className="text-lg text-gray-700">
                      Doanh thu theo dịch vụ
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="h-[250px] w-full">
                      {serviceSummaryData &&
                      serviceSummaryData.serviceComparison &&
                      serviceSummaryData.serviceComparison.length > 0 ? (
                        <Pie
                          data={serviceComparisonData}
                          options={{
                            ...pieChartOptions,
                            plugins: {
                              ...pieChartOptions.plugins,
                              title: {
                                display: true,
                                text: "Tỷ trọng doanh thu theo dịch vụ",
                                font: { size: 14 },
                              },
                            },
                          }}
                        />
                      ) : (
                        <div className="flex justify-center items-center h-full">
                          <p className="text-gray-500">Không có dữ liệu</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Percentage Pie Chart */}
                <Card className="shadow-lg">
                  <CardHeader className="border-b py-3">
                    <CardTitle className="text-lg text-gray-700">
                      Phân bổ dịch vụ (%)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="h-[250px] w-full">
                      {serviceSummaryData &&
                      serviceSummaryData.serviceComparison &&
                      serviceSummaryData.serviceComparison.length > 0 ? (
                        <Pie
                          data={servicePercentageData}
                          options={{
                            ...pieChartOptions,
                            plugins: {
                              ...pieChartOptions.plugins,
                              title: {
                                display: true,
                                text: "Phần trăm theo dịch vụ",
                                font: { size: 14 },
                              },
                            },
                          }}
                        />
                      ) : (
                        <div className="flex justify-center items-center h-full">
                          <p className="text-gray-500">Không có dữ liệu</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Status Breakdown Charts */}
              {statusBreakdownData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Status Revenue Pie Chart */}
                  <Card className="shadow-lg">
                    <CardHeader className="border-b py-3">
                      <CardTitle className="text-lg text-gray-700">
                        Doanh thu theo trạng thái
                        {selectedServiceId !== "all" &&
                          serviceSummaryData &&
                          serviceSummaryData.serviceSummaries && (
                            <span className="text-sm font-normal ml-1">
                              -{" "}
                              {
                                serviceSummaryData.serviceSummaries.find(
                                  (s) => s.serviceId === selectedServiceId
                                )?.serviceName
                              }
                            </span>
                          )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="h-[250px] w-full">
                        {statusBreakdownData.statusRevenueData.datasets[0].data
                          .length > 0 ? (
                          <Pie
                            data={statusBreakdownData.statusRevenueData}
                            options={{
                              ...pieChartOptions,
                              plugins: {
                                ...pieChartOptions.plugins,
                                title: {
                                  display: true,
                                  text: "Doanh thu theo trạng thái (VND)",
                                  font: { size: 14 },
                                },
                              },
                            }}
                          />
                        ) : (
                          <div className="flex justify-center items-center h-full">
                            <p className="text-gray-500">Không có dữ liệu</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Status Count Pie Chart */}
                  <Card className="shadow-lg">
                    <CardHeader className="border-b py-3">
                      <CardTitle className="text-lg text-gray-700">
                        Số đơn theo trạng thái
                        {selectedServiceId !== "all" &&
                          serviceSummaryData &&
                          serviceSummaryData.serviceSummaries && (
                            <span className="text-sm font-normal ml-1">
                              -{" "}
                              {
                                serviceSummaryData.serviceSummaries.find(
                                  (s) => s.serviceId === selectedServiceId
                                )?.serviceName
                              }
                            </span>
                          )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="h-[250px] w-full">
                        {statusBreakdownData.statusCountData.datasets[0].data
                          .length > 0 ? (
                          <Pie
                            data={statusBreakdownData.statusCountData}
                            options={{
                              ...pieChartOptions,
                              plugins: {
                                ...pieChartOptions.plugins,
                                title: {
                                  display: true,
                                  text: "Số đơn theo trạng thái",
                                  font: { size: 14 },
                                },
                              },
                            }}
                          />
                        ) : (
                          <div className="flex justify-center items-center h-full">
                            <p className="text-gray-500">Không có dữ liệu</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
