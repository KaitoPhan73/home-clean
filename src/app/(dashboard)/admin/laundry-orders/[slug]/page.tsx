/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { SearchParams } from "nuqs";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import LaundryOrderDetailIndex from "@/app/(dashboard)/admin/laundry-orders/[slug]/_components/LaundryOrderDetailIndex";

type pageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ slug: string }>;
};
const LaundryOrderDetail = async (props: pageProps) => {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });
  return <LaundryOrderDetailIndex slug={(await props.params).slug}/>;
};
 
export default LaundryOrderDetail; 
