import React from "react";
import { SearchParams } from "nuqs";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import ExtraServiceDetailIndex from "@/app/(dashboard)/admin/services/[slug]/extra-service/[extraServiceId]/_components/service-activity-detail-index";
type pageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ extraServiceId: string }>;
};
const ExtraServiceDetail = async (props: pageProps) => {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });
  return <ExtraServiceDetailIndex slug={(await props.params).extraServiceId} keyProps={key} />;
};

export default ExtraServiceDetail; 
