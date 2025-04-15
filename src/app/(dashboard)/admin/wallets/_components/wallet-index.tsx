import PageContainer from "@/components/layout/page-container";
import React, { Suspense } from "react";

import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import WalletTable from "@/app/(dashboard)/admin/wallets/_components/wallet-table";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/headling";
import WalletTableAction from "./wallet-tables/wallet-table-action";
type Props = {
  keyProps: string;
};
const WalletIndex = ({ keyProps }: Props) => {
  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title="Giao Dịch" description="Quản lí các loại Giao Dịch" />
        </div>
        <Separator />
        <WalletTableAction />
        <Suspense
          key={keyProps}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <WalletTable />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default WalletIndex;
