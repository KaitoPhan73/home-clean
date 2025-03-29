import React, { Suspense } from "react";
import AreaDetailAsync from "./update/area-detail-async";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import PageContainer from "@/components/layout/page-container";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import ClusterTableArea from "./list-cluster-in-area/cluster-table-area";
import { Heading } from "@/components/ui/headling";
import { Separator } from "@/components/ui/separator";

type Props = {
  slug: string;
  keyProps: string;
};
const AreaDetailIndex = ({ slug, keyProps }: Props) => {
  return (
    <PageContainer>
      <div>
        <Card className="p-4 col-span-6 md:col-span-3 lg:col-span-6">
          <Suspense fallback={<Skeleton className=" w-full h-full" />}>
            <AreaDetailAsync slug={slug} />
          </Suspense>
        </Card>
        <div className="col-span-12 md:col-span-3 lg:col-span-12">
          <Separator />
          <div className="py-4">
            <Heading
              title="Cụm trong khu vực"
              description="Danh sách cụm trong khu vực"
            />
          </div>

          <Suspense
            key={keyProps}
            fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
          >
            <ClusterTableArea slug={slug} />
          </Suspense>
        </div>
      </div>
    </PageContainer>
  );
};

export default AreaDetailIndex;
