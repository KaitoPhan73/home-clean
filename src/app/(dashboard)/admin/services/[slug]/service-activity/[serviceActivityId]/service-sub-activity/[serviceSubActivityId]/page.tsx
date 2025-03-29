import React from "react";
import { SearchParams } from "nuqs";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import ServiceSubActivityDetailIndex from "@/app/(dashboard)/admin/services/[slug]/service-activity/[serviceActivityId]/service-sub-activity/[serviceSubActivityId]/_components/service-sub-activity-detail-index";
type pageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ serviceSubActivityId: string }>;
};
const ServiceSubActivityDetail = async (props: pageProps) => {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });
  return <ServiceSubActivityDetailIndex slug={(await props.params).serviceSubActivityId} keyProps={key} />;
};

export default ServiceSubActivityDetail;
