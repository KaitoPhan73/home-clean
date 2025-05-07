import { DataTable } from "@/components/table/data-table";
import { searchParamsCache } from "@/lib/searchparams";
import { getAllTasks } from "@/apis/laudry/task";
import { taskColumns } from "@/app/(dashboard)/admin/tasks/_components/task-tables/columns";

const TaskTable = async () => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("search");
  const size = searchParamsCache.get("size");

  const filters = {
    page,
    size,
    ...(search && { search }), // API cần hỗ trợ tìm kiếm taskName, taskCode, id
  };

  const taskResponse = await getAllTasks(filters);
  const taskPayload = taskResponse.payload;

  return (
    <div>
      <DataTable
        data={taskPayload.items}
        columns={taskColumns}
        totalItems={taskPayload.total}
      />
    </div>
  );
};

export default TaskTable;
