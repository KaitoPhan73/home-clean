import React from "react";
import { SearchParams } from "nuqs";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import ServiceIndex from "@/app/(dashboard)/admin/services/_components/service-index";
type pageProps = {
  searchParams: Promise<SearchParams>;
};

const ServicePage = async (props: pageProps) => {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });
  return <ServiceIndex keyProps={key} />;
};

export default ServicePage;
