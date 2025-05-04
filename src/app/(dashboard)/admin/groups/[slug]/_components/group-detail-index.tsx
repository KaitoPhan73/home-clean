import React, { Suspense } from "react";
import GroupDetailAsync from "./update/group-detail-async";
import PageContainer from "@/components/layout/page-container";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  slug: string;
  keyProps: string;
};

const GroupDetailIndex = async ({ slug, keyProps }: Props) => {
  return (
    <PageContainer>
      <div>
        <Card className="p-4">
          <Suspense fallback={<Skeleton className="w-full h-full" />}>
            <GroupDetailAsync slug={slug} key={keyProps} />
          </Suspense>
        </Card>
      </div>
    </PageContainer>
  );
};

export default GroupDetailIndex;
