import PageContainer from "@/components/layout/page-container";
import React, { Suspense } from "react";

import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { Heading } from "@/components/ui/headling";
import { Separator } from "@/components/ui/separator";
import StaffTable from "@/app/(dashboard)/admin/staffs/_components/staff-table";
import StaffTableAction from "@/app/(dashboard)/admin/staffs/_components/staff-tables/staff-table-action";
type Props = {
  keyProps: string;
};
const StaffIndex = ({ keyProps }: Props) => {
  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title="Quản Lí" description="Nhân Viên" />
          {/* <CredenzaCreateStaff /> */}
        </div>
        <Separator />

        <StaffTableAction />
        <Suspense
          key={keyProps}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <StaffTable />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default StaffIndex;
