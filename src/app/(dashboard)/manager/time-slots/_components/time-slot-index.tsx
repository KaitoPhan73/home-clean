import PageContainer from "@/components/layout/page-container";
import React, { Suspense } from "react";

import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { Heading } from "@/components/ui/headling";
import { Separator } from "@/components/ui/separator";
import TimeSlotTableAction from "@/app/(dashboard)/manager/time-slots/_components/time-slot-tables/time-slot-table-action";
import TimeSlotTable from "@/app/(dashboard)/manager/time-slots/_components/time-slot-table";
type Props = {
  keyProps: string;
};
const TimeSlotIndex = ({ keyProps }: Props) => {
  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Quản lí thời gian"
            description="Quản lí các ca giờ làm việc"
          />
        </div>
        <Separator />

        <TimeSlotTableAction />
        <Suspense
          key={keyProps}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <TimeSlotTable />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default TimeSlotIndex;
