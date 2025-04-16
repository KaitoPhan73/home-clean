import PageContainer from "@/components/layout/page-container";
import React, { Suspense } from "react";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import ServiceTypeTable from "@/app/(dashboard)/admin/service-types/_components/service-type-table";
import { Heading } from "@/components/ui/headling";
import { Separator } from "@/components/ui/separator";
type Props = {
  keyProps: string;
};
const ServiceTypeIndex = ({ keyProps }: Props) => {
  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Loại Giặt Sấy"
            description="Phân Loại Giấy Sấy theo KG hoặc theo Item"
          />
        </div>
        <Separator />

        {/* <CredenzaCreateServiceCategory /> */}
        {/* <ServiceCategoryTableAction /> */}
        <Suspense
          key={keyProps}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <ServiceTypeTable />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default ServiceTypeIndex;
