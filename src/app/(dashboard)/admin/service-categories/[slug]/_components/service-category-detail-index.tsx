import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import PageContainer from "@/components/layout/page-container";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
// import ClusterTableArea from "./list-service-in-service-category/cluster-table-area";
import { Heading } from "@/components/ui/headling";
import { Separator } from "@/components/ui/separator";
import ServiceCategoryDetailAsync from "@/app/(dashboard)/admin/service-categories/[slug]/_components/update/service-category-detail-async";
import ServiceTableInServiceCategory from "@/app/(dashboard)/admin/service-categories/[slug]/_components/list-service-in-service-category/service-table-in-service-category";

type Props = {
  slug: string;
  keyProps: string;
};
const ServiceCategoryDetailIndex = ({ slug, keyProps }: Props) => {
  return (
    <PageContainer>
      <div className="grid grid-cols-9 md:grid-cols-3 gap-4 p-4">
        <Card className="p-4 col-span-1 md:col-span-3 w-full">
          <Suspense fallback={<Skeleton className="w-full h-full" />}>
            <ServiceCategoryDetailAsync slug={slug} />
          </Suspense>
        </Card>
      </div>

        <div className="col-span-12 md:col-span-3 lg:col-span-12">
          <Separator />
          <div className="py-4">
            <Heading
              title="Dịch vụ trong phân loại dịch vụ"
              description="Danh sách dịch vụ trong phân loại dịch vụ"
            />
          </div>

          <Suspense
            key={keyProps}
            fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
          >
            <ServiceTableInServiceCategory slug={slug} />
          </Suspense>
        </div>
    </PageContainer>
  );
};

export default ServiceCategoryDetailIndex;
