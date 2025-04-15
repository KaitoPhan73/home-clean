import React, { Suspense } from "react";
import BuildingDetailAsync from "./update/building-detail-async";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import PageContainer from "@/components/layout/page-container";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { Heading } from "@/components/ui/headling";
import { Separator } from "@/components/ui/separator";
import HouseTableBuilding from "./list-house-in-building/house-table-building";

type Props = {
  slug: string;
  keyProps: string;
};
const BuildingDetailIndex = ({ slug, keyProps }: Props) => {
  return (
    <PageContainer>
      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 p-4">
        <Card className="p-4 col-span-6 md:col-span-3 lg:col-span-12">
          <Suspense fallback={<Skeleton className=" w-full h-full" />}>
            <BuildingDetailAsync slug={slug} />
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
            <HouseTableBuilding slug={slug} />
          </Suspense>
        </div>
      </div>
    </PageContainer>
  );
};

export default BuildingDetailIndex;
