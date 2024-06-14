import { CommonEntity, PageResult, PaginationParam } from "@/stores/SharedType";
import { invoke } from "@tauri-apps/api/tauri";

export interface ServerParams extends PaginationParam {
  server_id?: number;
  server_name?: string;
  category_id?: number;
  category_name?: string;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  is_default?: number;
}

export interface ServerEntity extends CommonEntity {
  server_id?: number;
  server_name?: string;
  category_id?: number;
  category_name?: string;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  is_default?: number;
  initial_state?: number;
}

export const queryServerList = async (params: ServerParams) => {
  const res: PageResult<ServerEntity> = await invoke("query_server_list", {
    server: {
      server_name: params.server_name ?? null,
      category_id: params.category_id ?? null,
    },
    current: params.current,
    size: params.pageSize,
  });
  return res;
};

export const queryAllServerList = async () => {
  const res: PageResult<ServerEntity> = await invoke("query_all_server_list");
  return res;
};

export const deleteServer = async (params: ServerEntity) => {
  return await invoke("delete_server", {
    server: params,
  });
};

export const insertServer = (params: ServerEntity) => {
  return invoke("insert_server", {
    server: params,
  }).then((res) => {
    const { Ok, Err } = res as any;
    if (Ok) {
      return Promise.resolve(Ok);
    }
    if (Err) {
      return Promise.reject(Err.E);
    }
  });
};

export const updateServer = async (params: ServerEntity) => {
  return invoke("update_server", {
    server: params,
  }).then((res) => {
    const { Ok, Err } = res as any;
    if (Ok) {
      return Promise.resolve(Ok);
    }
    if (Err) {
      return Promise.reject(Err.E);
    }
  });
};

export const updateCheckDefaultServer = async (serverId: number) => {
  return invoke("update_server_check_default", {
    serverId,
  }).then((res) => {
    const { Ok, Err } = res as any;
    if (Ok) {
      return Promise.resolve(Ok);
    }
    if (Err) {
      return Promise.reject(Err.E);
    }
  });
};

export const initServer = async (serverId: number) => {
  return invoke("server_init", {
    serverId,
  });
};
