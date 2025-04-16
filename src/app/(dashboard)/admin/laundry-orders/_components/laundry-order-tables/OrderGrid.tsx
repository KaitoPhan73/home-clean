import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, XCircle } from "lucide-react";
import { TOrderLaundryResponse } from "@/schema/VinLaudry/laundry-order";
import { OrderCard } from "./OrderCard";
import { StatusConfig } from "@/app/(dashboard)/admin/laundry-orders/_components/laundry-order-tables/StatusSidebar";

export type OrderGridProps = {
  filteredOrders: TOrderLaundryResponse[];
  displayCount: number;
  activeTab: string;
  statusConfig: StatusConfig;
  onLoadMore: () => void;
};

export const OrderGrid = ({
  filteredOrders,
  displayCount,
  activeTab,
  statusConfig,
  onLoadMore,
}: OrderGridProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100">
            {statusConfig[activeTab as keyof typeof statusConfig].icon || (
              <XCircle size={20} />
            )}
          </div>
          <p className="mt-2 text-sm">Không có đơn hàng nào</p>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.slice(0, displayCount).map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
          {filteredOrders.length > displayCount && (
            <div className="flex justify-center mt-6">
              <Button
                onClick={onLoadMore}
                variant="outline"
                className="flex items-center gap-1 px-4 py-2 text-sm"
              >
                Xem thêm ({filteredOrders.length - displayCount} đơn hàng còn lại)
                <ChevronDown size={16} />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};