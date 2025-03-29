import React from "react";
import { SearchParams } from "nuqs";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import ServiceCategoryDetailIndex from "@/app/(dashboard)/admin/service-categories/[slug]/_components/service-category-detail-index";
type pageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ slug: string }>;
};
const ServiceCategoryDetail = async (props: pageProps) => {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });
  return <ServiceCategoryDetailIndex slug={(await props.params).slug} keyProps={key} />;
};
 
export default ServiceCategoryDetail; 
