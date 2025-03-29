import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import PageContainer from "@/components/layout/page-container";
import ExtraServiceDetailAsync from "@/app/(dashboard)/admin/services/[slug]/extra-service/[extraServiceId]/_components/update/service-activity-detail-async";

type Props = {
  slug: string;
  keyProps: string;
};
const ExtraServiceDetailIndex = ({ slug }: Props) => {
  return (
    <PageContainer>
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-16 col-span-12">
          <Suspense fallback={<Skeleton className="" />}>
            <ExtraServiceDetailAsync slug={slug} />
          </Suspense>
        </Card>
      </div>
    </PageContainer>
  );
};

export default ExtraServiceDetailIndex;
