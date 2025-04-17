import PageContainer from "@/components/layout/page-container";
import React, { Suspense } from "react";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import EmployeeServer from "@/app/(dashboard)/laundry/employees/_components/employee-server";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  keyProps: string;
};

const EmployeeIndex = ({ keyProps }: Props) => {
  return (
    <PageContainer>
      <div className="space-y-4">
        <Suspense
          key={keyProps}
          fallback={
            <Card>
              <CardContent className="pt-6">
                <DataTableSkeleton columnCount={5} rowCount={10} />
              </CardContent>
            </Card>
          }
        >
          <EmployeeServer />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default EmployeeIndex;