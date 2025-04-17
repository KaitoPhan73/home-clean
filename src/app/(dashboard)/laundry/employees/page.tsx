import React from "react";
import { SearchParams } from "nuqs";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import EmployeeIndex from "@/app/(dashboard)/laundry/employees/_components/employee-index";

type pageProps = {
  searchParams: Promise<SearchParams>;
};

const EmployeePage = async (props: pageProps) => {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });
  return <EmployeeIndex keyProps={key} />;
};

export default EmployeePage;
