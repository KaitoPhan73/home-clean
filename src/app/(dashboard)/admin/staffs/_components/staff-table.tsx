import { getAllEmployees } from "@/apis/laudry/employee";
import { getAllStaffs } from "@/apis/staff";
import { LaundryStaffColumns } from "@/app/(dashboard)/admin/staffs/_components/staff-tables/LaundryStaffColumns";
import { StaffServiceColumns } from "@/app/(dashboard)/admin/staffs/_components/staff-tables/ServiceStaffComllumns";
import { DataTable } from "@/components/table/data-table";
import { searchParamsCache } from "@/lib/searchparams";
import React from "react";

type StaffTableProps = {
  accessToken?: string;
};

const StaffTable = async ({ accessToken }: StaffTableProps) => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("search");
  const size = searchParamsCache.get("size");
  const staffType = searchParamsCache.get("staffType") || "all";

  const filters = {
    page,
    size,
    ...(search && { search }),
  };

  const staffResponse = await getAllStaffs(filters);
  const staffPayload = staffResponse.payload;

  type EmployeeType = {
    status: string;
    createdAt: string;
    updatedAt: string;
    id: string;
    fullName: string;
    email: string;
    address: string;
    hireDate: string;
    employeeCode: string;
    phone: string;
    position: string | null;
    role: string;
  };
  let employeePayload: { items: EmployeeType[], totalPages: number } = { items: [], totalPages: 0 };
  if (staffType === "laundry" || staffType === "all") {
    const employeeResponse = await getAllEmployees(filters, accessToken); // Pass the access token
    employeePayload = employeeResponse.payload;
  }

  return (
    <div className="space-y-6">
      {(staffType === "service" || staffType === "all") && (
        <div>
          {staffType === "all" && (
            <h2 className="text-lg font-semibold mb-3">Nhân viên dịch vụ</h2>
          )}
          <DataTable
            data={staffPayload.items}
            columns={StaffServiceColumns}
            totalItems={staffPayload.totalPages}
          />
        </div>
      )}

      {(staffType === "laundry" || staffType === "all") && (
        <div className="mt-6">
          {staffType === "all" && (
            <h2 className="text-lg font-semibold mb-3">Nhân viên giặt sấy</h2>
          )}
          <DataTable
            data={employeePayload.items}
            columns={LaundryStaffColumns}
            totalItems={employeePayload.totalPages}
          />
        </div>
      )}
    </div>
  );
};

export default StaffTable;