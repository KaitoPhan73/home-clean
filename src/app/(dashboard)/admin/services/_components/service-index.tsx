import PageContainer from "@/components/layout/page-container";
import React, { Suspense } from "react";

import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { Heading } from "@/components/ui/headling";
import { Separator } from "@/components/ui/separator";
import { CredenzaCreateService } from "@/app/(dashboard)/admin/services/_components/credenza-create-service";
import ServiceTable from "@/app/(dashboard)/admin/services/_components/service-table";
type Props = {
  keyProps: string;
};
const ServiceIndex = ({ keyProps }: Props) => {
  return (
    <PageContainer>
      {/* <div className="space-y-2">
        <AreaTable storeResponse={storeResponse} />
      </div> */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title="Dịch Vụ" description="Quản lý dịch vụ" />
          <CredenzaCreateService />
        </div>
        <Separator />

        <Suspense
          key={keyProps}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <ServiceTable />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default ServiceIndex;
