"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface TransactionTypeData {
  month: string;
  Deposit: number;
  Spending: number;
  Refund: number;
  Withdraw: number;
}

const chartConfig = {
  Deposit: {
    label: "Deposit",
    color: "hsl(var(--chart-1))",
  },
  Spending: {
    label: "Spending",
    color: "hsl(var(--chart-2))",
  },
  Refund: {
    label: "Refund",
    color: "hsl(var(--chart-3))",
  },
  Withdraw: {
    label: "Withdraw",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

// Tìm giá trị lớn nhất trong tất cả các loại giao dịch
const findMaxValue = (data: TransactionTypeData[]): number => {
  let max = 0;
  data.forEach((entry) => {
    Object.keys(entry).forEach((key) => {
      if (
        key !== "month" &&
        typeof entry[key as keyof TransactionTypeData] === "number"
      ) {
        max = Math.max(max, entry[key as keyof TransactionTypeData] as number);
      }
    });
  });
  // Làm tròn lên đến hàng trăm gần nhất để có trục Y đẹp hơn
  return Math.ceil(max / 100) * 100;
};

const TransactionTypeChart = ({ data }: { data?: TransactionTypeData[] }) => {
  const maxValue = findMaxValue(data || []);
  const reversedData = [...(data || [])].reverse();

  return (
    <Card className="w-full overflow-hidden  h-full">
      <CardHeader>
        <CardTitle>Biểu đồ giao dịch</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              accessibilityLayer
              data={reversedData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[0, maxValue]}
                allowDecimals={false}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              {Object.keys(chartConfig).map((key) => (
                <Line
                  key={key}
                  dataKey={key}
                  type="monotone"
                  stroke={chartConfig[key as keyof typeof chartConfig].color}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TransactionTypeChart;
