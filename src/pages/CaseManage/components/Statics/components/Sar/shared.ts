export type Source<T> = {
  [key in keyof T]: unknown;
} & {
  time: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseSource = <T extends Record<string, any>>(
  source: Source<T>[],
  time: number,
  value: T
) => {
  source.push({
    time,
    ...value,
  });
};

export function omit<T, K extends keyof T>(
  obj: T,
  ...keysToOmit: K[]
): Omit<T, K> {
  const result = { ...obj };
  keysToOmit.forEach((key) => {
    delete result[key];
  });
  return result;
}

export const praseArrayUsage = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<string, any>,
  Key extends keyof T
>(
  source: Array<{
    label: string;
    value: Source<Omit<T, Key>>[];
  }>,
  labelKey: Key,
  time: number,
  value: T[]
) => {
  value.forEach((v, index) => {
    if (!source[index]) {
      source[index] = {
        label: v[labelKey],
        value: [],
      };
    }
    const nv = omit(v, labelKey);
    source[index].value.push({
      time,
      ...nv,
    });
  });
};
