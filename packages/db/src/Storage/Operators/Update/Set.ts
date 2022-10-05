import { deepEqual } from "fast-equals";
import { Query } from "mingo";
import type { RawObject } from "mingo/types";

import { clone } from "../../../Clone";
import { dot } from "../../../Dot";
import { Document } from "../../Storage";
import type { Update } from "../Operators";

/**
 * Execute a $set based operators.
 *
 * Supports positional array operator $(update)
 *
 * @see https://www.mongodb.com/docs/manual/reference/operator/update/positional
 *
 * @param document - Document being updated.
 * @param criteria - Search criteria provided with the operation. Eg. updateOne({ id: "1" })
 * @param $set     - $set action being executed.
 */
export function $set(document: Document, criteria: RawObject, $set: Update["operators"]["$set"] = {}): boolean {
  let modified = false;
  for (const key in $set) {
    if (key.includes("$")) {
      if (setPositionalData(document, criteria, $set, key)) {
        modified = true;
      }
    } else {
      document = dot.setProperty(document, key, $set[key]);
      modified = true;
    }
  }
  return modified;
}

/**
 * When a $set key includes a '$' identifier we execute the $set as a $(position)
 * positional operation.
 *
 * @param document - Document being updated.
 * @param criteria - Search criteria provided with the operation. Eg. updateOne({ id: "1" })
 * @param $set     - $set action being executed.
 * @param key      - Key containing the '$' identifier.
 *
 * @returns True if the document was modified.
 */
function setPositionalData(document: Document, criteria: RawObject, $set: RawObject, key: string): boolean {
  const { filter, path, target } = getPositionalFilter(criteria, key);

  const values = dot.getProperty(document, path);
  if (values === undefined) {
    throw new Error("NOT ARRAY");
  }

  let items: any[];
  if (typeof filter === "object") {
    items = getPositionalUpdateQuery(clone(values), $set, key, filter, target);
  } else {
    items = getPositionalUpdate(clone(values), $set, key, filter);
  }

  dot.setProperty(document, path, items);

  return deepEqual(values, items) === false;
}

function getPositionalFilter(
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

function getPositionalUpdate(items: any[], $set: any, key: string, filter: string): any[] {
  let index = 0;
  for (const item of items) {
    if (item === filter) {
      items[index] = $set[key];
      break;
    }
    index += 1;
  }
  return items;
}

function getPositionalUpdateQuery(items: any[], $set: any, key: string, filter: RawObject, target: string): any[] {
  let index = 0;
  for (const item of items) {
    if (new Query(filter).test(item) === true) {
      if (target === "") {
        items[index] = $set[key];
      } else {
        dot.setProperty(item, target, $set[key]);
      }
      break;
    }
    index += 1;
  }
  return items;
}
