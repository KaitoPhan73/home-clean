import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import PageContainer from "@/components/layout/page-container";
import AdditionalServiceDetailAsync from "@/app/(dashboard)/admin/additional-services/[slug]/_components/update/additional-service-detail-async";

type Props = {
  slug: string;
  keyProps: string;
};
const AdditionalServiceDetailIndex = ({ slug }: Props) => {
  return (
    <PageContainer>
      <div className="grid gap-4 p-4">
          <Suspense fallback={<Skeleton className="w-full h-full" />}>
            <AdditionalServiceDetailAsync slug={slug} />
          </Suspense>
      </div>
    </PageContainer>
  );
};

export default AdditionalServiceDetailIndex;
