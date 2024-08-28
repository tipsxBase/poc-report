import { tauriInvoke, tauriPageInvoke } from "./fetch/index";
import { CommonEntity, PaginationParam } from "@/stores/SharedType";

export interface InitialTaskEntity extends CommonEntity {
  task_id?: number;
  task_name?: string;
  category_id?: number;
  category_name?: string;
  task_description?: string;
  task_config?: string;
}

export interface InitialTaskParams extends PaginationParam {
  task_name?: string;
  category_id?: number;
}

export const queryInitialTaskList = (param: InitialTaskParams) => {
  return tauriPageInvoke<InitialTaskEntity[]>("query_initial_task_list", {
    task: {
      task_name: param.task_name,
      category_id: param.category_id,
    },
    current: param.current,
    size: param.pageSize,
  });
};

export const updateInitialTask = (task: InitialTaskEntity) => {
  return tauriInvoke<number>("update_initial_task", {
    task,
  });
};

export const deleteInitialTask = (task: InitialTaskEntity) => {
  return tauriInvoke<number>("delete_initial_task", {
    task,
  });
};

export const inertInitialTask = (task: InitialTaskEntity) => {
  return tauriInvoke<number>("insert_initial_task", {
    task,
  });
};

export const downloadScript = (
  scriptData: any,
  fileDir: string,
  fileName: string
) => {
  return tauriInvoke<string>("download_script", {
    scriptData,
    fileDir,
    fileName,
  });
};

export const uploadScript = (scriptData: any) => {
  return tauriInvoke<string>("upload_script", {
    scriptData,
  });
};
