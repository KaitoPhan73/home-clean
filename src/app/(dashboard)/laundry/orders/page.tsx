import React from "react";
import { SearchParams } from "nuqs";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import OrderIndex from "@/app/(dashboard)/laundry/orders/_components/order-index";

type pageProps = {
  searchParams: Promise<SearchParams>;
};

const OrderPage = async (props: pageProps) => {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });
  return <OrderIndex keyProps={key} />;
};

export default OrderPage;
