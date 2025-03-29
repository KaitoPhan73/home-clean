import React from "react";
import { SearchParams } from "nuqs";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import TransactionIndex from "@/app/(dashboard)/admin/transactions/_components/transaction-index";
type pageProps = {
  searchParams: Promise<SearchParams>;
};

const TransactionPage = async (props: pageProps) => {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });
  return <TransactionIndex keyProps={key} />;
};

export default TransactionPage;
