import { getAllEmployees } from "@/apis/laudry/employee";
import { getAllStaffs } from "@/apis/staff";
import { DataTable } from "@/components/table/data-table";
import { searchParamsCache } from "@/lib/searchparams";
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { StaffServiceColumns } from "@/app/(dashboard)/admin/staffs/_components/staff-tables/ServiceStaffComllumns";
import { LaundryStaffColumns } from "@/app/(dashboard)/admin/staffs/_components/staff-tables/LaundryStaffColumns";

type StaffTableProps = {
  accessToken?: string;
};

const StaffTable = async ({ accessToken }: StaffTableProps) => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("search");
  const size = searchParamsCache.get("size");
  const tabParam = searchParamsCache.get("tab") || "service";

  const filters = {
    page: page || "1",
    size: size || "10",
    ...(search && { search }),
  };

  // Fetch both data sources in parallel for better performance
  const [staffResponse, employeeResponse] = await Promise.all([
    getAllStaffs(filters),
    getAllEmployees(filters, accessToken),
  ]);

  const serviceStaff = staffResponse.payload || { items: [], totalPages: 0 };
  const laundryStaff = employeeResponse.payload || { items: [], totalPages: 0 };

  return (
    <div className="bg-white rounded-lg shadow border">
      <Tabs defaultValue={tabParam} className="w-full">
        <div className="p-4 border-b">
          <TabsList className="grid grid-cols-2 w-72">
            <TabsTrigger
              value="service"
              className="flex items-center font-medium"
            >
              Dịch vụ
              <Badge className="ml-2 bg-blue-100 text-blue-800 border-blue-200">
                {serviceStaff.items.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="laundry"
              className="flex items-center font-medium"
            >
              Giặt sấy
              <Badge className="ml-2 bg-purple-100 text-purple-800 border-purple-200">
                {laundryStaff.items.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="service" className="p-4 pt-2">
          {serviceStaff.items.length > 0 ? (
            <DataTable
              data={serviceStaff.items}
              columns={StaffServiceColumns}
              totalItems={serviceStaff.total}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <p>Không có nhân viên dịch vụ nào</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="laundry" className="p-4 pt-2">
          {laundryStaff.items.length > 0 ? (
            <DataTable
              data={laundryStaff.items}
              columns={LaundryStaffColumns}
              totalItems={laundryStaff.total}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <p>Không có nhân viên giặt sấy nào</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffTable;
