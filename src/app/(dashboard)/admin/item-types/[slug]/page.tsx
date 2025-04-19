import React from "react";
import { SearchParams } from "nuqs";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import ItemTypeDetailPage from "@/app/(dashboard)/admin/item-types/[slug]/_components/service-category-detail-index";

type pageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ slug: string }>;
};

const ItemTypeDetail = async (props: pageProps) => {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });
  return <ItemTypeDetailPage slug={(await props.params).slug} keyProps={key} />;
};
 
export default ItemTypeDetail; 
