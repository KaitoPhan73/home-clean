import React, { Suspense } from "react";
import StaffDetailAsync from "./update/staff-detail-async";
import PageContainer from "@/components/layout/page-container";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  slug: string;
  keyProps: string;
};

const StaffDetailIndex = async ({ slug, keyProps }: Props) => {
  return (
    <PageContainer>
      <div>
        <Card className="p-4">
          <Suspense fallback={<Skeleton className="w-full h-full" />}>
            <StaffDetailAsync slug={slug} key={keyProps} />
          </Suspense>
        </Card>
      </div>
    </PageContainer>
  );
};

export default StaffDetailIndex;
