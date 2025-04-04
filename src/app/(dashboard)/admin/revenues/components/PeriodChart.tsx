/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";

interface PeriodChartProps {
  periodData: any[];
  groupBy: "day" | "week" | "month" | "year";
}

export function PeriodChart({ periodData, groupBy }: PeriodChartProps) {
  const isPeriodDataValid = Array.isArray(periodData) && periodData.length > 0;

  // Format labels to be more readable based on groupBy
  const formatLabel = (period: string) => {
    if (groupBy === "day") {
      // Assuming period is in format YYYY-MM-DD
      const date = new Date(period);
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    }
    if (groupBy === "week") {
      // Assuming period is in format YYYY-Www where ww is the week number
      const parts = period.split('-W');
      return `Tuần ${parts[1]} năm ${parts[0]}`;
    }
    if (groupBy === "month") {
      // Assuming period is in format YYYY-MM
      const parts = period.split('-');
      const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 
                      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
      return `${months[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
    }
    return period;
  };

  const periodBarData = {
    labels: isPeriodDataValid ? periodData.map(item => formatLabel(item.period)) : [],
    datasets: [
      {
        label: "Doanh thu (VND)",
        data: isPeriodDataValid ? periodData.map(item => item.totalRevenue) : [],
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        label: "Số đơn",
        data: isPeriodDataValid ? periodData.map(item => item.totalOrders) : [],
        backgroundColor: "rgba(239, 68, 68, 0.7)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 1,
        yAxisID: 'y1',
      },
    ],
  };

  
  const chartTitle = `So sánh doanh thu và số đơn theo ${
    groupBy === "day" ? "ngày" : 
    groupBy === "week" ? "tuần" : 
    groupBy === "month" ? "tháng" : "năm"
  }`;

  return (
    <Card className="shadow-sm bg-white mt-6">
      <CardHeader className="border-b bg-gray-50 py-3 px-4">
        <CardTitle className="text-lg text-gray-800 font-medium">{chartTitle}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-[400px] relative">
          {isPeriodDataValid ? (
            <Bar data={periodBarData}/>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">Không có dữ liệu trong khoảng thời gian này</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}