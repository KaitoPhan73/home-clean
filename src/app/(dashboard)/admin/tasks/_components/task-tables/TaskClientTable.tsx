/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { DataTable } from "@/components/table/data-table";
import { taskColumns } from "./columns";
import { useTaskTableFilters } from "./use-task-table-filters";
import { useEffect, useState } from "react";
import { TTaskResponse } from "@/schema/VinLaudry/task.schema";

interface TaskTableProps {
  initialData: {
    items: TTaskResponse[];
    totalPages: number;
    currentPage: number;
  };
}

const TaskClientTable = ({ initialData }: TaskTableProps) => {
  const [data, setData] = useState(initialData.items);
  const { status, searchQuery } = useTaskTableFilters();

  // Filter data client-side based on search and status
  useEffect(() => {
    let filteredData = [...initialData.items];

    // Apply status filter
    if (status) {
      filteredData = filteredData.filter((item) => item.status === status);
    }

    // Apply search filter (taskName, taskCode, id)
    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      filteredData = filteredData.filter(
        (item) =>
          item.taskName?.toLowerCase().includes(search) ||
          item.taskCode?.toLowerCase().includes(search) ||
          item.id?.toLowerCase().includes(search)
      );
    }

    setData(filteredData);
  }, [initialData.items, status, searchQuery]);

  return (
    <div>
      <DataTable
        data={data}
        columns={taskColumns}
        totalItems={initialData.items.length}
      />
    </div>
  );
};

export default TaskClientTable;
