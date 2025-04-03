import React from "react";
import { Calendar, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { format, isEqual, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TOrderResponse } from "@/schema/order.schema";
import OrderDetail from "./OrderDetail";

export interface OrdersByDate {
  date: string;
  orders: TOrderResponse[];
  isOpen: boolean;
}

interface OrderDateGroupProps {
  dateGroup: OrdersByDate;
  toggleDateGroup: (date: string) => void;
}

const OrderDateGroup: React.FC<OrderDateGroupProps> = ({ 
  dateGroup, 
  toggleDateGroup 
}) => {
  // Format ngày thành chuỗi ví dụ: "03/04/2025 (Hôm nay) - 5 đơn"
  const formatDateHeader = (dateStr: string, ordersCount: number) => {
    const date = parseISO(dateStr);
    const today = new Date();
    
    // Kiểm tra xem ngày này có phải là ngày hôm nay
    const isToday = isEqual(
      new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      new Date(today.getFullYear(), today.getMonth(), today.getDate())
    );

    const formattedDate = format(date, "dd/MM/yyyy", { locale: vi });
    return `${formattedDate}${isToday ? " (Hôm nay)" : ""} - ${ordersCount} đơn`;
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div 
        className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
        onClick={() => toggleDateGroup(dateGroup.date)}
      >
        <h3 className="font-medium flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          {formatDateHeader(dateGroup.date, dateGroup.orders.length)}
        </h3>
        {dateGroup.isOpen ? (
          <ChevronUpIcon className="h-5 w-5" />
        ) : (
          <ChevronDownIcon className="h-5 w-5" />
        )}
      </div>
      
      {dateGroup.isOpen && (
        <ScrollArea className="max-h-72">
          <div className="divide-y">
            {dateGroup.orders.map((order) => (
              <OrderDetail key={order.id} order={order} />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default OrderDateGroup;