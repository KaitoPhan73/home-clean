import { DataTable } from "@/components/table/data-table";
import { columns } from "./group-tables/columns";
import { searchParamsCache } from "@/lib/searchparams";
import { getAllGroups } from "@/apis/group";

const GroupTable = async () => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("search");
  const size = searchParamsCache.get("size");

  const filters = {
    page,
    size: size,
    ...(search && { search }),
  };
  const groupResponse = await getAllGroups(filters);
  const groupPayload = groupResponse.payload;
  return (
    <div>
      <DataTable
        data={groupPayload.items}
        columns={columns}
        totalItems={groupPayload.totalPages}
      />
    </div>
  );
};

export default GroupTable;
