import React from "react";
import { SearchParams } from "nuqs";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import StaffDetailIndex from "./_components/staff-detail-index";
type pageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ slug: string }>;
};
const StaffDetail = async (props: pageProps) => {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });
  return <StaffDetailIndex slug={(await props.params).slug} keyProps={key} />;
};

export default StaffDetail;
