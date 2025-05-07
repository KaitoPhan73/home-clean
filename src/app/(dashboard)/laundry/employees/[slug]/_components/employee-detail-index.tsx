/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import PageContainer from "@/components/layout/page-container";
import { cookies } from "next/headers";
import UpdateEmployeePage from "@/app/(dashboard)/laundry/employees/[slug]/_components/update/UpdateEmployeePage ";

type Props = {
  slug: string;
  keyProps: string;
};

const EmployeeDetailIndex = async ({ slug, keyProps }: Props) => {
  // Get access token from cookies - this is server component
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  return (
    <PageContainer>
      <div className="grid grid-cols-9 md:grid-cols-3 gap-4 p-4">
        <Card className="p-4 col-span-1 md:col-span-3 w-full">
          <Suspense fallback={<Skeleton className="w-full h-full" />}>
            <UpdateEmployeePage slug={slug} accessToken={accessToken} />
          </Suspense>
        </Card>
      </div>
    </PageContainer>
  );
};

export default EmployeeDetailIndex;