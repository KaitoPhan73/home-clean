/* eslint-disable @typescript-eslint/no-explicit-any */
import { getTaskById } from "@/apis/laudry/task";
import TaskDetail from "./TaskDetail";
import { TTaskResponse } from "@/schema/VinLaudry/task.schema";
import { notFound } from "next/navigation";

type TaskStatus = "Completed" | "Pending" | "inProgress";

type Props = {
  id: string;
  keyProps: string;
};

export default async function TaskDetailAsync({ id }: Props) {
  if (!id || id === "undefined") {
    notFound();
  }

  try {
    const response = await getTaskById(id);
    const task: TTaskResponse = response.payload;

    // Validate status
    const validStatuses: TaskStatus[] = ["Completed", "Pending", "inProgress"];
    if (!validStatuses.includes(task.status as TaskStatus)) {
      task.status = "Pending";
    }

    return <TaskDetail task={task as TTaskResponse & { status: TaskStatus }} />;
  } catch (error: any) {
    console.error("Failed to fetch task:", error);
    notFound();
  }
}
