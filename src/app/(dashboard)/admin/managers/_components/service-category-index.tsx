import PageContainer from "@/components/layout/page-container";
import React, { Suspense } from "react";

import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { Heading } from "@/components/ui/headling";
import { Separator } from "@/components/ui/separator";
import ManagerTableAction from "@/app/(dashboard)/admin/service-categories/_components/service-category-tables/service-category-table-action";
import ManagerTable from "@/app/(dashboard)/admin/managers/_components/service-category-table";
import { CredenzaCreateManager } from "@/app/(dashboard)/admin/managers/_components/credenza-create-manager";
type Props = {
  keyProps: string;
};
const ManagerIndex = ({ keyProps }: Props) => {
  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title="Quản Lí" description="Điều Phối Viên" />
          <CredenzaCreateManager />
        </div>
        <Separator />

        <ManagerTableAction />
        <Suspense
          key={keyProps}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <ManagerTable />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default ManagerIndex;
