import { getAllStaffs } from "@/apis/staff";
import { StaffColumns } from "@/app/(dashboard)/admin/staffs/_components/staff-tables/columns";
import { DataTable } from "@/components/table/data-table";
import { searchParamsCache } from "@/lib/searchparams";

const StaffTable = async () => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("search");
  const size = searchParamsCache.get("size");

  const filters = {
    page,
    size: size,
    ...(search && { search }),
  };
  const staffResponse = await getAllStaffs(filters);
  const staffPayload = staffResponse.payload;
  return (
    <div>
      <DataTable
        data={staffPayload.items}
        columns={StaffColumns}
        totalItems={staffPayload.totalPages}
      />
    </div>
  );
};

export default StaffTable;
