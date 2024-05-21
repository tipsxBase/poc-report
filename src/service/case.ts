import { CommonEntity, PageResult, PaginationParam } from "@/stores/SharedType";
import { invoke } from "@tauri-apps/api/tauri";

export interface CaseParams extends PaginationParam {
  case_id?: number;
  category_id?: string;
  category_name?: string;
  case_name?: string;
  case_content?: string;
}

export interface CaseEntity extends CommonEntity {
  case_id?: number;
  category_id?: string;
  category_name?: string;
  case_name?: string;
  case_content?: string;
}

export interface CaseMetric {
  metric_id: number;
  case_id: number;
  job_id: string;
  total_statement: number;
  avg_statement_cast_mills: number;
  avg_sql_cast_mills: number;
  statement_qps: number;
  sql_qps: number;
  write_mib_pre_second: number;
  start_mills: number;
  end_mills: number;
  execute_time: string;
  p80: number;
  p95: number;
  avg_row_width: number;
}

export const queryCaseList = async (params: CaseParams) => {
  const res: PageResult<CaseEntity> = await invoke("query_case_list", {
    case: {
      case_name: params.case_name ?? null,
      category_id: params.category_id ?? null,
    },
    current: params.current,
    size: params.pageSize,
  });
  return res;
};

export const deleteCase = async (params: CaseEntity) => {
  return await invoke("delete_case", {
    case: params,
  });
};

export const insertCase = (params: CaseEntity) => {
  return invoke("insert_case", {
    case: params,
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

export const updateCase = async (params: CaseEntity) => {
  return invoke("update_case", {
    case: params,
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

export const insertMetric = (params: CaseMetric) => {
  return invoke("insert_metric", {
    case: params,
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
