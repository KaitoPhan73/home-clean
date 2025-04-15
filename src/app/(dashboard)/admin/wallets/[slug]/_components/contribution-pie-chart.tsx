/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { DataTableSelect } from "@/components/table/data-table-select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TContributionResponse } from "@/types/wallet";
import { Coins } from "lucide-react";
import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Sector,
} from "recharts";
import { useWalletDetailFilters } from "./use-wallet-detail-filters";
import { formatNumberWithDot } from "@/lib/formatter";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

type TProps = {
  data: TContributionResponse;
};

// Custom Active Shape
const renderActiveShape = ({
  cx,
  cy,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
  ...props
}: any) => {
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        {...props}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 12}
        outerRadius={outerRadius + 25}
        fill={fill}
      />
    </g>
  );
};

const ContributionPieChart = ({ data }: TProps) => {
  const { days, setDays, setPage } = useWalletDetailFilters();
  // Tìm index của member có percentage cao nhất
  const activeIndex = useMemo(() => {
    const maxPercentage = Math.max(...data.members.map((m) => m.percentage));
    return data.members.findIndex((m) => m.percentage === maxPercentage);
  }, [data.members]);
  const dateOptions = [
    { label: "7 ngày gần nhất", value: "7" },
    { label: "14 ngày gần nhất", value: "14" },
    { label: "21 ngày gần nhất", value: "21" },
    { label: "28 ngày gần nhất", value: "28" },
  ];
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Đóng góp</CardTitle>
            <CardDescription>Danh sách thành viên</CardDescription>
          </div>
          <DataTableSelect
            selectKey="days"
            selectValue={days}
            setSelectValue={setDays}
            setPage={setPage}
            options={dateOptions}
            className="w-48"
            placeholder="Chọn thời gian"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-8">
          <div className="w-1/2 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.members}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="contribution"
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                >
                  {data.members.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => (
                    <div
                      className={`inline-flex items-center gap-1 text-green-500`}
                    >
                      <Coins />
                      <span>{formatNumberWithDot(value)}</span>
                    </div>
                  )}
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-1/2">
            <div className="mb-4">
              <div className="text-sm text-gray-500">Tổng đóng góp</div>
              <div className="text-xl font-semibold inline-flex gap-2 text-green-500">
                <Coins />
                <span>{formatNumberWithDot(data.totalContribution)}</span>
              </div>
            </div>

            <div className="space-y-4">
              {data.members.map((member, index) => (
                <div
                  key={member.name}
                  className={`flex items-center gap-3 ${
                    index === activeIndex
                      ? "scale-105 transition-transform"
                      : ""
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      index === activeIndex ? "ring-2 ring-offset-2" : ""
                    }`}
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span
                        className={`text-sm font-medium ${
                          index === activeIndex ? "text-primary" : ""
                        }`}
                      >
                        {member.name}
                      </span>
                      <span
                        className={`text-sm ${
                          index === activeIndex ? "text-primary" : ""
                        }`}
                      >
                        {member.percentage}%
                      </span>
                    </div>
                    <div
                      className={`flex gap-1 text-sm ${
                        index === activeIndex ? "text-primary" : ""
                      }`}
                    >
                      <Coins />
                      <span>{formatNumberWithDot(member.contribution)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContributionPieChart;
