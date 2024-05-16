export function enumToSelectOptions<T extends Record<string, unknown>>(
  enumObject: T,
  filter: (key: any) => boolean = () => true
): Array<{
  value: keyof T;
  label: string;
}> {
  const options = Object.keys(enumObject).map((key) => ({
    label: enumObject[key] as string,
    value: key,
  }));

  return options.filter((o) => filter(o.value));
}
