import { tauriInvoke, tauriPageInvoke } from "./fetch/index";
import { CommonEntity, PaginationParam } from "@/stores/SharedType";

export enum TaskStatus {
  Failed = 0,
  NotStarted = 1,
  InProgress = 2,
  Completed = 3,
}

export enum TaskType {
  DownloadTask = 0,
  UploadTask = 1,
}

export interface TaskEntity extends CommonEntity {
  task_id?: number;
  task_name?: string;
  task_status?: TaskStatus;
  task_progress?: number;
  task_type?: TaskType;
  task_payload?: string;
}

export interface TaskParams extends PaginationParam {
  task_name?: string;
  task_status?: TaskStatus;
  task_type?: TaskType;
}

export const queryTaskList = (param: TaskParams) => {
  return tauriPageInvoke<TaskEntity[]>("query_task_list", {
    task: {
      task_name: param.task_name,
      task_status: param.task_status,
      task_type: param.task_type,
    },
    current: param.current,
    size: param.pageSize,
  });
};

export const deleteCompletedTask = () => {
  return tauriInvoke<number>("delete_completed_task");
};

export const deleteTask = (taskId: number) => {
  return tauriInvoke<number>("delete_by_id", {
    taskId,
  });
};
