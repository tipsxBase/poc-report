export interface PaginationParam {
  current: number;
  pageSize: number;
  total?: number;
}

export interface CommonEntity {
  __seriesNumber__?: number;
}

export interface PageResult<T> {
  page_no: number;
  page_size: number;
  total: number;
  records: T[];
}
