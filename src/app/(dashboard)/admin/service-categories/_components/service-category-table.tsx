import { DataTable } from "@/components/table/data-table";
import { columns } from "./service-category-tables/columns";
import { searchParamsCache } from "@/lib/searchparams";
import { getAllServiceCategories } from "@/apis/service-category";

const ServiceCategoryTable = async () => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("search");
  const size = searchParamsCache.get("size");

  const filters = {
    page,
    size: size,
    ...(search && { search }),
  };
  const storeResponse = await getAllServiceCategories(filters);
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

export default ServiceCategoryTable;
