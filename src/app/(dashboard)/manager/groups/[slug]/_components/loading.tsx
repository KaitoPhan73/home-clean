import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export const StaffTablesSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Main staff list skeleton - 70% width */}
      <div className="w-full md:w-[70%]">
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <CardTitle>
                <Skeleton className="h-6 w-48" />
              </CardTitle>
              <Badge variant="outline" className="px-4 py-2">
                <Skeleton className="h-4 w-16" />
              </Badge>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Skeleton className="h-10 w-full sm:w-64" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-full sm:w-[180px]" />
                <Skeleton className="h-10 w-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between space-x-4 py-4 border-b"
                  >
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ready staff list skeleton - 30% width */}
      <div className="w-full md:w-[30%]">
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-40" />
              <Badge variant="secondary" className="px-3 py-1">
                <Skeleton className="h-4 w-8" />
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-3 py-3 border-b"
                  >
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StaffTablesSkeleton;