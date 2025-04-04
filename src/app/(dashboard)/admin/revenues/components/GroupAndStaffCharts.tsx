/* eslint-disable @typescript-eslint/no-explicit-any */
// GroupAndStaffCharts.tsx - Cập nhật để hiển thị tên nhân viên trong tooltip
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, Scatter } from "react-chartjs-2";
import { GroupComparisonData, SummaryByStaffData } from "@/apis/revenue";

interface GroupAndStaffChartsProps {
  groupComparisonData: GroupComparisonData | null;
  summaryByStaffData: SummaryByStaffData | null;
}

export function GroupAndStaffCharts({ groupComparisonData, summaryByStaffData }: GroupAndStaffChartsProps) {
  const hasGroupData = 
    groupComparisonData && 
    groupComparisonData.groupPerformanceData && 
    groupComparisonData.groupPerformanceData.length > 0;

  // Biểu đồ cột: So sánh doanh thu và số đơn theo nhóm (từ /group-comparison)
  const groupComparisonBarData = {
    labels: hasGroupData ? groupComparisonData.groupPerformanceData.map(item => item.groupName) : [],
    datasets: [
      {
        label: "Doanh thu (VND)",
        data: hasGroupData ? groupComparisonData.groupPerformanceData.map(item => item.revenue) : [],
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        yAxisID: 'y-revenue',
      },
      {
        label: "Số đơn",
        data: hasGroupData ? groupComparisonData.groupPerformanceData.map(item => item.orderCount) : [],
        backgroundColor: "rgba(239, 68, 68, 0.7)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 1,
        yAxisID: 'y-orders',
      },
    ],
  };

  const hasStaffData = 
    summaryByStaffData && 
    summaryByStaffData.staffComparison && 
    summaryByStaffData.staffComparison.length > 0;

  const staffRevenueVsOrderScatterData = {
    datasets: [
      {
        label: "Nhân viên",
        data: hasStaffData
          ? summaryByStaffData.staffComparison.map((item) => ({
              x: item.revenue, // Doanh thu trên trục x
              y: item.orderCount, // Số đơn trên trục y
              staffName: item.staffName, // Lưu tên nhân viên để hiển thị tooltip
            }))
          : [],
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "rgba(59, 130, 246, 1)",
        pointRadius: 8,
        pointHoverRadius: 10,
      },
    ],
  };

  const staffCompletionVsOrderScatterData = {
    datasets: [
      {
        label: "Nhân viên",
        data: hasStaffData
          ? summaryByStaffData.staffComparison.map((item) => ({
              x: item.completionRate, // Tỷ lệ hoàn thành trên trục x
              y: item.orderCount, // Số đơn trên trục y
              staffName: item.staffName, // Lưu tên nhân viên để hiển thị tooltip
            }))
          : [],
        backgroundColor: "rgba(239, 68, 68, 0.7)",
        borderColor: "rgba(239, 68, 68, 1)",
        pointRadius: 8,
        pointHoverRadius: 10,
      },
    ],
  };

  // Cấu hình hiển thị tên nhân viên trong tooltip
  const scatterOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const data = context.raw;
            return `${data.staffName} - Số đơn: ${data.y}, ${context.dataset.label === "Nhân viên" ? "Doanh thu: " + data.x.toLocaleString() + " VND" : "Tỷ lệ hoàn thành: " + data.x.toFixed(2) + "%"}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Doanh thu (VND)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Số đơn'
        }
      }
    }
  };

  const completionRateScatterOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const data = context.raw;
            return `${data.staffName} - Số đơn: ${data.y}, Tỷ lệ hoàn thành: ${data.x.toFixed(2)}%`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Tỷ lệ hoàn thành (%)'
        },
        min: 0,
        max: 100
      },
      y: {
        title: {
          display: true,
          text: 'Số đơn'
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Phần 1: Dữ liệu từ /group-comparison */}
      <Card className="shadow-lg">
        <CardHeader className="border-b bg-gray-50">
          <CardTitle className="text-xl text-gray-800">So sánh nhóm</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-[500px]">
            {hasGroupData ? (
              <Bar 
                data={groupComparisonBarData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    'y-revenue': {
                      type: 'linear',
                      position: 'left',
                      title: {
                        display: true,
                        text: 'Doanh thu (VND)'
                      }
                    },
                    'y-orders': {
                      type: 'linear',
                      position: 'right',
                      title: {
                        display: true,
                        text: 'Số đơn'
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
                <p className="text-gray-500">Không có dữ liệu về nhóm</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Phần 2: Dữ liệu từ /summary-by-staff */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle className="text-xl text-gray-800">Doanh thu vs Số đơn theo nhân viên</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[400px]">
              {hasStaffData ? (
                <Scatter 
                  data={staffRevenueVsOrderScatterData}
                  options={scatterOptions}
                />
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">Không có dữ liệu về nhân viên</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle className="text-xl text-gray-800">Tỷ lệ hoàn thành vs Số đơn theo nhân viên</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[400px]">
              {hasStaffData ? (
                <Scatter 
                  data={staffCompletionVsOrderScatterData}
                  options={completionRateScatterOptions}
                />
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">Không có dữ liệu về nhân viên</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}