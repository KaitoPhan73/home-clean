"use client"

// pages/revenue.tsx
import { useState } from "react";
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
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Đăng ký các thành phần Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

// Dữ liệu cứng cho Tab 1: Line Chart (Số đơn và Balance theo ngày)
const dailyData: ChartData<"line", number[], string> = {
  labels: ["2025-03-01", "2025-03-02", "2025-03-03", "2025-03-04", "2025-03-05"],
  datasets: [
    {
      label: "Số đơn",
      data: [5, 8, 6, 7, 10],
      borderColor: "#3b82f6",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      fill: true,
      tension: 0.4,
      yAxisID: "y1",
      pointRadius: 4,
      pointHoverRadius: 6,
    },
    {
      label: "Balance",
      data: [500, 560, 605, 650, 675],
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

// Dữ liệu cứng cho Tab 2: Pie Chart (Doanh thu điểm và Số đơn theo dịch vụ)
const serviceData = {
  labels: ["Dọn dẹp nhà cửa", "Chuyển nhà", "Lau dọn toilet", "Sửa máy lạnh"],
  datasets: [
    {
      label: "Doanh thu điểm",
      data: [360, 240, 450, 150],
      unit: "points",
    },
    {
      label: "Số đơn",
      data: [12, 8, 15, 5],
      unit: "orders",
    },
  ],
};

// Cấu hình cho Line Chart (Tab 1)
const lineChartOptions: ChartOptions<"line"> = {
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
      text: "Số đơn và Balance theo ngày (Tháng 3/2025)",
      font: { size: 16, weight: "bold" },
      padding: { top: 10, bottom: 20 },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleFont: { size: 12 },
      bodyFont: { size: 12 },
      padding: 8,
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
        text: "Balance (points)",
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
};

// Cấu hình cho Pie Chart (Tab 2)
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
    },
  },
};

export default function RevenuePage() {
  const [activeTab, setActiveTab] = useState<"daily" | "services">("daily");

  // Tách dữ liệu Pie Chart cho hai biểu đồ
  const pointPieData: ChartData<"pie", number[], string> = {
    labels: serviceData.labels,
    datasets: [
      {
        label: "Doanh thu điểm",
        data: serviceData.datasets[0].data,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        hoverOffset: 8,
        borderWidth: 1,
        borderColor: "#fff",
      },
    ],
  };

  const orderPieData: ChartData<"pie", number[], string> = {
    labels: serviceData.labels,
    datasets: [
      {
        label: "Số đơn",
        data: serviceData.datasets[1].data,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        hoverOffset: 8,
        borderWidth: 1,
        borderColor: "#fff",
      },
    ],
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Trang Doanh Thu</h1>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "daily" | "services")} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 rounded-lg p-1">
          <TabsTrigger value="daily" className="py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Theo ngày
          </TabsTrigger>
          <TabsTrigger value="services" className="py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Theo dịch vụ
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Line Chart - Số đơn và Balance theo ngày */}
        <TabsContent value="daily">
          <Card className="shadow-lg">
            <CardHeader className="border-b">
              <CardTitle className="text-xl text-gray-700">Số đơn và Balance theo ngày</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[350px] w-full">
                <Line data={dailyData} options={lineChartOptions} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Pie Chart - Doanh thu điểm và Số đơn theo dịch vụ */}
        <TabsContent value="services">
          <Card className="shadow-lg">
            <CardHeader className="border-b">
              <CardTitle className="text-xl text-gray-700">Doanh thu điểm và Số đơn theo dịch vụ</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 justify-center">
                <div className="h-[300px] w-full md:w-1/2 flex flex-col items-center">
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">Doanh thu điểm</h3>
                  <Pie
                    data={pointPieData}
                    options={{
                      ...pieChartOptions,
                      plugins: {
                        ...pieChartOptions.plugins,
                        title: { display: true, text: "Doanh thu điểm (points)", font: { size: 14 } },
                      },
                    }}
                  />
                </div>
                <div className="h-[300px] w-full md:w-1/2 flex flex-col items-center">
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">Số đơn</h3>
                  <Pie
                    data={orderPieData}
                    options={{
                      ...pieChartOptions,
                      plugins: {
                        ...pieChartOptions.plugins,
                        title: { display: true, text: "Số đơn (orders)", font: { size: 14 } },
                      },
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}