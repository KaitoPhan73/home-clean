/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import PageContainer from "@/components/layout/page-container";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import { SearchParams } from "nuqs";
import TaskDetailAsync from "@/app/(dashboard)/admin/tasks/[slug]/_components/update/task-detail-async";

type Props = {
  params: { id: string };
  searchParams: Promise<SearchParams>;
  slug: string;
  keyProps: string;
};

export default async function TaskDetailPage({ params, searchParams, slug, keyProps }: Props) {
  const resolvedSearchParams = await searchParams;
  searchParamsCache.parse(resolvedSearchParams);

  return (
    <PageContainer>
      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 p-0">
        <Card className="p-0 col-span-6 md:col-span-3 lg:col-span-12">
          <Suspense fallback={<Skeleton className="w-full h-full" />}>
            <TaskDetailAsync id={params.id} keyProps={keyProps} />
          </Suspense>
        </Card>
      </div>
    </PageContainer>
  );
}
