import PageContainer from "@/components/layout/page-container";
import React, { Suspense } from "react";

import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { Heading } from "@/components/ui/headling";
import { Separator } from "@/components/ui/separator";
import GroupTableAction from "@/app/(dashboard)/admin/groups/_components/group-tables/group-table-action";
import FeedbackTable from "@/app/(dashboard)/admin/feedbacks/_components/feedback-table";

type Props = {
  keyProps: string;
};

const FeedbackIndex = ({ keyProps }: Props) => {
  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title="Báo Cáo" description="Phân Loại Các Loại Báo Cáo Của Người Dùng" />
          {/* <CredenzaCreateGroup /> */}
        </div>
        <Separator />

        <GroupTableAction />
        <Suspense
          key={keyProps}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <FeedbackTable />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default FeedbackIndex;
