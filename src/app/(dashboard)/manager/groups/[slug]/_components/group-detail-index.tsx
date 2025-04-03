
import React, { Suspense } from "react";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/headling";
import StaffTablesSkeleton from "@/app/(dashboard)/manager/groups/[slug]/_components/loading";
import StaffTables from "@/app/(dashboard)/manager/groups/[slug]/_components/list-staff-in-group/StaffTables";

type Props = {
  slug: string;
  keyProps: string;
};

const GroupDetailIndex = ({ slug, keyProps }: Props) => {
  return (
    <PageContainer>
      <div className="col-span-12 md:col-span-3 lg:col-span-12">
        <div className="py-4">
          <Heading
            title="Quản lý nhân viên trong nhóm"
            description="Theo dõi trạng thái và sự sẵn sàng của nhân viên trong thời gian thực"
          />
        </div>

        <Suspense
          key={keyProps}
          fallback={<StaffTablesSkeleton />}
        >
          <StaffTables slug={slug} />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default GroupDetailIndex;