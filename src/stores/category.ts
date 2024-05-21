import { create } from "zustand";
import { PaginationParam } from "./SharedType";

import { normalizePageResult } from "@/shared/pageResult";
import {
  CategoryEntity,
  CategoryParams,
  deleteCategory,
  insertCategory,
  queryCategoryList,
  updateCategory,
} from "@/service/category";

interface CategoryStore {
  pagination: PaginationParam;
  records: CategoryEntity[];
  fetchCategoryList: (params: Partial<CategoryParams>) => Promise<void>;
  onPaginationChange: (current: number, pageSize: number) => void;
  resetPagination: () => void;
  deleteCategory: (params: CategoryEntity) => Promise<unknown>;
  insertCategory: (params: CategoryEntity) => Promise<unknown>;
  updateCategory: (params: CategoryEntity) => Promise<unknown>;
}

const useCategoryStore = create<CategoryStore>((set, get) => ({
  pagination: {
    current: 1,
    pageSize: 10,
  },
  records: [],
  fetchCategoryList: async (params: Partial<CategoryParams>) => {
    const { pageSize, current } = get().pagination;
    const searchParams = {
      ...params,
      pageSize,
      current,
    };
    const res = await queryCategoryList(searchParams);
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
  deleteCategory: (params: CategoryEntity) => {
    return deleteCategory(params);
  },

  insertCategory: (params: CategoryEntity) => {
    return insertCategory(params);
  },

  updateCategory: (params: CategoryEntity) => {
    return updateCategory(params);
  },
}));

export default useCategoryStore;
