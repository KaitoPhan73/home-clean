import { DataTable } from "@/components/table/data-table";
import { searchParamsCache } from "@/lib/searchparams";
import { getEmployeesRealTimeStatus } from "@/apis/laudry/employee";
import { EmployeeColumns } from "@/app/(dashboard)/laundry/employees/_components/employee-tables/columns";
import EmployeeTableAction from "@/app/(dashboard)/laundry/employees/_components/employee-tables/employee-table-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EmployeeServer = async () => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("q");
  const status = searchParamsCache.get("status");
  const size = searchParamsCache.get("size");

  const filters = {
    page,
    size: size,
    ...(search && { search }),
    ...(status && { status }),
  };
  
  const employees = await getEmployeesRealTimeStatus(filters);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-0">
        <CardTitle className="text-xl font-bold">Danh sách nhân viên</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <EmployeeTableAction/>
          <DataTable
            data={employees}
            columns={EmployeeColumns}
            totalItems={employees.length}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeServer;