"use client";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const ContributionChartSkeleton = () => {
  const skeletonData = [{ value: 60 }, { value: 40 }];

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-24" />
      </div>

      <div className="flex gap-8">
        {/* Chart Section */}
        <div className="w-1/2 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={skeletonData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {skeletonData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? "#E5E7EB" : "#F3F4F6"}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend & Details Section */}
        <div className="w-1/2">
          {/* Total */}
          <div className="mb-6">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-8 w-48" />
          </div>

          {/* Members */}
          <div className="space-y-4">
            {[1, 2].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <Skeleton className="h-3 w-3 rounded-full" />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributionChartSkeleton;
