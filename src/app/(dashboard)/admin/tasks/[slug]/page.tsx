import React from "react";
import { SearchParams } from "nuqs";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import TaskDetailIndex from "@/app/(dashboard)/admin/tasks/[slug]/_components/TaskDetailIndex";

type pageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ slug: string }>;
};

const TaskDetail = async (props: pageProps) => {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const params = await props.params;
  const key = serialize({ ...searchParams });

  return (
    <TaskDetailIndex
      params={{ id: params.slug }} // Assuming slug is used as id
      searchParams={props.searchParams}
      slug={params.slug}
      keyProps={key}
    />
  );
};

export default TaskDetail;