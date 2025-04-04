/* eslint-disable @typescript-eslint/no-explicit-any */
import { SummaryData } from "@/app/(dashboard)/admin/revenues/chart-config/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line } from "react-chartjs-2";

interface DailyChartProps {
  summaryData: SummaryData | null;
  periodData: any[];
  groupBy: "day" | "week" | "month" | "year";
}

export function DailyChart({ summaryData}: DailyChartProps) {
  const isDailyTrendValid = Array.isArray(summaryData?.dailyTrend) && summaryData?.dailyTrend.length > 0;
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  const dailyLineData = {
    labels: isDailyTrendValid ? summaryData?.dailyTrend.map(day => formatDate(day.date)) : [],
    datasets: [
      {
        label: "Doanh thu (VND)",
        data: isDailyTrendValid ? summaryData?.dailyTrend.map(day => day.revenue) : [],
        borderColor: "rgba(16, 185, 129, 1)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderWidth: 2,
        tension: 0.3,
        fill: true,
        yAxisID: 'y',
      },
      {
        label: "Số đơn",
        data: isDailyTrendValid ? summaryData?.dailyTrend.map(day => day.orderCount) : [],
        borderColor: "rgba(245, 158, 11, 1)",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        borderWidth: 2,
        tension: 0.3,
        fill: true,
        yAxisID: 'y1',
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Doanh thu (VND)'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Số đơn'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 6
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (context.datasetIndex === 0) {
                label += new Intl.NumberFormat('vi-VN').format(context.parsed.y) + ' VND';
              } else {
                label += context.parsed.y + ' đơn';
              }
            }
            return label;
          }
        }
      }
    },
  };

  // Tính toán số liệu tổng hợp
  const totalDays = isDailyTrendValid ? summaryData?.dailyTrend.length : 0;
  const totalRevenue = isDailyTrendValid ? summaryData?.dailyTrend.reduce((sum, day) => sum + day.revenue, 0) : 0;
  const totalOrders = isDailyTrendValid ? summaryData?.dailyTrend.reduce((sum, day) => sum + day.orderCount, 0) : 0;
  
  // Tìm ngày có doanh thu cao nhất
  let maxRevenueDay = null;
  let maxRevenueAmount = 0;
  
  if (isDailyTrendValid && summaryData?.dailyTrend) {
    summaryData.dailyTrend.forEach(day => {
      if (day.revenue > maxRevenueAmount) {
        maxRevenueAmount = day.revenue;
        maxRevenueDay = day.date;
      }
    });
  }

  return (
    <Card className="shadow-sm bg-white">
      <CardHeader className="border-b bg-gray-50 py-3 px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <CardTitle className="text-lg text-gray-800 font-medium">Biểu đồ xu hướng theo ngày</CardTitle>
          {isDailyTrendValid && maxRevenueDay && (
            <div className="text-sm text-gray-600 mt-2 sm:mt-0">
              <span className="font-medium">Ngày doanh thu cao nhất:</span>{' '}
              {formatDate(maxRevenueDay)} ({new Intl.NumberFormat('vi-VN').format(maxRevenueAmount)} VND)
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-[400px] relative">
          {isDailyTrendValid ? (
            <Line data={dailyLineData} options={chartOptions} />
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">Không có dữ liệu xu hướng ngày</p>
            </div>
          )}
        </div>
        
        {isDailyTrendValid && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Khoảng thời gian</p>
              <p className="text-lg font-bold">
                {formatDate(summaryData?.fromDate || '')} - {formatDate(summaryData?.toDate || '')}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Doanh thu trung bình / ngày</p>
              <p className="text-lg font-bold">
                {new Intl.NumberFormat('vi-VN').format(totalDays ? Math.round(totalRevenue / totalDays) : 0)} VND
              </p>
            </div>
            <div className="bg-amber-50 p-3 rounded-lg">
              <p className="text-sm text-amber-600 font-medium">Số đơn trung bình / ngày</p>
              <p className="text-lg font-bold">
                {totalDays ? (totalOrders / totalDays).toFixed(1) : 0} đơn
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}