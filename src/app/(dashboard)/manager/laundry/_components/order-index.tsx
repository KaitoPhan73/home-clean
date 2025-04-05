import PageContainer from "@/components/layout/page-container";
import React, { Suspense } from "react";

import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import OrderServer from "@/app/(dashboard)/manager/laundry/_components/order-server";
type Props = {
  keyProps: string;
};
const OrderIndex = ({ keyProps }: Props) => {
  return (
    <PageContainer>
      <div className="space-y-4">
        {/* <GroupTableAction /> */}
        <Suspense
          key={keyProps}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <OrderServer />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default OrderIndex;
