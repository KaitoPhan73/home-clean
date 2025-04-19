import React from "react";
import { SearchParams } from "nuqs";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import ItemTypeIndex from "@/app/(dashboard)/admin/item-types/_components/item-type-index";

type pageProps = {
  searchParams: Promise<SearchParams>;
};

const ItemTypePage = async (props: pageProps) => {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });
  return <ItemTypeIndex keyProps={key} />;
};

export default ItemTypePage;
