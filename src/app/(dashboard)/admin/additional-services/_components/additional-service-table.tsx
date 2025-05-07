import { DataTable } from "@/components/table/data-table";
import { searchParamsCache } from "@/lib/searchparams";
import { getAllAdditionalServices } from "@/apis/laudry/addtitional-service";
import { additionalServicecolumns } from "@/app/(dashboard)/admin/additional-services/_components/additional-service-tables/columns";

const AdditionalServiceTable = async () => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("search");
  const size = searchParamsCache.get("size");

  const filters = {
    page,
    size: size,
    ...(search && { search }),
  };
  const additionalServiceResponse = await getAllAdditionalServices(filters);
  const additionalServicePayload = additionalServiceResponse.payload;
  return (
    <div>
      <DataTable
        data={additionalServicePayload.items}
        columns={additionalServicecolumns}
        totalItems={additionalServicePayload.total}
      />
    </div>
  );
};

export default AdditionalServiceTable;
