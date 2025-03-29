import PageContainer from "@/components/layout/page-container";
import React, { Suspense } from "react";

import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { Heading } from "@/components/ui/headling";
import { Separator } from "@/components/ui/separator";
import { CredenzaCreateGroup } from "@/app/(dashboard)/manager/groups/_components/credenza-create-group";
import GroupTable from "@/app/(dashboard)/manager/groups/_components/group-table";
type Props = {
  keyProps: string;
};
const GroupIndex = ({ keyProps }: Props) => {
  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title="Phân Loại" description="Phân Loại Nhóm" />
          <CredenzaCreateGroup />
        </div>
        <Separator />

        {/* <GroupTableAction /> */}
        <Suspense
          key={keyProps}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <GroupTable />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default GroupIndex;
