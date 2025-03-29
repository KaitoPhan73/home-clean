import { DataTable } from "@/components/table/data-table";
import { columns } from "./manager-tables/columns";
import { searchParamsCache } from "@/lib/searchparams";
import { getAllManagers } from "@/apis/manager";

const ManagerTable = async () => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("search");
  const size = searchParamsCache.get("size");

  const filters = {
    page,
    size: size,
    ...(search && { search }),
  };
  const managerResponse = await getAllManagers(filters);
  const managerPayload = managerResponse.payload;
  return (
    <div>
      <DataTable
        data={managerPayload.items}
        columns={columns}
        totalItems={managerPayload.totalPages}
      />
    </div>
  );
};

export default ManagerTable;
