import { CommonEntity } from "@/stores/SharedType";

export const normalizePageResult = <T extends CommonEntity>(
  records: T[],
  pageSize: number,
  current: number
) => {
  return records.map((item, index) => {
    item.__seriesNumber__ = (current - 1) * pageSize + index + 1;
    return item;
  });
};
