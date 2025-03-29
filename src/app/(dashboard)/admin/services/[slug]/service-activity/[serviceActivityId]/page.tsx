import React from "react";
import { SearchParams } from "nuqs";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import ServiceActivityDetailIndex from "@/app/(dashboard)/admin/services/[slug]/service-activity/[serviceActivityId]/_components/service-activity-detail-index";
type pageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ serviceActivityId: string }>;
};
const ServiceActivityDetail = async (props: pageProps) => {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });
  return <ServiceActivityDetailIndex slug={(await props.params).serviceActivityId} keyProps={key} />;
};

export default ServiceActivityDetail;
