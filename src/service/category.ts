import { isNullOrUndefined } from "@/shared/is";
import { CommonEntity, PageResult, PaginationParam } from "@/stores/SharedType";
import { invoke } from "@tauri-apps/api/tauri";
import { tauriInvoke } from "./fetch";
import { ServerEntity } from "./server";

export enum CategoryType {
  BuiltIn = 1,
  UserDefine = 2,
}

export interface CategoryParams extends PaginationParam {
  category_id?: number;
  category_name?: string;
  category_type?: CategoryType;
}

export interface CategoryEntity extends CommonEntity {
  category_id?: number;
  category_name?: string;
  server_id?: number;
  server_name?: string;
}

export const queryCategoryList = async (params: CategoryParams) => {
  const res: PageResult<CategoryEntity> = await invoke("query_category_list", {
    category: { category_name: params.category_name ?? "" },
    current: params.current,
    size: params.pageSize,
  });
  return res;
};

export const deleteCategory = async (params: CategoryEntity) => {
  return await invoke("delete_category", {
    category: params,
  });
};

export const insertCategory = async (params: CategoryEntity) => {
  return await invoke("insert_category", {
    category: params,
  });
};

export const updateCategory = async (params: CategoryEntity) => {
  return await invoke("update_category", {
    category: params,
  });
};

export const queryCategoryForOptions = async () => {
  const res: Array<CategoryEntity> = await invoke("query_category_all");
  return res.map((item) => {
    const { category_id, category_name } = item;
    return {
      label: category_name,
      value: category_id,
    };
  });
};

/**
 * 查询可用的项目，只有关联服务的项目才可用
 * @returns
 */
export const queryCategoryForEnableOptions = async () => {
  const res: Array<CategoryEntity> = await invoke("query_category_all");
  return res
    .filter((item) => !isNullOrUndefined(item.server_id))
    .map((item) => {
      const { category_id, category_name } = item;
      return {
        label: category_name,
        value: category_id,
      };
    });
};

export const queryRefServer = (categoryId: number) => {
  return tauriInvoke<ServerEntity>("select_ref_server", {
    categoryId,
  });
};
