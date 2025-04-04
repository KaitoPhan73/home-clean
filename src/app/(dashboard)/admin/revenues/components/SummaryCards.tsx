import { SummaryData } from "@/app/(dashboard)/admin/revenues/chart-config/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Doughnut } from "react-chartjs-2";

interface SummaryCardsProps {
  summaryData: SummaryData | null;
}

export function SummaryCards({ summaryData }: SummaryCardsProps) {
  // Prepare status data for the doughnut chart
  const statusData = {
    labels:
      summaryData?.ordersByStatus?.map((item) =>
        item.status === "InProgress"
          ? "Đang xử lý"
          : item.status === "Completed"
          ? "Hoàn thành"
          : item.status === "Cancelled"
          ? "Đã hủy"
          : item.status === "Pending"
          ? "Chờ xử lý"
          : item.status === "Accepted"
          ? "Đã nhận"
          : item.status
      ) || [],
    datasets: [
      {
        data: summaryData?.ordersByStatus?.map((item) => item.count) || [],
        backgroundColor: [
          "rgba(54, 162, 235, 0.7)", // InProgress - Blue
          "rgba(75, 192, 192, 0.7)", // Completed - Green
          "rgba(255, 99, 132, 0.7)", // Cancelled - Red
          "rgba(255, 206, 86, 0.7)", // Pending - Yellow
          "rgba(153, 102, 255, 0.7)", // Accepted - Purple
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
      },
    },
  };

  // Calculate daily average
  const days = summaryData?.dailyTrend?.length || 1;
  const dailyAverage = (summaryData?.totalRevenue || 0) / days;

  return (
    <div className="grid grid-cols-1 gap-6 mb-6">
      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm bg-white">
          <CardHeader className="border-b bg-gray-50 py-3 px-4">
            <CardTitle className="text-lg text-gray-800 font-medium">
              Tổng số đơn
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-blue-600">
              {summaryData?.totalOrders || 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">Đơn hàng</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm bg-white">
          <CardHeader className="border-b bg-gray-50 py-3 px-4">
            <CardTitle className="text-lg text-gray-800 font-medium">
              Tổng doanh thu
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-green-600">
              {new Intl.NumberFormat("vi-VN").format(
                summaryData?.totalRevenue || 0
              )}
            </p>
            <p className="text-sm text-gray-500 mt-1">VND</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm bg-white">
          <CardHeader className="border-b bg-gray-50 py-3 px-4">
            <CardTitle className="text-lg text-gray-800 font-medium">
              Giá trị đơn TB
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-purple-600">
              {new Intl.NumberFormat("vi-VN").format(
                Math.round(summaryData?.averageOrderValue || 0)
              )}
            </p>
            <p className="text-sm text-gray-500 mt-1">VND / đơn</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm bg-white">
          <CardHeader className="border-b bg-gray-50 py-3 px-4">
            <CardTitle className="text-lg text-gray-800 font-medium">
              Doanh thu TB / ngày
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-orange-600">
              {new Intl.NumberFormat("vi-VN").format(Math.round(dailyAverage))}
            </p>
            <p className="text-sm text-gray-500 mt-1">VND / ngày</p>
          </CardContent>
        </Card>
      </div>

      {/* Status breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm bg-white md:col-span-1">
          <CardHeader className="border-b bg-gray-50 py-3 px-4">
            <CardTitle className="text-lg text-gray-800 font-medium">
              Đơn theo trạng thái
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[280px] flex items-center justify-center">
              {summaryData?.ordersByStatus &&
              summaryData.ordersByStatus.length > 0 ? (
                <Doughnut data={statusData} options={doughnutOptions} />
              ) : (
                <p className="text-gray-500">Không có dữ liệu</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm bg-white md:col-span-2">
          <CardHeader className="border-b bg-gray-50 py-3 px-4">
            <CardTitle className="text-lg text-gray-800 font-medium">
              Chi tiết theo trạng thái
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Trạng thái
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Số lượng
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Doanh thu
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      % Tổng
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {summaryData?.ordersByStatus?.map((status, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {status.status === "InProgress"
                          ? "Đang xử lý"
                          : status.status === "Completed"
                          ? "Hoàn thành"
                          : status.status === "Cancelled"
                          ? "Đã hủy"
                          : status.status === "Pending"
                          ? "Chờ xử lý"
                          : status.status === "Accepted"
                          ? "Đã nhận"
                          : status.status}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {status.count} (
                        {Math.round(
                          (status.count / (summaryData?.totalOrders || 1)) * 100
                        )}
                        %)
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {new Intl.NumberFormat("vi-VN").format(status.revenue)}{" "}
                        VND
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {Math.round(
                          (status.revenue / (summaryData?.totalRevenue || 1)) *
                            100
                        )}
                        %
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
