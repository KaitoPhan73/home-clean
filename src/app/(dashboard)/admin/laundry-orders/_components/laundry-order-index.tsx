import PageContainer from "@/components/layout/page-container";
import React, { Suspense } from "react";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import LaundryOrderTable from "@/app/(dashboard)/admin/laundry-orders/_components/laundry-order-table";

type Props = {
  keyProps: string;
};

const LaundryOrderIndex = ({ keyProps }: Props) => {
  return (
    <PageContainer>
      <div className="space-y-4">
        <Suspense
          key={keyProps}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <LaundryOrderTable />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default LaundryOrderIndex;