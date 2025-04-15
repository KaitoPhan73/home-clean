/* eslint-disable @typescript-eslint/no-unused-vars */
import { searchParamsCache } from "@/lib/searchparams";
import { getAllOrders } from "@/apis/laudry/order";
import LaundryOrderManagement from "@/app/(dashboard)/admin/laundry-orders/_components/laundry-order-tables/LaundryOrderManagement";
import { redirect } from "next/navigation";

type AllowedSearchParam = "page" | "size" | "status" | "search" | "q" | "gender" | "categories" | "types" | "areaId";

const getSearchParam = (key: AllowedSearchParam): string | null => {
  const value = searchParamsCache.get(key);
  return value ? value.toString() : null;
};

const LaundryOrderTable = async () => {
  const page = (getSearchParam("page") || "1").toString();
  const search: string | null = getSearchParam("search");
  const size: string = (getSearchParam("size") || "1000").toString();
  const status: string | null = getSearchParam("status");

  const urlParams = new URLSearchParams(
    Object.fromEntries(
      Object.entries(searchParamsCache.all())
        .filter(([_, value]) => value !== null)
        .map(([key, value]) => [key, String(value)])
    )
  );
  const from: string | null = urlParams.get("from");
  const to: string | null = urlParams.get("to");

  if (!getSearchParam("size")) {
    const params = new URLSearchParams();
    params.set("size", size);
    params.set("page", page);
    if (search) params.set("search", search);
    if (status && status !== "all") params.set("status", status);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    redirect(`/admin/laundry-orders?${params.toString()}`);
  }

  const filters: Record<string, string> = {
    page,
    size,
  };

  if (search) filters.search = search;
  if (status && status !== "all") filters.status = status;
  if (from) filters.from = from;
  if (to) filters.to = to;

  const laundryOrderResponse = await getAllOrders(filters);
  const laundryOrderPayload = laundryOrderResponse.payload;

  return (
    <div>
      <LaundryOrderManagement
        orders={laundryOrderPayload.items || []}
        total={laundryOrderPayload.total || 0}
        totalPages={laundryOrderPayload.totalPages || 1}
        size={Number(size)}
        currentPage={Number(page)}
      />
    </div>
  );
};

export default LaundryOrderTable;