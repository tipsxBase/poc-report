import numbro from "numbro";

numbro.setLanguage("zh-CN");

export const formatNumber = (value: number) => {
  return numbro(value).format({ thousandSeparated: true });
};

export const unformatNumber = (value: string) => {
  return numbro.unformat(value);
};
