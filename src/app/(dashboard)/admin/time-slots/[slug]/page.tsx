import React from "react";
import { SearchParams } from "nuqs";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import TimeSlotDetailIndex from "@/app/(dashboard)/manager/time-slots/[slug]/_components/time-slot-detail-index";
type pageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ slug: string }>;
};
const TimeSlotDetail = async (props: pageProps) => {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });
  return <TimeSlotDetailIndex slug={(await props.params).slug} keyProps={key} />;
};

export default TimeSlotDetail;
