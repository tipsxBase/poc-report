import { create } from "zustand";
import { PaginationParam } from "./SharedType";

import { normalizePageResult } from "@/shared/pageResult";
import {
  DdlEntity,
  DdlParams,
  deleteDdl,
  insertDdl,
  queryDdlList,
  updateDdl,
  uploadDdl,
} from "@/service/ddl";

interface DdlStore {
  pagination: PaginationParam;
  records: DdlEntity[];
  fetchDdlList: (params: Partial<DdlParams>) => Promise<void>;
  onPaginationChange: (current: number, pageSize: number) => void;
  resetPagination: () => void;
  deleteDdl: (params: DdlEntity) => Promise<unknown>;
  insertDdl: (params: DdlEntity) => Promise<unknown>;
  updateDdl: (params: DdlEntity) => Promise<unknown>;
  uploadDdl: (ddlName: string, ddlContent: string) => Promise<unknown>;
}

const useDdlStore = create<DdlStore>((set, get) => ({
  pagination: {
    current: 1,
    pageSize: 10,
  },
  records: [],
  fetchDdlList: async (params: Partial<DdlParams>) => {
    const { pageSize, current } = get().pagination;
    const searchParams = {
      ...params,
      pageSize,
      current,
    };
    const res = await queryDdlList(searchParams);
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
  deleteDdl: (params: DdlEntity) => {
    return deleteDdl(params);
  },

  insertDdl: (params: DdlEntity) => {
    return insertDdl(params);
  },

  updateDdl: (params: DdlEntity) => {
    return updateDdl(params);
  },

  uploadDdl: (ddlName: string, ddlContent: string) => {
    return uploadDdl(ddlName, ddlContent);
  },
}));

export default useDdlStore;
