import React from "react";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import StaffAssignIndex from "@/app/(dashboard)/manager/order-assignment/_components/staff-assign-index";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const StaffAssignPage = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = searchParams ? await searchParams : {};

  console.log("🔍 searchParams:", resolvedSearchParams); 

  searchParamsCache.parse(resolvedSearchParams);

  const searchKey = serialize({ ...resolvedSearchParams });

  return <StaffAssignIndex keyProps={searchKey} />;
};

export default StaffAssignPage;
