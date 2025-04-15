import PageContainer from "@/components/layout/page-container";
import React, { Suspense } from "react";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { Heading } from "@/components/ui/headling";
import { Separator } from "@/components/ui/separator";
import TaskTable from "@/app/(dashboard)/admin/tasks/_components/task-table";
import TaskTableAction from "@/app/(dashboard)/admin/tasks/_components/task-tables/task-table-action";
import { TaskTableFiltersProvider } from "@/app/(dashboard)/admin/tasks/_components/task-tables/use-task-table-filters";

type Props = {
  keyProps: string;
};

const TaskIndex = ({ keyProps }: Props) => {
  return (
    <PageContainer>
      <div className="space-y-4">
        <Heading title="Nhiệm Vụ" description="Quản lí các nhiệm vụ giặt sấy" />
        <Separator />
        <TaskTableFiltersProvider>
          <TaskTableAction /> {/* Di chuyển vào trong Provider */}
          <Suspense
            key={keyProps}
            fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
          >
            <TaskTable />
          </Suspense>
        </TaskTableFiltersProvider>
      </div>
    </PageContainer>
  );
};

export default TaskIndex;
