import { create } from "zustand";
import { PaginationParam } from "./SharedType";
import {
  deleteInitialTask,
  downloadScript,
  inertInitialTask,
  InitialTaskEntity,
  InitialTaskParams,
  queryInitialTaskList,
  updateInitialTask,
  uploadScript,
} from "@/service/initial_task";
import { normalizePageResult } from "@/shared/pageResult";
import { TauriCommandResponse } from "@/service/fetch";

export enum DataInitialTaskType {
  DATABASE_INITIAL = "DatabaseInitial",
  DATA_INITIAL = "DataInitial",
}

interface InitialStore {
  taskTypeOptions: { label: string; value: string }[];
  pagination: PaginationParam;
  records: InitialTaskEntity[];
  loading: boolean;
  getTaskTypeLabel: (taskType: DataInitialTaskType) => string;
  onPaginationChange: (current: number, pageSize: number) => void;
  resetPagination: () => void;
  fetchTaskList: (params: Partial<InitialTaskParams>) => Promise<void>;
  deleteInitialTask: (
    params: Partial<InitialTaskParams>
  ) => Promise<TauriCommandResponse<number>>;
  insertInitialTask: (
    params: InitialTaskEntity
  ) => Promise<TauriCommandResponse<number>>;
  updateInitialTask: (
    params: InitialTaskEntity
  ) => Promise<TauriCommandResponse<number>>;

  downloadScript: (
    scriptData: any,
    fileDir: string,
    fileName: string
  ) => Promise<TauriCommandResponse<string>>;

  uploadScript: (scriptData: any) => Promise<TauriCommandResponse<string>>;
}

export interface InitialTaskProps {
  task_type: DataInitialTaskType;
}

const UseInitialStore = create<InitialStore>((set, get) => ({
  taskTypeOptions: [
    {
      label: "数据库初始化",
      value: DataInitialTaskType.DATABASE_INITIAL,
    },
    {
      label: "数据初始化",
      value: DataInitialTaskType.DATA_INITIAL,
    },
  ],
  getTaskTypeLabel: (taskType: DataInitialTaskType) => {
    const taskTypeOptions = get().taskTypeOptions;
    const found = taskTypeOptions.find((t) => t.value === taskType);
    return found ? found.label : "-";
  },
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
    const res = await queryInitialTaskList(searchParams);
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
  deleteInitialTask: (params: InitialTaskEntity) => {
    return deleteInitialTask(params);
  },
  insertInitialTask: (params: InitialTaskEntity) => {
    return inertInitialTask(params);
  },
  updateInitialTask: (params: InitialTaskEntity) => {
    return updateInitialTask(params);
  },

  downloadScript: (scriptData: any, fileDir: string, fileName: string) => {
    return downloadScript(scriptData, fileDir, fileName);
  },
  uploadScript: (scriptData: any) => {
    return uploadScript(scriptData);
  },
}));

export default UseInitialStore;
