import React from "react";
import { SearchParams } from "nuqs";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import GroupDetailIndex from "@/app/(dashboard)/manager/groups/[slug]/_components/group-detail-index";
type pageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ slug: string }>;
};
const GroupDetail = async (props: pageProps) => {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });
  return <GroupDetailIndex slug={(await props.params).slug} keyProps={key} />;
};
 
export default GroupDetail; 
