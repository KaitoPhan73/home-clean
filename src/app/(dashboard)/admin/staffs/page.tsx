import React from "react";
import { SearchParams } from "nuqs";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import StaffIndex from "@/app/(dashboard)/admin/staffs/_components/staff-index";

type pageProps = {
  searchParams: Promise<SearchParams>;
};

const StaffPage = async (props: pageProps) => {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });
  return <StaffIndex keyProps={key} />;
};

export default StaffPage;
