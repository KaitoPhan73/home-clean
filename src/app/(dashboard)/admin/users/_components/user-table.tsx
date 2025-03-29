import { getAllUsers } from "@/apis/vinwallet/user";
import { UserColumns } from "@/app/(dashboard)/admin/users/_components/user-tables/columns";
import { DataTable } from "@/components/table/data-table";
import { searchParamsCache } from "@/lib/searchparams";

const UserTable = async () => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("search");
  const size = searchParamsCache.get("size");

  const filters = {
    page,
    size: size,
    ...(search && { search }),
  };
  const userResponse = await getAllUsers(filters);
  const userPayload = userResponse.payload;
  return (
    <div>
      <DataTable
        data={userPayload.items}
        columns={UserColumns}
        totalItems={userPayload.totalPages}
      />
    </div>
  );
};

export default UserTable;
