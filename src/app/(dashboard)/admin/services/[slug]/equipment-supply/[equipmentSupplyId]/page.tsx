import React from "react";
import { SearchParams } from "nuqs";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import EquipmentSupplyDetailIndex from "@/app/(dashboard)/admin/services/[slug]/equipment-supply/[equipmentSupplyId]/_components/equipment-supply-detail-index";
type pageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ equipmentSupplyId: string }>;
};
const EquipmentSupplyDetail = async (props: pageProps) => {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });
  return <EquipmentSupplyDetailIndex slug={(await props.params).equipmentSupplyId} keyProps={key} />;
};

export default EquipmentSupplyDetail; 
