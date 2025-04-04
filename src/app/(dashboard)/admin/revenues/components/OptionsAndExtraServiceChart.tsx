// AdditionalServicesTab.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
import { getExtraServiceUsage, getOptionUsage } from "@/apis/revenue";
import { ExtraServiceData, OptionUsageData } from "@/apis/revenue";

interface AdditionalServicesTabProps {
  dateFrom: Date;
  dateTo: Date;
  selectedGroupId: string;
}

export function AdditionalServicesTab({ dateFrom, dateTo, selectedGroupId }: AdditionalServicesTabProps) {
  const [extraServiceData, setExtraServiceData] = useState<ExtraServiceData | null>(null);
  const [optionUsageData, setOptionUsageData] = useState<OptionUsageData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const fromDateStr = dateFrom.toISOString().split("T")[0];
        const toDateStr = dateTo.toISOString().split("T")[0];
        const groupIdParam = selectedGroupId !== "all_groups" ? selectedGroupId : undefined;

        const [extraServiceResponse, optionUsageResponse] = await Promise.all([
          getExtraServiceUsage(fromDateStr, toDateStr, groupIdParam),
          getOptionUsage(fromDateStr, toDateStr, groupIdParam),
        ]);

        setExtraServiceData(extraServiceResponse.payload as ExtraServiceData);
        setOptionUsageData(optionUsageResponse.payload as OptionUsageData);
        setError(null);
      } catch (error) {
        console.error("Error fetching additional services data:", error);
        setError("Đã xảy ra lỗi khi tải dữ liệu dịch vụ bổ sung. Vui lòng thử lại sau.");
        setExtraServiceData(null);
        setOptionUsageData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dateFrom, dateTo, selectedGroupId]);

  // Dữ liệu biểu đồ cho Dịch vụ bổ sung
  const extraServiceChartData = {
    labels: extraServiceData?.extraServiceUsage.map(item => item.extraServiceName) || [],
    datasets: [
      {
        label: "Số đơn hàng",
        data: extraServiceData?.extraServiceUsage.map(item => item.orderCount) || [],
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        yAxisID: 'y-orders',
      },
      {
        label: "Doanh thu (VND)",
        data: extraServiceData?.extraServiceUsage.map(item => item.revenue) || [],
        backgroundColor: "rgba(239, 68, 68, 0.7)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 1,
        yAxisID: 'y-revenue',
      }
    ],
  };

  // Dữ liệu biểu đồ cho Tỷ lệ gắn kèm dịch vụ bổ sung
  const extraServiceAttachRateChartData = {
    labels: extraServiceData?.extraServiceUsage.map(item => item.extraServiceName) || [],
    datasets: [
      {
        label: "Tỷ lệ gắn kèm (%)",
        data: extraServiceData?.extraServiceUsage.map(item => item.attachRate) || [],
        backgroundColor: "rgba(16, 185, 129, 0.7)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 1,
      }
    ],
  };

  // Dữ liệu biểu đồ cho Tùy chọn
  const optionChartData = {
    labels: optionUsageData?.optionUsage.map(item => item.optionName) || [],
    datasets: [
      {
        label: "Số đơn hàng",
        data: optionUsageData?.optionUsage.map(item => item.orderCount) || [],
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        yAxisID: 'y-orders',
      },
      {
        label: "Doanh thu (VND)",
        data: optionUsageData?.optionUsage.map(item => item.revenue) || [],
        backgroundColor: "rgba(239, 68, 68, 0.7)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 1,
        yAxisID: 'y-revenue',
      }
    ],
  };

  // Dữ liệu biểu đồ cho Tỷ lệ gắn kèm Tùy chọn
  const optionAttachRateChartData = {
    labels: optionUsageData?.optionUsage.map(item => item.optionName) || [],
    datasets: [
      {
        label: "Tỷ lệ gắn kèm (%)",
        data: optionUsageData?.optionUsage.map(item => item.attachRate) || [],
        backgroundColor: "rgba(16, 185, 129, 0.7)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 1,
      }
    ],
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="shadow-lg">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle className="text-xl text-gray-800">Tổng quan dịch vụ bổ sung</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Tổng số đơn hàng</p>
                <p className="text-2xl font-bold text-blue-600">{extraServiceData?.totalOrders || 0}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Đơn có dịch vụ bổ sung</p>
                <p className="text-2xl font-bold text-green-600">{extraServiceData?.ordersWithExtraServices || 0}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg col-span-2">
                <p className="text-sm text-gray-600">Tỷ lệ gắn kèm dịch vụ bổ sung</p>
                <p className="text-2xl font-bold text-purple-600">{extraServiceData?.extraServiceAttachRate.toFixed(2) || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle className="text-xl text-gray-800">Tổng quan tùy chọn</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Tổng số đơn hàng</p>
                <p className="text-2xl font-bold text-blue-600">{optionUsageData?.totalOrders || 0}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Đơn có tùy chọn</p>
                <p className="text-2xl font-bold text-green-600">{optionUsageData?.ordersWithOptions || 0}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg col-span-2">
                <p className="text-sm text-gray-600">Tỷ lệ gắn kèm tùy chọn</p>
                <p className="text-2xl font-bold text-purple-600">{optionUsageData?.optionAttachRate.toFixed(2) || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle className="text-xl text-gray-800">Số đơn & Doanh thu theo dịch vụ bổ sung</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-80">
              {extraServiceData && extraServiceData.extraServiceUsage.length > 0 ? (
                <Bar
                  data={extraServiceChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      'y-orders': {
                        type: 'linear',
                        position: 'left',
                        title: {
                          display: true,
                          text: 'Số đơn'
                        }
                      },
                      'y-revenue': {
                        type: 'linear',
                        position: 'right',
                        title: {
                          display: true,
                          text: 'Doanh thu (VND)'
                        },
                        grid: {
                          drawOnChartArea: false
                        }
                      }
                    }
                  }}
                />
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">Không có dữ liệu dịch vụ bổ sung</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle className="text-xl text-gray-800">Tỷ lệ gắn kèm dịch vụ bổ sung</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-80">
              {extraServiceData && extraServiceData.extraServiceUsage.length > 0 ? (
                <Bar
                  data={extraServiceAttachRateChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    scales: {
                      x: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                          display: true,
                          text: 'Tỷ lệ gắn kèm (%)'
                        }
                      }
                    }
                  }}
                />
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">Không có dữ liệu tỷ lệ gắn kèm</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card className="shadow-lg">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle className="text-xl text-gray-800">Số đơn & Doanh thu theo tùy chọn</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-80">
              {optionUsageData && optionUsageData.optionUsage.length > 0 ? (
                <Bar
                  data={optionChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      'y-orders': {
                        type: 'linear',
                        position: 'left',
                        title: {
                          display: true,
                          text: 'Số đơn'
                        }
                      },
                      'y-revenue': {
                        type: 'linear',
                        position: 'right',
                        title: {
                          display: true,
                          text: 'Doanh thu (VND)'
                        },
                        grid: {
                          drawOnChartArea: false
                        }
                      }
                    }
                  }}
                />
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">Không có dữ liệu tùy chọn</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle className="text-xl text-gray-800">Tỷ lệ gắn kèm tùy chọn</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-80">
              {optionUsageData && optionUsageData.optionUsage.length > 0 ? (
                <Bar
                  data={optionAttachRateChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    scales: {
                      x: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                          display: true,
                          text: 'Tỷ lệ gắn kèm (%)'
                        }
                      }
                    }
                  }}
                />
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">Không có dữ liệu tỷ lệ gắn kèm</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}