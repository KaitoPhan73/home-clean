import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import PageContainer from "@/components/layout/page-container";
import EquipmentSupplyDetailAsync from "@/app/(dashboard)/admin/services/[slug]/equipment-supply/[equipmentSupplyId]/_components/update/equipment-supply-detail-async";

type Props = {
  slug: string;
  keyProps: string;
};
const EquipmentSupplyDetailIndex = ({ slug }: Props) => {
  return (
    <PageContainer>
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-16 col-span-12">
          <Suspense fallback={<Skeleton className="" />}>
            <EquipmentSupplyDetailAsync slug={slug} />
          </Suspense>
        </Card>
      </div>
    </PageContainer>
  );
};

export default EquipmentSupplyDetailIndex;
