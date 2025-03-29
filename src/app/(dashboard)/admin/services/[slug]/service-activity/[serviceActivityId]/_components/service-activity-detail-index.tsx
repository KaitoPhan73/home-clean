import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import PageContainer from "@/components/layout/page-container";
import ServiceActivityDetailAsync from "@/app/(dashboard)/admin/services/[slug]/service-activity/[serviceActivityId]/_components/update/service-activity-detail-async";
import { Separator } from "@radix-ui/react-separator";
import { Heading } from "@/components/ui/headling";
import ServiceSubActivityTableAction from "@/app/(dashboard)/admin/services/[slug]/service-activity/[serviceActivityId]/_components/list-service-sub-activity/service-sub-activity-tables/service-sub-activity-table-action";
import ServiceSubActivityTable from "@/app/(dashboard)/admin/services/[slug]/service-activity/[serviceActivityId]/_components/list-service-sub-activity/service-sub-activity-table";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { CredenzaCreateServiceSubActivity } from "@/app/(dashboard)/admin/services/[slug]/service-activity/[serviceActivityId]/credenza-create-service-sub-activity";

type Props = {
  slug: string;
  keyProps: string;
};
const ServiceActivityDetailIndex = ({ slug, keyProps }: Props) => {
  return (
    <PageContainer>
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-16 col-span-12">
          <Suspense fallback={<Skeleton className="" />}>
            {/* <p>hi</p> */}
            <ServiceActivityDetailAsync slug={slug} />
          </Suspense>
        </Card>

        <div className="col-span-12 md:col-span-3 lg:col-span-12">
          <Separator />
          <ServiceSubActivityTableAction />

          <Tabs defaultValue="activities" className="w-full">
            <TabsContent value="activities">
              <Card className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <Heading
                    title="Danh sách công việc chi tiết"
                    description="Danh sách công việc chi tiết trong các hoạt động của dịch vụ"
                  />
                  <div className="flex justify-end">
                    <CredenzaCreateServiceSubActivity />
                  </div>
                </div>
                <Suspense
                  key={keyProps}
                  fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
                >
                  <ServiceSubActivityTable slug={slug} />
                </Suspense>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageContainer>
  );
};

export default ServiceActivityDetailIndex;
