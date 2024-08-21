export const isBuildInCategory = (category: number) => {
  return process.env.NODE_ENV === "production" && category === 1;
};
