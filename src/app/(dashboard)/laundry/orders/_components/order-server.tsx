"use server";

import { getAllOrders } from "@/apis/laudry/order";
import OrderTable from "@/app/(dashboard)/laundry/orders/_components/order-table/OrderTable";
import { searchParamsCache } from "@/lib/searchparams";

const OrderServer = async () => {
  const page = searchParamsCache.get("page") || "1";
  const search = searchParamsCache.get("search");
  const size = searchParamsCache.get("size") || "10";
  const status = searchParamsCache.get("status");
  const startDate = searchParamsCache.get("startDate");
  const endDate = searchParamsCache.get("endDate");

  const filters = {
    page,
    size,
    ...(search && { search }),
    ...(status && status !== "all" && { status }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  };

  const orderResponse = await getAllOrders(filters);
  const orderPayload = orderResponse.payload;

  return (
    <OrderTable
      data={orderPayload.items}
      totalItems={orderPayload.total}
      page={Number(page)}
      pageSize={Number(size)}
      totalPages={orderPayload.totalPages}
      status={status || "all"}
      dateRange={
        startDate
          ? { from: new Date(startDate), to: endDate ? new Date(endDate) : undefined }
          : undefined
      }
    />
  );
};

export default OrderServer;