import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import PageContainer from "@/components/layout/page-container";
import OptionDetailAsync from "@/app/(dashboard)/admin/services/[slug]/option/[optionId]/_components/update/option-detail-async";

type Props = {
  slug: string;
  keyProps: string;
};
const OptionDetailIndex = ({ slug }: Props) => {
  return (
    <PageContainer>
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-16 col-span-12">
          <Suspense fallback={<Skeleton className="" />}>
            <OptionDetailAsync slug={slug} />
          </Suspense>
        </Card>
      </div>
    </PageContainer>
  );
};

export default OptionDetailIndex;
