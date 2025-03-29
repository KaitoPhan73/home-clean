import React from "react";
import { SearchParams } from "nuqs";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import OptionDetailIndex from "@/app/(dashboard)/admin/services/[slug]/option/[optionId]/_components/option-detail-index";
type pageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ optionId: string }>;
};
const OptionDetail = async (props: pageProps) => {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });
  return <OptionDetailIndex slug={(await props.params).optionId} keyProps={key} />;
};

export default OptionDetail; 
