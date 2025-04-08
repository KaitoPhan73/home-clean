import React from "react";
import { Task, TaskStatusEnum } from "./TaskEnums";
import { CheckCircle, Clock, Lock } from "lucide-react";

interface TaskProgressProps {
  tasks: Task[];
  isTaskLocked: (index: number) => boolean;
}

const TaskProgress: React.FC<TaskProgressProps> = ({ tasks, isTaskLocked }) => {
  return (
    <div
      className="sticky top-0 z-10 flex items-center justify-between my-8 px-4 py-3 rounded-lg shadow-sm backdrop-blur-sm backdrop-filter bg-opacity-90 border border-gray-200 bg-gray-50 transition-all duration-300 ease-in-out hover:shadow-md"
    >
      {tasks.map((task, index) => (
        <React.Fragment key={task.id}>
          <div className="flex flex-col items-center z-10">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-md transition-all duration-300 ${
                task.status === TaskStatusEnum.Completed
                  ? "bg-green-500 scale-110"
                  : task.status === TaskStatusEnum.InProgress
                  ? "bg-blue-500 scale-105"
                  : isTaskLocked(index)
                  ? "bg-gray-400 opacity-60"
                  : "bg-gray-400"
              }`}
            >
              {task.status === TaskStatusEnum.Completed ? (
                <CheckCircle className="h-7 w-7" />
              ) : task.status === TaskStatusEnum.InProgress ? (
                <Clock className="h-7 w-7" />
              ) : isTaskLocked(index) ? (
                <Lock className="h-6 w-6" />
              ) : (
                <span className="text-lg">{index + 1}</span>
              )}
            </div>
            <span
              className={`mt-2 text-sm font-medium text-center max-w-24 ${
                task.status === TaskStatusEnum.Completed
                  ? "text-green-700"
                  : task.status === TaskStatusEnum.InProgress
                  ? "text-blue-700"
                  : isTaskLocked(index)
                  ? "text-gray-500"
                  : "text-gray-700"
              }`}
            >
              {task.taskName}
            </span>
          </div>

          {index < tasks.length - 1 && (
            <div className="flex-1 h-1.5 mx-2 bg-gray-200 rounded-full relative">
              <div
                className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-in-out ${
                  task.status === TaskStatusEnum.Completed
                    ? "bg-green-500"
                    : "bg-gray-200"
                }`}
                style={{
                  width:
                    task.status === TaskStatusEnum.Completed ? "100%" : "0%",
                }}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default TaskProgress;