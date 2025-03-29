import PageContainer from "@/components/layout/page-container";
import React, { Suspense } from "react";

import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import TransactionTable from "@/app/(dashboard)/admin/transactions/_components/transaction-table";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/headling";
type Props = {
  keyProps: string;
};
const TransactionIndex = ({ keyProps }: Props) => {
  return (
    <PageContainer>
      <div className="space-y-4">
      <div className="flex items-start justify-between">
          <Heading title="Giao Dịch" description="Quản lí các loại Giao Dịch" />
        </div>
        <Separator />
        <Suspense
          key={keyProps}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <TransactionTable />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default TransactionIndex;
