import PageContainer from "@/components/layout/page-container";
import React, { Suspense } from "react";

import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { Heading } from "@/components/ui/headling";
import { Separator } from "@/components/ui/separator";
import StaffTable from "@/app/(dashboard)/admin/staffs/_components/staff-table";
import { cookies } from "next/headers";
import StaffActionButtons from "@/app/(dashboard)/admin/staffs/_components/staff-create-dropdown";
// import { Loader2 } from "lucide-react";
// import UpdateEmployeePage from "@/app/(dashboard)/laundry/employees/[slug]/_components/update/UpdateEmployeePage ";

type Props = {
  keyProps: string;
};

const StaffIndex = async ({ keyProps }: Props) => {
  const accessToken = (await cookies()).get("accessToken")?.value;

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Quản Lí Nhân Viên"
            description="Quản lí nhân viên dịch vụ và nhân viên giặt sấy"
          />
          <StaffActionButtons accessToken={accessToken} />
        </div>
        {/* <Suspense fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }>
        <UpdateEmployeePage accessToken={accessToken} slug={""} />
      </Suspense> */}
        <Separator />

        <Suspense
          key={keyProps}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <StaffTable accessToken={accessToken} />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default StaffIndex;
