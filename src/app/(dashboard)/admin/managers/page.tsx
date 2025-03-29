import React from "react";
import { SearchParams } from "nuqs";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import ManagerIndex from "@/app/(dashboard)/admin/managers/_components/service-category-index";
type pageProps = {
  searchParams: Promise<SearchParams>;
};

const ManagerPage = async (props: pageProps) => {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });
  return <ManagerIndex keyProps={key} />;
};

export default ManagerPage;
