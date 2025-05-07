import { DataTable } from "@/components/table/data-table";
import { searchParamsCache } from "@/lib/searchparams";
import { getAllServiceInHouseTypes } from "@/apis/service-in-house-types";
import { ServiceInHouseTypesColumns } from "@/app/(dashboard)/admin/service-in-house-types/_components/service-in-house-types-tables/columns";

const ServiceInHouseTypesTable = async () => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("search");
  const size = searchParamsCache.get("size");

  const filters = {
    page,
    size: size,
    ...(search && { search }),
  };
  const serviceInHouseTypesResponse = await getAllServiceInHouseTypes(filters);
  const serviceInHouseTypesPayload = serviceInHouseTypesResponse.payload;
  return (
    <div>
      <DataTable
        data={serviceInHouseTypesPayload.items}
        columns={ServiceInHouseTypesColumns}
        totalItems={serviceInHouseTypesPayload.total}
      />
    </div>
  );
};

export default ServiceInHouseTypesTable;
