import PageContainer from "@/components/layout/page-container";
import React, { Suspense } from "react";

import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import StaffAssignBoard from "@/app/(dashboard)/manager/order-assignment/_components/order-management/OrderManagement/OrderFilter";
type Props = {
  keyProps: string;
};
const StaffAssignIndex = ({ keyProps }: Props) => {
  return (
    <PageContainer>
      <div>
        {/* <GroupTableAction /> */}
        <Suspense
          key={keyProps}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <StaffAssignBoard />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default StaffAssignIndex;
