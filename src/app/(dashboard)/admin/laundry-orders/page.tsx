import React from "react";
import { SearchParams } from "nuqs";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import LaundryOrderIndex from "@/app/(dashboard)/admin/laundry-orders/_components/laundry-order-index";
type pageProps = {
  searchParams: Promise<SearchParams>;
};

const LaundryOrderPage = async (props: pageProps) => {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });
  return <LaundryOrderIndex keyProps={key} />;
};

export default LaundryOrderPage;
