import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import PageContainer from "@/components/layout/page-container";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
// import ClusterTableArea from "./list-service-in-service-category/cluster-table-area";
import { Heading } from "@/components/ui/headling";
import { Separator } from "@/components/ui/separator";
import ServiceActivityDetailAsyncc from "./update/service-activity-detail-async";

type Props = {
  slug: string;
  keyProps: string;
};
const ServiceActivityDetailIndexx = ({ slug, keyProps }: Props) => {
  return (
    <PageContainer>
      <div className="grid grid-cols-9 md:grid-cols-3 gap-4 p-4">
        <Card className="p-4 col-span-1 md:col-span-3 w-full">
          <Suspense fallback={<Skeleton className="w-full h-full" />}>
            <ServiceActivityDetailAsyncc slug={slug} />
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
            {/* <ServiceTableInServiceCategory slug={slug} /> */}
          </Suspense>
        </div>
    </PageContainer>
  );
};

export default ServiceActivityDetailIndexx;
