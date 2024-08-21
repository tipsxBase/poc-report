import {
  deleteCompletedTask,
  deleteTask,
  queryTaskList,
  TaskEntity,
  TaskParams,
} from "@/service/task";
import { create } from "zustand";
import { PaginationParam } from "./SharedType";
import { normalizePageResult } from "@/shared/pageResult";
import { TauriCommandResponse } from "@/service/fetch";

interface TaskStore {
  pagination: PaginationParam;
  records: TaskEntity[];
  loading: boolean;
  onPaginationChange: (current: number, pageSize: number) => void;
  resetPagination: () => void;
  fetchTaskList: (params: Partial<TaskParams>) => Promise<void>;
  deleteCompletedTask: () => Promise<TauriCommandResponse<number>>;
  deleteTask: (taskId: number) => Promise<TauriCommandResponse<number>>;
}

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

export const taskStatusOption = [
  {
    label: "未开始",
    value: TaskStatus.NotStarted,
  },
  {
    label: "进行中",
    value: TaskStatus.InProgress,
  },
  {
    label: "已完成",
    value: TaskStatus.Completed,
  },
  {
    label: "失败",
    value: TaskStatus.Failed,
  },
];

export const taskTypeOption = [
  {
    label: "下载任务",
    value: TaskType.DownloadTask,
  },
  {
    label: "上传任务",
    value: TaskType.UploadTask,
  },
];

const useTaskStore = create<TaskStore>((set, get) => ({
  pagination: {
    current: 1,
    pageSize: 10,
  },
  records: [],
  loading: false,
  onPaginationChange: (current: number, pageSize: number) => {
    set((state) => {
      return {
        pagination: {
          ...state.pagination,
          current,
          pageSize,
        },
      };
    });
  },

  resetPagination: () => {
    set((state) => {
      return {
        pagination: {
          ...state.pagination,
          current: 1,
          pageSize: 10,
        },
      };
    });
  },
  fetchTaskList: async (params) => {
    const { pageSize, current } = get().pagination;
    const searchParams = {
      ...params,
      pageSize,
      current,
    };
    set(() => {
      return {
        loading: true,
      };
    });
    const res = await queryTaskList(searchParams);
    set(() => {
      return {
        pagination: {
          current: res.page_no,
          pageSize: res.page_size,
          total: res.total,
        },
        records: normalizePageResult(res.data, res.page_size, res.page_no),
        loading: false,
      };
    });
  },

  deleteCompletedTask: () => {
    return deleteCompletedTask();
  },

  deleteTask: (taskId: number) => {
    return deleteTask(taskId);
  },
}));

export default useTaskStore;
