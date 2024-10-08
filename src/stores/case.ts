import { create } from "zustand";
import { PaginationParam } from "./SharedType";

import { normalizePageResult } from "@/shared/pageResult";
import {
  CaseEntity,
  CaseMetric,
  CaseParams,
  CaseStatic,
  StaticType,
  deleteCase,
  downloadImage,
  insertCase,
  insertMetric,
  insertStatics,
  queryCaseList,
  resetOrder,
  runCase,
  selectMetric,
  selectStatics,
  updateCase,
} from "@/service/case";
import { TauriCommandResponse } from "@/service/fetch";

interface CaseStore {
  pagination: PaginationParam;
  records: CaseEntity[];
  fetchCaseList: (params: Partial<CaseParams>) => Promise<void>;
  onPaginationChange: (current: number, pageSize: number) => void;
  resetPagination: () => void;
  deleteCase: (params: CaseEntity) => Promise<unknown>;
  insertCase: (params: CaseEntity) => Promise<unknown>;
  updateCase: (params: CaseEntity) => Promise<unknown>;
  insertMetric: (params: CaseMetric[]) => Promise<unknown>;
  insertStatics: (params: CaseStatic[]) => Promise<unknown>;
  selectStatics: (
    case_id: number,
    statics_type: StaticType
  ) => Promise<CaseStatic[]>;
  selectMetrics: (case_id: number) => Promise<CaseMetric[]>;
  runCase: (caseName: string, caseContent: string) => Promise<unknown>;
  downloadImage: (
    imageData: Record<string, string>,
    fileDir: string,
    case_name: string
  ) => Promise<unknown>;
  resetOrder: (
    case_id: number,
    params: CaseEntity,
    direction: "forward" | "backward"
  ) => Promise<TauriCommandResponse<string>>;
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

  insertMetric: (params: CaseMetric[]) => {
    return insertMetric(params);
  },

  insertStatics: (params: CaseStatic[]) => {
    return insertStatics(params);
  },

  selectStatics: (case_id, statics_type) => {
    return selectStatics(case_id, statics_type);
  },

  selectMetrics: (case_id) => {
    return selectMetric(case_id);
  },

  runCase: (caseName: string, caseContent: string) => {
    return runCase(caseName, caseContent);
  },

  downloadImage: (
    imageData: Record<string, string>,
    fileDir: string,
    case_name: string
  ) => {
    return downloadImage(imageData, fileDir, case_name);
  },

  resetOrder(case_id, params, direction) {
    return resetOrder(case_id, params, direction);
  },
}));

export default useCaseStore;
