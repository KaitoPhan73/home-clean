/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { chartColors, ServiceSummaryData } from "@/app/(dashboard)/admin/revenues/chart-config/types";
import { getBarChartOptions } from "@/app/(dashboard)/admin/revenues/chart-config/bar-config";
import { pieChartOptions } from "@/app/(dashboard)/admin/revenues/chart-config/pie-config";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface ServiceChartsProps {
  serviceSummaryData: ServiceSummaryData | null;
  selectedServiceId: string;
  setSelectedServiceId: (id: string) => void;
}

export function ServiceCharts({ serviceSummaryData, selectedServiceId, setSelectedServiceId }: ServiceChartsProps) {
  const [timeView, setTimeView] = useState<"daily" | "monthly">("daily");
  
  // Biểu đồ cột: So sánh doanh thu và số đơn theo dịch vụ
  const serviceBarData = {
    labels: serviceSummaryData?.serviceComparison?.map((item) => item.serviceName) || [],
    datasets: [
      {
        label: "Doanh thu (VND)",
        data: serviceSummaryData?.serviceComparison?.map((item) => item.revenue) || [],
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
      {
        label: "Số đơn",
        data: serviceSummaryData?.serviceComparison?.map((item) => item.orderCount) || [],
        backgroundColor: "rgba(239, 68, 68, 0.7)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Biểu đồ tròn: Doanh thu theo dịch vụ
  const serviceComparisonData = {
    labels: serviceSummaryData?.serviceComparison?.map((item) => item.serviceName) || [],
    datasets: [
      {
        label: "Doanh thu",
        data: serviceSummaryData?.serviceComparison?.map((item) => item.revenue) || [],
        backgroundColor:
          serviceSummaryData?.serviceComparison?.map((_, index: number) => chartColors[index % chartColors.length]) ||
          [],
        hoverOffset: 8,
        borderWidth: 1,
        borderColor: "#fff",
      },
    ],
  };

  // Tính toán phần trăm từ trường percentage của API hoặc tính thủ công nếu không có
  const servicePercentageData = {
    labels: serviceSummaryData?.serviceComparison?.map((item) => item.serviceName) || [],
    datasets: [
      {
        label: "Phần trăm",
        data: serviceSummaryData?.serviceComparison?.map((item) => 
          item.percentage || 0
        ) || [],
        backgroundColor:
          serviceSummaryData?.serviceComparison?.map((_, index: number) => chartColors[index % chartColors.length]) ||
          [],
        hoverOffset: 8,
        borderWidth: 1,
        borderColor: "#fff",
      },
    ],
  };

  // Lấy dữ liệu xu hướng hàng ngày
  const getDailyTrendData = () => {
    if (!serviceSummaryData || !serviceSummaryData.serviceSummaries) return null;

    let trendData;
    
    if (selectedServiceId === "all") {
      // Nếu chọn "Tất cả", tạo dữ liệu tổng hợp từ tất cả các dịch vụ
      const dateMap = new Map<string, { orderCount: number; revenue: number }>();
      
      serviceSummaryData.serviceSummaries.forEach(service => {
        if (service.dailyTrend) {
          service.dailyTrend.forEach(day => {
            const existingData = dateMap.get(day.date);
            if (existingData) {
              dateMap.set(day.date, {
                orderCount: existingData.orderCount + day.orderCount,
                revenue: existingData.revenue + day.revenue
              });
            } else {
              dateMap.set(day.date, {
                orderCount: day.orderCount,
                revenue: day.revenue
              });
            }
          });
        }
      });
      
      // Chuyển đổi Map thành mảng đã sắp xếp theo ngày
      trendData = Array.from(dateMap.entries())
        .map(([date, data]) => ({
          date,
          orderCount: data.orderCount,
          revenue: data.revenue
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else {
      // Nếu chọn một dịch vụ cụ thể
      const selectedService = serviceSummaryData.serviceSummaries.find(
        service => service.serviceId === selectedServiceId
      );
      
      if (!selectedService || !selectedService.dailyTrend) return null;
      
      trendData = [...selectedService.dailyTrend]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    
    return {
      labels: trendData.map(item => {
        const date = new Date(item.date);
        return `${date.getDate()}/${date.getMonth() + 1}`;
      }),
      datasets: [
        {
          label: "Doanh thu (VND)",
          data: trendData.map(item => item.revenue),
          borderColor: "rgba(59, 130, 246, 1)",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          yAxisID: 'y',
        },
        {
          label: "Số đơn",
          data: trendData.map(item => item.orderCount),
          borderColor: "rgba(239, 68, 68, 1)",
          backgroundColor: "rgba(239, 68, 68, 0.2)",
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.4,
          yAxisID: 'y1',
        }
      ]
    };
  };

  // Lấy dữ liệu xu hướng hàng tháng
  const getMonthlyTrendData = () => {
    if (!serviceSummaryData || !serviceSummaryData.monthlyTrends) return null;
    
    let filteredTrends;
    
    if (selectedServiceId === "all") {
      filteredTrends = [...serviceSummaryData.monthlyTrends];
    } else {
      filteredTrends = serviceSummaryData.monthlyTrends.filter(
        trend => trend.serviceId === selectedServiceId
      );
    }
    
    if (!filteredTrends.length) return null;
    
    // Tạo Map để tổng hợp dữ liệu theo tháng
    const monthMap = new Map<string, { orderCount: number; revenue: number }>();
    
    filteredTrends.forEach(trend => {
      const existingData = monthMap.get(trend.month);
      if (existingData) {
        monthMap.set(trend.month, {
          orderCount: existingData.orderCount + trend.orderCount,
          revenue: existingData.revenue + trend.revenue
        });
      } else {
        monthMap.set(trend.month, {
          orderCount: trend.orderCount,
          revenue: trend.revenue
        });
      }
    });
    
    // Chuyển đổi Map thành mảng đã sắp xếp theo tháng
    const trendData = Array.from(monthMap.entries())
      .map(([month, data]) => ({
        month,
        orderCount: data.orderCount,
        revenue: data.revenue
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
    
    return {
      labels: trendData.map(item => {
        const [year, month] = item.month.split('-');
        return `${month}/${year.slice(2)}`;
      }),
      datasets: [
        {
          label: "Doanh thu (VND)",
          data: trendData.map(item => item.revenue),
          borderColor: "rgba(59, 130, 246, 1)",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          yAxisID: 'y',
        },
        {
          label: "Số đơn",
          data: trendData.map(item => item.orderCount),
          borderColor: "rgba(239, 68, 68, 1)",
          backgroundColor: "rgba(239, 68, 68, 0.2)",
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.4,
          yAxisID: 'y1',
        }
      ]
    };
  };

  // Hàm xử lý dữ liệu trạng thái đơn hàng
  const getStatusBreakdownData = () => {
    if (!serviceSummaryData || !serviceSummaryData.serviceSummaries) return null;

    if (selectedServiceId === "all") {
      const statusMap = new Map<string, { count: number; revenue: number }>();

      serviceSummaryData.serviceSummaries.forEach((service) => {
        if (service.statusBreakdown) {
          service.statusBreakdown.forEach((status) => {
            if (statusMap.has(status.status)) {
              const current = statusMap.get(status.status)!;
              statusMap.set(status.status, {
                count: current.count + status.count,
                revenue: current.revenue + status.revenue,
              });
            } else {
              statusMap.set(status.status, {
                count: status.count,
                revenue: status.revenue,
              });
            }
          });
        }
      });

      const combinedStatusBreakdown = Array.from(statusMap.entries()).map(([status, data]) => ({
        status,
        count: data.count,
        revenue: data.revenue,
      }));

      if (combinedStatusBreakdown.length === 0) return null;

      return {
        statusRevenueData: {
          labels: combinedStatusBreakdown.map((item) => item.status),
          datasets: [
            {
              label: "Doanh thu",
              data: combinedStatusBreakdown.map((item) => item.revenue),
              backgroundColor: combinedStatusBreakdown.map((_, index: number) => chartColors[index % chartColors.length]),
              borderWidth: 1,
              borderColor: "#fff",
            },
          ],
        },
        statusCountData: {
          labels: combinedStatusBreakdown.map((item) => item.status),
          datasets: [
            {
              label: "Số đơn",
              data: combinedStatusBreakdown.map((item) => item.count),
              backgroundColor: combinedStatusBreakdown.map((_, index: number) => chartColors[index % chartColors.length]),
              borderWidth: 1,
              borderColor: "#fff",
            },
          ],
        },
      };
    }

    const selectedService = serviceSummaryData.serviceSummaries.find(
      (service) => service.serviceId === selectedServiceId
    );

    if (!selectedService || !selectedService.statusBreakdown || selectedService.statusBreakdown.length === 0) return null;

    return {
      statusRevenueData: {
        labels: selectedService.statusBreakdown.map((item) => item.status),
        datasets: [
          {
            label: "Doanh thu",
            data: selectedService.statusBreakdown.map((item) => item.revenue),
            backgroundColor: selectedService.statusBreakdown.map((_, index: number) => chartColors[index % chartColors.length]),
            borderWidth: 1,
            borderColor: "#fff",
          },
        ],
      },
      statusCountData: {
        labels: selectedService.statusBreakdown.map((item) => item.status),
        datasets: [
          {
            label: "Số đơn",
            data: selectedService.statusBreakdown.map((item) => item.count),
            backgroundColor: selectedService.statusBreakdown.map((_, index: number) => chartColors[index % chartColors.length]),
            borderWidth: 1,
            borderColor: "#fff",
          },
        ],
      },
    };
  };

  // Tính toán thông tin tóm tắt dựa trên dịch vụ đã chọn
  const getSelectedServiceSummary = () => {
    if (!serviceSummaryData || !serviceSummaryData.serviceSummaries) return null;
    
    if (selectedServiceId === "all") {
      return {
        orderCount: serviceSummaryData.totalOrders || 0,
        revenue: serviceSummaryData.totalRevenue || 0,
        averageOrderValue: serviceSummaryData.averageOrderValue || 0
      };
    }
    
    const selectedService = serviceSummaryData.serviceSummaries.find(
      service => service.serviceId === selectedServiceId
    );
    
    if (!selectedService) return null;
    
    return {
      orderCount: selectedService.orderCount,
      revenue: selectedService.totalRevenue,
      averageOrderValue: selectedService.averageOrderValue
    };
  };

  // Lấy dữ liệu xu hướng theo chế độ xem đã chọn
  const getTrendChartData = () => {
    return timeView === "daily" ? getDailyTrendData() : getMonthlyTrendData();
  };

  // Cấu hình datalabels để hiển thị phần trăm trên Pie Chart
  const pieChartOptionsWithLabels = {
    ...pieChartOptions,
    plugins: {
      ...pieChartOptions.plugins,
      datalabels: {
        color: "#fff",
        formatter: (value: number, context: any) => {
          const total = context.dataset.data.reduce((sum: number, val: number) => sum + val, 0);
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
          return `${percentage}%`;
        },
        font: {
          weight: "bold" as const,
          size: 14,
        },
      },
    },
  };

  // Cấu hình cho biểu đồ Line Chart
  const lineChartOptions = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Xu hướng theo thời gian',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Doanh thu (VND)',
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Số đơn',
        },
      },
    },
  };

  const selectedServiceSummary = getSelectedServiceSummary();
  const statusBreakdownData = getStatusBreakdownData();
  const trendChartData = getTrendChartData();

  return (
    <div className="space-y-6">
      {/* Thanh lựa chọn dịch vụ & thông tin tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          {serviceSummaryData?.serviceSummaries && (
            <Card className="shadow-md h-full">
              <CardHeader className="border-b bg-gray-50">
                <CardTitle className="text-lg text-gray-800">Chọn dịch vụ</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Tất cả các dịch vụ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả các dịch vụ</SelectItem>
                    {serviceSummaryData.serviceSummaries.map((service) => (
                      <SelectItem key={service.serviceId} value={service.serviceId}>
                        {service.serviceName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}
        </div>

        {selectedServiceSummary && (
          <>
            <div className="md:col-span-1">
              <Card className="shadow-md h-full bg-blue-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700">Tổng số đơn</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-900">{selectedServiceSummary.orderCount}</div>
                  <div className="text-xs text-blue-600 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {selectedServiceId === "all" ? "Tất cả dịch vụ" : serviceSummaryData?.serviceSummaries.find(s => s.serviceId === selectedServiceId)?.serviceName}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-1">
              <Card className="shadow-md h-full bg-green-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-green-700">Tổng doanh thu</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-900">
                    {new Intl.NumberFormat('vi-VN').format(selectedServiceSummary.revenue)} <span className="text-sm font-normal">VND</span>
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {selectedServiceId === "all" ? "Tất cả dịch vụ" : serviceSummaryData?.serviceSummaries.find(s => s.serviceId === selectedServiceId)?.serviceName}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-1">
              <Card className="shadow-md h-full bg-purple-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-purple-700">Giá trị đơn trung bình</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-900">
                    {new Intl.NumberFormat('vi-VN').format(Math.round(selectedServiceSummary.averageOrderValue))} <span className="text-sm font-normal">VND</span>
                  </div>
                  <div className="text-xs text-purple-600 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {selectedServiceId === "all" ? "Tất cả dịch vụ" : serviceSummaryData?.serviceSummaries.find(s => s.serviceId === selectedServiceId)?.serviceName}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>

      {/* Xu hướng theo thời gian */}
      <Card className="shadow-lg">
        <CardHeader className="border-b flex flex-row items-center justify-between">
          <CardTitle className="text-xl text-gray-800">
            Xu hướng {selectedServiceId !== "all" && serviceSummaryData?.serviceSummaries && (
              <span className="text-sm font-normal ml-1">
                - {serviceSummaryData.serviceSummaries.find((s) => s.serviceId === selectedServiceId)?.serviceName}
              </span>
            )}
          </CardTitle>
          <div className="flex space-x-2">
            <button 
              className={`px-3 py-1 text-sm rounded-md ${timeView === 'daily' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}
              onClick={() => setTimeView('daily')}
            >
              Theo ngày
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-md ${timeView === 'monthly' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}
              onClick={() => setTimeView('monthly')}
            >
              Theo tháng
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-[400px]">
            {trendChartData ? (
              <Line 
                data={trendChartData} 
                options={lineChartOptions} 
              />
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">Không có dữ liệu xu hướng</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Biểu đồ so sánh dịch vụ - Chỉ hiển thị khi có nhiều dịch vụ */}
      {serviceSummaryData?.serviceComparison && serviceSummaryData.serviceComparison.length > 1 && (
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <CardTitle className="text-xl text-gray-800">So sánh dịch vụ</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[500px]">
              {serviceSummaryData?.serviceComparison?.length ? (
                <Bar data={serviceBarData} options={getBarChartOptions("So sánh doanh thu và số đơn theo dịch vụ")} />
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">Không có dữ liệu về dịch vụ</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Doanh thu theo dịch vụ & Phân bổ dịch vụ */}
      {serviceSummaryData?.serviceComparison && serviceSummaryData.serviceComparison.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="text-xl text-gray-800">Doanh thu theo dịch vụ</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-[400px]">
                {serviceSummaryData?.serviceComparison?.length ? (
                  <Pie
                    data={serviceComparisonData}
                    options={{
                      ...pieChartOptionsWithLabels,
                      plugins: {
                        ...pieChartOptionsWithLabels.plugins,
                        title: { display: true, text: "Tỷ trọng doanh thu theo dịch vụ" },
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

          <Card className="shadow-lg">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="text-xl text-gray-800">Phân bổ dịch vụ (%)</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-[400px]">
                {serviceSummaryData?.serviceComparison?.length ? (
                  <Pie
                    data={servicePercentageData}
                    options={{
                      ...pieChartOptionsWithLabels,
                      plugins: {
                        ...pieChartOptionsWithLabels.plugins,
                        title: { display: true, text: "Phần trăm theo dịch vụ" },
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

      {/* Doanh thu & Số đơn theo trạng thái */}
      {statusBreakdownData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="text-xl text-gray-800">
                Doanh thu theo trạng thái
                {selectedServiceId !== "all" && serviceSummaryData?.serviceSummaries && (
                  <span className="text-sm font-normal ml-1">
                    - {serviceSummaryData.serviceSummaries.find((s) => s.serviceId === selectedServiceId)?.serviceName}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-[400px]">
                {statusBreakdownData.statusRevenueData.datasets[0].data.length ? (
                  <Pie
                    data={statusBreakdownData.statusRevenueData}
                    options={{
                      ...pieChartOptionsWithLabels,
                      plugins: {
                        ...pieChartOptionsWithLabels.plugins,
                        title: { display: true, text: "Doanh thu theo trạng thái (VND)" },
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

          <Card className="shadow-lg">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="text-xl text-gray-800">
                Số đơn theo trạng thái
                {selectedServiceId !== "all" && serviceSummaryData?.serviceSummaries && (
                  <span className="text-sm font-normal ml-1">
                    - {serviceSummaryData.serviceSummaries.find((s) => s.serviceId === selectedServiceId)?.serviceName}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-[400px]">
                {statusBreakdownData.statusCountData.datasets[0].data.length ? (
                  <Pie
                    data={statusBreakdownData.statusCountData}
                    options={{
                      ...pieChartOptionsWithLabels,
                      plugins: {
                        ...pieChartOptionsWithLabels.plugins,
                        title: { display: true, text: "Số đơn theo trạng thái" },
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
    </div>
  );
}