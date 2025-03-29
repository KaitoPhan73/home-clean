import React from "react";
import { SearchParams } from "nuqs";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import GroupIndex from "@/app/(dashboard)/admin/groups/_components/group-index";
type pageProps = {
  searchParams: Promise<SearchParams>;
};

const GroupPage = async (props: pageProps) => {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });
  return <GroupIndex keyProps={key} />;
};

export default GroupPage;
