import React from "react";
import { SearchParams } from "nuqs";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import EmployeeDetailIndex from "@/app/(dashboard)/laundry/employees/[slug]/_components/employee-detail-index";

type pageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ slug: string }>;
};

const EmployeeDetail = async (props: pageProps) => {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });
  return <EmployeeDetailIndex slug={(await props.params).slug} keyProps={key} />;
};
 
export default EmployeeDetail; 
