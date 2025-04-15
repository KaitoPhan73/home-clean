import React from "react";
import { SearchParams } from "nuqs";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import AdditionalServiceDetailIndex from "@/app/(dashboard)/admin/additional-services/[slug]/_components/additional-service-detail-index";

type pageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ slug: string }>;
};

const AdditionalServiceDetail = async (props: pageProps) => {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });
  return <AdditionalServiceDetailIndex slug={(await props.params).slug} keyProps={key} />;
};
 
export default AdditionalServiceDetail; 
