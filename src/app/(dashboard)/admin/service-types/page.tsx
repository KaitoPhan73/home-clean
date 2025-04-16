import React from "react";
import { SearchParams } from "nuqs";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import ServiceTypeIndex from "@/app/(dashboard)/admin/service-types/_components/service-type-index";

type pageProps = {
  searchParams: Promise<SearchParams>;
};

const ServiceTypePage = async (props: pageProps) => {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });
  return <ServiceTypeIndex keyProps={key} />;
};

export default ServiceTypePage;
