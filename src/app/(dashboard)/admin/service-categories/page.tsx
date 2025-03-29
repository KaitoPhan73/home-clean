import React from "react";
import { SearchParams } from "nuqs";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import ServiceCategoryIndex from "@/app/(dashboard)/admin/service-categories/_components/service-category-index";
type pageProps = {
  searchParams: Promise<SearchParams>;
};

const ServiceCategoryPage = async (props: pageProps) => {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });
  return <ServiceCategoryIndex keyProps={key} />;
};

export default ServiceCategoryPage;
