import { CommonEntity, PageResult, PaginationParam } from "@/stores/SharedType";
import { invoke } from "@tauri-apps/api/tauri";

export interface DdlParams extends PaginationParam {
  ddl_id?: number;
  category_id?: string;
  ddl_name?: string;
}

export interface DdlEntity extends CommonEntity {
  ddl_id?: number;
  ddl_name?: string;
  ddl_content?: string;
  category_id?: string;
  category_name?: string;
}

export const queryDdlList = async (params: DdlParams) => {
  const res: PageResult<DdlEntity> = await invoke("query_ddl_list", {
    ddl: {
      ddl_name: params.ddl_name ?? null,
      category_id: params.category_id ?? null,
    },
    current: params.current,
    size: params.pageSize,
  });
  return res;
};

export const deleteDdl = async (params: DdlEntity) => {
  return await invoke("delete_ddl", {
    ddl: params,
  });
};

export const insertDdl = async (params: DdlEntity) => {
  const res = await invoke("insert_ddl", {
    ddl: params,
  });
  const { Ok, Err } = res as any;
  if (Ok) {
    return Promise.resolve(Ok);
  }
  if (Err) {
    return Promise.reject(Err.E);
  }
};

export const updateDdl = async (params: DdlEntity) => {
  const res = await invoke("update_ddl", {
    ddl: params,
  });
  const { Ok, Err } = res as any;
  if (Ok) {
    return Promise.resolve(Ok);
  }
  if (Err) {
    return Promise.reject(Err.E);
  }
};

export const uploadDdl = async (ddlName: string, ddlContent: string) => {
  return invoke("upload_ddl", {
    ddlName,
    ddlContent,
  });
};
