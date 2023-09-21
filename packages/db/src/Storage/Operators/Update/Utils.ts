import * as dot from "dot-prop";
import { deepEqual } from "fast-equals";
import { Query } from "mingo";

import { clone } from "../../../Clone.js";
import { Document, Filter, WithId } from "../../../Types.js";

type UpdateValue = (data: any, key: string, target: string) => any;

export function setPositionalData<TSchema extends Document = Document>(
  document: WithId<TSchema>,
  criteria: Filter<WithId<TSchema>>,
  key: string,
  update: {
    object: UpdateValue;
    value: UpdateValue;
  }
): boolean {
  const { filter, path, target } = getPositionalFilter(criteria, key);

  const values = getPropertyValues(document, path);
  const items =
    typeof filter === "object"
      ? getPositionalUpdateQuery(clone(values), key, filter, target, update.object)
      : getPositionalUpdate(clone(values), key, filter, target, update.value);

  dot.setProperty(document, path, items);

  return deepEqual(values, items) === false;
}

function getPropertyValues(document: Document, path: string): string[] {
  const values = dot.getProperty(document, path);
  if (values === undefined) {
    throw new Error("Values is undefined");
  }
  if (Array.isArray(values) === false) {
    throw new Error("Values is not an array");
  }
  return values;
}

export function getPositionalUpdate(
  items: any[],
  key: string,
  filter: string,
  target: string,
  updateValue: UpdateValue
): any[] {
  let index = 0;
  for (const item of items) {
    if (item === filter) {
      items[index] = updateValue(items[index], key, target);
      break;
    }
    index += 1;
  }
  return items;
}

export function getPositionalUpdateQuery(
  items: any[],
  key: string,
  filter: Filter<any>,
  target: string,
  updateValue: UpdateValue
): any[] {
  let index = 0;
  for (const item of items) {
    if (new Query(filter).test(item) === true) {
      if (target === "") {
        items[index] = updateValue(items[index], key, target);
      } else {
        dot.setProperty(item, target, updateValue(items[index], key, target));
      }
      break;
    }
    index += 1;
  }
  return items;
}

export function getPositionalFilter(criteria: Filter<any>, key: string): PositionalFilter {
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

function getPositionalCriteriaFilter(
  key: string,
  lKey: string,
  rKey: string,
  criteria: Filter<any>
): PositionalFilter | undefined {
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

function trimSeparators(value: string): string {
  return value.replace(/^\.+|\.+$/gm, "");
}

/**
 * A position filter is used to find documents to update in an array of values.
 *
 * @example
 *
 * ```ts
 * const document = {
 *   grades: [
 *     { grade: 80, mean: 75, std: 8 },
 *     { grade: 85, mean: 90, std: 5 },
 *     { grade: 85, mean: 85, std: 8 }
 *   ]
 * }
 *
 * updateOne({ "grades.grade": 85 }, { $set: { "grades.$.std": 6 } } })
 * ```
 *
 * In the above example the filter would be `{ grade: 85 }` which is used to find
 * objects to update in an array of values.
 */
type PositionalFilter = {
  /**
   * The filter to use to find the values to update in an array.
   */
  filter: any;

  /**
   * The path to the array of values of the parent document. Eg. `grades`.
   */
  path: string;

  /**
   * The path to the key to update in the array of values. Eg. `std`.
   */
  target: string;
};
