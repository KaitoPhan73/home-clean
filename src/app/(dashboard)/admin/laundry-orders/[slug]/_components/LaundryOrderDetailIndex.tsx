import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import PageContainer from "@/components/layout/page-container";
import LaundryOrderDetailAsync from "@/app/(dashboard)/admin/laundry-orders/[slug]/_components/update/LaundryOrderDetailAsync";

type Props = {
  slug: string;
};
const LaundryOrderDetailIndex = ({ slug }: Props) => {
  return (
    <PageContainer>
      <div className="grid grid-cols-9 md:grid-cols-3 gap-4 p-4">
        <Card className="p-4 col-span-1 md:col-span-3 w-full">
          <Suspense fallback={<Skeleton className="w-full h-full" />}>
            <LaundryOrderDetailAsync slug={slug} />
          </Suspense>
        </Card>
      </div>
    </PageContainer>
  );
};

export default LaundryOrderDetailIndex;
