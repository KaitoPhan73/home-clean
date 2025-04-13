import React from "react";
import { SearchParams } from "nuqs";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import TimeSlotIndex from "./_components/time-slot-index";
type pageProps = {
  searchParams: Promise<SearchParams>;
};

const TimeSlotPage = async (props: pageProps) => {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });
  return <TimeSlotIndex keyProps={key} />;
};

export default TimeSlotPage;
