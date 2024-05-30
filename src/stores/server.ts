import { create } from "zustand";
import { PaginationParam } from "./SharedType";

import { normalizePageResult } from "@/shared/pageResult";
import {
  ServerEntity,
  ServerParams,
  deleteServer,
  initServer,
  insertServer,
  queryServerList,
  updateCheckDefaultServer,
  updateServer,
} from "@/service/server";

interface ServerStore {
  pagination: PaginationParam;
  records: ServerEntity[];
  fetchServerList: (params: Partial<ServerParams>) => Promise<void>;
  onPaginationChange: (current: number, pageSize: number) => void;
  resetPagination: () => void;
  deleteServer: (params: ServerEntity) => Promise<unknown>;
  insertServer: (params: ServerEntity) => Promise<unknown>;
  updateServer: (params: ServerEntity) => Promise<unknown>;
  updateCheckDefaultServer: (serverId: number) => Promise<unknown>;
  initServer: (serverId: number) => Promise<unknown>;
}

const useServerStore = create<ServerStore>((set, get) => ({
  pagination: {
    current: 1,
    pageSize: 10,
  },
  records: [],
  fetchServerList: async (params: Partial<ServerParams>) => {
    const { pageSize, current } = get().pagination;
    const searchParams = {
      ...params,
      pageSize,
      current,
    };
    const res = await queryServerList(searchParams);
    set(() => {
      return {
        pagination: {
          current: res.page_no,
          pageSize: res.page_size,
          total: res.total,
        },
        records: normalizePageResult(res.records, res.page_size, res.page_no),
      };
    });
  },

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
  deleteServer: (params: ServerEntity) => {
    return deleteServer(params);
  },

  insertServer: (params: ServerEntity) => {
    return insertServer(params);
  },

  updateServer: (params: ServerEntity) => {
    return updateServer(params);
  },

  updateCheckDefaultServer: (serverId: number) => {
    return updateCheckDefaultServer(serverId);
  },

  initServer: (serverId: number) => {
    return initServer(serverId);
  },
}));

export default useServerStore;
