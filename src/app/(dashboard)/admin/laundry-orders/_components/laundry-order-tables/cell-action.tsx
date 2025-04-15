"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { TOrderLaundryResponse } from "@/schema/VinLaudry/laundry-order";
import { Eye } from "lucide-react";

interface CellActionProps {
  data: TOrderLaundryResponse;
}

export const LaundryOrderCellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => router.push(`/admin/laundry-orders/${data.id}`)}
      className="text-blue-500 border-blue-200 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 flex items-center gap-1 px-3 py-1 text-xs"
    >
      <Eye className="w-3 h-3" />
      Xem chi tiết
    </Button>
  );
};
