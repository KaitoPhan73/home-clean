import PageContainer from "@/components/layout/page-container";
import React, { Suspense } from "react";

import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { Heading } from "@/components/ui/headling";
import { Separator } from "@/components/ui/separator";
import ItemTypeTable from "@/app/(dashboard)/admin/item-types/_components/item-type-table";

type Props = {
  keyProps: string;
};

const ItemTypeIndex = ({ keyProps }: Props) => {
  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title="Loại Đồ Dùng" description="Phân Loại Các Loại Dùng Giặt Sấy" />
          {/* <CredenzaCreateGroup /> */}
        </div>
        <Separator />

        {/* <GroupTableAction /> */}
        <Suspense
          key={keyProps}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <ItemTypeTable />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default ItemTypeIndex;
