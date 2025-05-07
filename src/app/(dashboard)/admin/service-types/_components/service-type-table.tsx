import { DataTable } from "@/components/table/data-table";
import { searchParamsCache } from "@/lib/searchparams";
import { getAllServiceTypes } from "@/apis/laudry/service-type";
import { serviceTypecolumns } from "@/app/(dashboard)/admin/service-types/_components/service-type-tables/columns";

const ServiceTypeTable = async () => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("search");
  const size = searchParamsCache.get("size");

  const filters = {
    page,
    size: size,
    ...(search && { search }),
  };
  const serviceTypesResponse = await getAllServiceTypes(filters);
  const serviceTypesPayload = serviceTypesResponse.payload;
  return (
    <div>
      <DataTable
        data={serviceTypesPayload.items}
        columns={serviceTypecolumns}
        totalItems={serviceTypesPayload.total}
      />
    </div>
  );
};

export default ServiceTypeTable;
