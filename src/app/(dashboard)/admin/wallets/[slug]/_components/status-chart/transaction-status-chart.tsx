"use client";

import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface TransactionStatusData {
  status: string;
  value: number;
}

const chartConfig = {
  Pending: {
    label: "Đang xử lý",
    color: "hsl(45 93% 47%)", // yellow
  },
  Success: {
    label: "Thành công",
    color: "hsl(142 72% 29%)", // green
  },
  Failed: {
    label: "Thất bại",
    color: "hsl(0 84% 60%)", // red
  },
} satisfies ChartConfig;

const TransactionStatusChart = ({
  data,
}: {
  data: TransactionStatusData[];
}) => {
  const totalTransactions = data.reduce((acc, curr) => acc + curr.value, 0);
  const chartData = data.map((item) => ({
    ...item,
    fill: chartConfig[item.status as keyof typeof chartConfig].color,
  }));

  return (
    <Card className="flex flex-col  h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Trạng thái giao dịch</CardTitle>
        <CardDescription>Phân bố trạng thái tổng quan</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalTransactions.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Giao dịch
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Tỷ lệ thành công:{" "}
          {totalTransactions === 0
            ? "100.0"
            : (
                ((data.find((d) => d.status === "Success")?.value || 0) /
                  totalTransactions) *
                100
              ).toFixed(1)}
          %
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Tổng số giao dịch đã xử lý
        </div>
      </CardFooter>
    </Card>
  );
};

export default TransactionStatusChart;
