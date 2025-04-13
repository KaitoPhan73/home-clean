import React from "react";
import { SearchParams } from "nuqs";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import WalletIndex from "./_components/wallet-index";
type pageProps = {
  searchParams: Promise<SearchParams>;
};

const WalletPage = async (props: pageProps) => {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });
  return <WalletIndex keyProps={key} />;
};

export default WalletPage;
