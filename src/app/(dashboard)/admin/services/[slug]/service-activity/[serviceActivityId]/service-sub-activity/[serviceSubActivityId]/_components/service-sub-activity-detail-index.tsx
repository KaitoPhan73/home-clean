import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import PageContainer from "@/components/layout/page-container";
import ServiceSubActivityDetailAsync from "@/app/(dashboard)/admin/services/[slug]/service-activity/[serviceActivityId]/service-sub-activity/[serviceSubActivityId]/_components/update/service-sub-activity-detail-async";

type Props = {
  slug: string;
  keyProps: string;
};
const ServiceSubActivityDetailIndex = ({ slug }: Props) => {
  return (
    <PageContainer>
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-16 col-span-12">
          <Suspense fallback={<Skeleton className="" />}>
            <ServiceSubActivityDetailAsync slug={slug} />
          </Suspense>
        </Card>

        {/* <div className="col-span-12 md:col-span-3 lg:col-span-12">
          <Separator />
          <ServiceSubActivityTableAction />

          <div className="py-4">
            <Heading
              title="Danh sách công việc chi tiết"
              description="Danh sách công việc chi tiết trong các hoạt động của dịch vụ"
            />
          </div>

          <Suspense
            key={keyProps}
            fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
          >
            <ServiceSubActivityTable slug={slug} />
          </Suspense>
        </div> */}
      </div>
    </PageContainer>
  );
};

export default ServiceSubActivityDetailIndex;
