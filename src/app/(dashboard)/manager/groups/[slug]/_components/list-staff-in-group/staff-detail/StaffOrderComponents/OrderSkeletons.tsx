import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PackageIcon } from "lucide-react";

// Loading skeleton
export const OrderSkeletons: React.FC = () => {
  return (
    <div className="space-y-4">
      {Array(3).fill(0).map((_, index) => (
        <div key={index} className="mb-4 p-4 border rounded-lg">
          <div className="flex justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="mt-2">
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-3/4 mt-2" />
          </div>
          <div className="flex justify-between mt-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Empty state
export const NoOrders: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
      <PackageIcon className="h-12 w-12 mb-4 opacity-50" />
      <p className="text-lg font-medium">Không tìm thấy đơn hàng nào</p>
    </div>
  );
};