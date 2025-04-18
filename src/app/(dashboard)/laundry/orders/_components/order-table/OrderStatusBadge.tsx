"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { statusConfig } from "@/app/(dashboard)/laundry/orders/_components/order-table/statusConfig";

const OrderStatusBadge = ({ status }: { status: string }) => {
  const statusInfo = statusConfig[status as keyof typeof statusConfig] || statusConfig.Draft;

  return (
    <Badge
      variant="outline"
      className={`${statusInfo.bgColor} py-1.5 px-3 flex items-center gap-1.5 rounded-md justify-center`}
    >
      {statusInfo.icon}
      <span className="font-medium">{statusInfo.label}</span>
    </Badge>
  );
};

export default OrderStatusBadge;