import React from "react";
import { SearchParams } from "nuqs";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import ServiceActivityDetailIndexx from "@/app/(dashboard)/admin/services/[slug]/_components/list-service-activities-in-service/[slug]/_components/service-activity-detail-index";
type pageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ slug: string }>;
};
const ServiceActivityDetail = async (props: pageProps) => {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });
  return <ServiceActivityDetailIndexx slug={(await props.params).slug} keyProps={key} />;
};

export default ServiceActivityDetail; 
