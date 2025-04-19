import React from "react";
import { SearchParams } from "nuqs";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import FeedbackIndex from "@/app/(dashboard)/admin/feedbacks/_components/feedback-index";

type pageProps = {
  searchParams: Promise<SearchParams>;
};

const FeedbackPage = async (props: pageProps) => {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });
  return <FeedbackIndex keyProps={key} />;
};

export default FeedbackPage;
