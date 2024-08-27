export const toFormPath = (...args: string[]) => {
  return args.join(".");
};

export const formPathGenerator = (parentField: string) => {
  return (...args: string[]) => {
    return toFormPath(parentField, ...args);
  };
};
