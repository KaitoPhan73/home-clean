import PageContainer from "@/components/layout/page-container";
import React, { Suspense } from "react";

import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { Heading } from "@/components/ui/headling";
import { Separator } from "@/components/ui/separator";
import UserTable from "@/app/(dashboard)/admin/users/_components/user-table";
import UserTableAction from "@/app/(dashboard)/admin/users/_components/user-tables/user-table-action";
type Props = {
  keyProps: string;
};
const UserIndex = ({ keyProps }: Props) => {
  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title="Quản Lí" description="Người Dùng" />
          {/* <CredenzaCreateUser /> */}
        </div>
        <Separator />

        <UserTableAction />
        <Suspense
          key={keyProps}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <UserTable />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default UserIndex;
