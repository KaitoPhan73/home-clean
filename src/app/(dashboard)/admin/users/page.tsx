import React from "react";
import { SearchParams } from "nuqs";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import UserIndex from "@/app/(dashboard)/admin/users/_components/user-index";

type pageProps = {
  searchParams: Promise<SearchParams>;
};

const UserPage = async (props: pageProps) => {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });
  return <UserIndex keyProps={key} />;
};

export default UserPage;
