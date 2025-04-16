import React from "react";
import { SearchParams } from "nuqs";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import TaskIndex from "@/app/(dashboard)/admin/tasks/_components/task-index";
type pageProps = {
  searchParams: Promise<SearchParams>;
};

const TaskPage = async (props: pageProps) => {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });
  return <TaskIndex keyProps={key} />;
};

export default TaskPage;
