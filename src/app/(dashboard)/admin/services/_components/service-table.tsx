import { DataTable } from "@/components/table/data-table";
import { columns } from "./service-tables/columns";
    import { searchParamsCache } from "@/lib/searchparams";
import { getAllServices } from "@/apis/service";

const ServiceTable  = async () => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("search");
  const size = searchParamsCache.get("size");

  const filters = {
    page,
    size: size,
    ...(search && { search }),
  };
  const storeResponse = await getAllServices(filters);
  const storePayload = storeResponse.payload;
  return (
    <div>
      <DataTable
        data={storePayload.items}
        columns={columns}
        totalItems={storePayload.totalPages}
      />
    </div>
  );
};

export default ServiceTable;
