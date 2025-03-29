import PageContainer from "@/components/layout/page-container";
import React, { Suspense } from "react";

import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { Heading } from "@/components/ui/headling";
import { Separator } from "@/components/ui/separator";
import { CredenzaCreateServiceCategory } from "@/app/(dashboard)/admin/service-categories/_components/credenza-create-service-category";
import ServiceCategoryTableAction from "@/app/(dashboard)/admin/service-categories/_components/service-category-tables/service-category-table-action";
import ServiceCategoryTable from "@/app/(dashboard)/admin/service-categories/_components/service-category-table";
type Props = {
  keyProps: string;
};
const ServiceCategoryIndex = ({ keyProps }: Props) => {
  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title="Phân Loại" description="Phân Loại Dịch Vụ" />
          <CredenzaCreateServiceCategory />
        </div>
        <Separator />

        <ServiceCategoryTableAction />
        <Suspense
          key={keyProps}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <ServiceCategoryTable />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default ServiceCategoryIndex;
