import React from "react";
import { SearchParams } from "nuqs";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import ServiceInHouseTypesIndex from "@/app/(dashboard)/admin/service-in-house-types/_components/service-in-house-types-index";
type pageProps = {
  searchParams: Promise<SearchParams>;
};

const ServiceInHouseTypesPage = async (props: pageProps) => {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });
  return <ServiceInHouseTypesIndex keyProps={key} />;
};

export default ServiceInHouseTypesPage;
