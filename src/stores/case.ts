import { create } from "zustand";
import { PaginationParam } from "./SharedType";

import { normalizePageResult } from "@/shared/pageResult";
import {
  CaseEntity,
  CaseParams,
  deleteCase,
  insertCase,
  queryCaseList,
  updateCase,
} from "@/service/case";

interface CaseStore {
  pagination: PaginationParam;
  records: CaseEntity[];
  fetchCaseList: (params: Partial<CaseParams>) => Promise<void>;
  onPaginationChange: (current: number, pageSize: number) => void;
  resetPagination: () => void;
  deleteCase: (params: CaseEntity) => Promise<unknown>;
  insertCase: (params: CaseEntity) => Promise<unknown>;
  updateCase: (params: CaseEntity) => Promise<unknown>;
}

const useCaseStore = create<CaseStore>((set, get) => ({
  pagination: {
    current: 1,
    pageSize: 10,
  },
  records: [],
  fetchCaseList: async (params: Partial<CaseParams>) => {
    const { pageSize, current } = get().pagination;
    const searchParams = {
      ...params,
      pageSize,
      current,
    };
    const res = await queryCaseList(searchParams);
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
  deleteCase: (params: CaseEntity) => {
    return deleteCase(params);
  },

  insertCase: (params: CaseEntity) => {
    return insertCase(params);
  },

  updateCase: (params: CaseEntity) => {
    return updateCase(params);
  },
}));

export default useCaseStore;
