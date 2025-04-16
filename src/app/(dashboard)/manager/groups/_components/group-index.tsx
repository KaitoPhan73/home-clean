import PageContainer from "@/components/layout/page-container";
import React, { Suspense } from "react";

import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
// import { Heading } from "@/components/ui/headling";
// import { CredenzaCreateGroup } from "@/app/(dashboard)/manager/groups/_components/credenza-create-group";
import GroupTable from "@/app/(dashboard)/manager/groups/_components/group-table";
type Props = {
  keyProps: string;
};
const GroupIndex = ({ keyProps }: Props) => {
  return (
    <PageContainer>
        <div className="flex items-start justify-between">
        </div>
        <Suspense
          key={keyProps}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <GroupTable />
        </Suspense>
    </PageContainer>
  );
};

export default GroupIndex;
