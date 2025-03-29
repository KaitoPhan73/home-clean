import React from "react";
import { SearchParams } from "nuqs";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import ServiceDetailIndex from "@/app/(dashboard)/admin/services/[slug]/_components/service-detail-index";
type pageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ slug: string }>;
};
const ServiceDetail = async (props: pageProps) => {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });
  return <ServiceDetailIndex slug={(await props.params).slug} keyProps={key} />;
};

export default ServiceDetail;
