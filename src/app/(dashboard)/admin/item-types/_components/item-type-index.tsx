import PageContainer from "@/components/layout/page-container";
import React, { Suspense } from "react";

import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { Heading } from "@/components/ui/headling";
import { Separator } from "@/components/ui/separator";
import ItemTypeTable from "@/app/(dashboard)/admin/item-types/_components/item-type-table";
import { CredenzaCreateItemType } from "@/app/(dashboard)/admin/item-types/_components/credenza-create-item-type";
import { cookies } from "next/headers";

type Props = {
  keyProps: string;
};

const ItemTypeIndex = async ({ keyProps }: Props) => {
  const accessToken = (await cookies()).get("accessToken")?.value;

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title="Quản lý mặt hàng" description="Xem danh sách và quản lý các mặt hàng trong hệ thống" />
          <CredenzaCreateItemType accessToken={accessToken} />
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
