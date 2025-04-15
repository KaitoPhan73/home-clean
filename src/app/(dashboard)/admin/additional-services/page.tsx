import React from "react";
import { SearchParams } from "nuqs";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import AdditionalServiceIndex from "@/app/(dashboard)/admin/additional-services/_components/additional-service-index";

type pageProps = {
  searchParams: Promise<SearchParams>;
};

const AdditionalServicePage = async (props: pageProps) => {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });
  return <AdditionalServiceIndex keyProps={key} />;
};

export default AdditionalServicePage;
