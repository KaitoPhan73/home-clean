import PageContainer from "@/components/layout/page-container";
import React, { Suspense } from "react";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { Heading } from "@/components/ui/headling";
import { Separator } from "@/components/ui/separator";
import AdditionalServiceTable from "@/app/(dashboard)/admin/additional-services/_components/additional-service-table";
import { CredenzaCreateAdditionalService } from "@/app/(dashboard)/admin/additional-services/_components/credenza-create-additional-service";
type Props = {
  keyProps: string;
};
const AdditionalServiceIndex = ({ keyProps }: Props) => {
  return (
    <PageContainer>
      <div className="space-y-4 pt-2">
        <div className="flex items-start justify-between">
          <Heading
            title="Dịch Vụ Bổ Sung"
            description="Các dịch vụ bổ sung cho giặt sấy"
          />
          <CredenzaCreateAdditionalService />
        </div>
        <Separator />

        <Suspense
          key={keyProps}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <AdditionalServiceTable />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default AdditionalServiceIndex;
