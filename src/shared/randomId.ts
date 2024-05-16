export const randomId = (prefix: string = "random") => {
  const randomValue = Math.random() * Date.now();
  return `${prefix}_${randomValue.toString(16)}`;
};
