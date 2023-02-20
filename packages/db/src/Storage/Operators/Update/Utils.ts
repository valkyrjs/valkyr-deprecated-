import type { RawObject } from "mingo/types.js";

export function getPositionalFilter(
  criteria: RawObject,
  key: string
): {
  filter: any;
  path: string;
  target: string;
} {
  const [leftPath, rightPath] = key.split("$");

  const lKey = trimSeparators(leftPath);
  const rKey = trimSeparators(rightPath);

  for (const key in criteria) {
    const result = getPositionalCriteriaFilter(key, lKey, rKey, criteria);
    if (result !== undefined) {
      return result;
    }
  }

  return {
    filter: criteria[lKey],
    path: lKey,
    target: rKey
  };
}

function trimSeparators(value: string): string {
  return value.replace(/^\.+|\.+$/gm, "");
}

function getPositionalCriteriaFilter(
  key: string,
  lKey: string,
  rKey: string,
  criteria: RawObject
):
  | {
      filter: any;
      path: string;
      target: string;
    }
  | undefined {
  if (key.includes(lKey) === true) {
    const isObject = typeof criteria[key] === "object";
    if (key.includes(".") === true || isObject === true) {
      return {
        filter:
          trimSeparators(key.replace(lKey, "")) === ""
            ? (criteria[key] as any).$elemMatch !== undefined
              ? (criteria[key] as any).$elemMatch
              : criteria[key]
            : {
                [trimSeparators(key.replace(lKey, ""))]: criteria[key]
              },
        path: lKey,
        target: rKey
      };
    }
  }
  return undefined;
}
