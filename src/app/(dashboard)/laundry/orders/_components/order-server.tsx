"use server";

import { getAllOrders } from "@/apis/laudry/order";
import OrderTable from "@/app/(dashboard)/laundry/orders/_components/order-table/order-table";
import { searchParamsCache } from "@/lib/searchparams";

const OrderServer = async () => {
  const page = searchParamsCache.get("page") || "1";
  const search = searchParamsCache.get("search");
  const size = searchParamsCache.get("size") || "1000";

  const filters = {
    page,
    size,
    ...(search && { search }),
  };

  const orderResponse = await getAllOrders(filters);
  const orderPayload = orderResponse.payload;

  return (
    <OrderTable
      data={orderPayload.items}
      totalItems={orderPayload.totalPages}
    />
  );
};

export default OrderServer;