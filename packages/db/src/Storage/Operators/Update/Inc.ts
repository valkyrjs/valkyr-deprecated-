import { deepEqual } from "fast-equals";
import { Query } from "mingo";
import type { RawObject } from "mingo/types.js";

import { clone } from "../../../Clone.js";
import { dot } from "../../../Dot.js";
import { Document } from "../../Storage.js";
import type { UpdateOperators } from "./Update.js";
import { getPositionalFilter } from "./Utils.js";

/**
 * Execute a $inc based operators.
 *
 * Supports positional array operator $(update)
 *
 * @see https://www.mongodb.com/docs/manual/reference/operator/update/positional
 *
 * @param document - Document being updated.
 * @param criteria - Search criteria provided with the operation. Eg. updateOne({ id: "1" })
 * @param $set     - $set action being executed.
 */
export function $inc(document: Document, criteria: RawObject, $inc: UpdateOperators["$inc"] = {}): boolean {
  let modified = false;
  for (const key in $inc) {
    if (key.includes("$")) {
      if (setPositionalData(document, criteria, $inc, key)) {
        modified = true;
      }
    } else {
      document = increment(document, key, $inc[key]);
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
function setPositionalData(
  document: Document,
  criteria: RawObject,
  $inc: UpdateOperators["$inc"],
  key: string
): boolean {
  const { filter, path, target } = getPositionalFilter(criteria, key);

  const values = dot.getProperty(document, path);
  if (values === undefined) {
    throw new Error("NOT ARRAY");
  }

  let items: any[];
  if (typeof filter === "object") {
    items = getPositionalUpdateQuery(clone(values), $inc, key, filter, target);
  } else {
    items = getPositionalUpdate(clone(values), $inc, key, filter);
  }

  dot.setProperty(document, path, items);

  return deepEqual(values, items) === false;
}

function getPositionalUpdate(items: any[], $inc: any, key: string, filter: string): any[] {
  let index = 0;
  for (const item of items) {
    if (item === filter) {
      items[index] += $inc[key];
      break;
    }
    index += 1;
  }
  return items;
}

function getPositionalUpdateQuery(items: any[], $inc: any, key: string, filter: RawObject, target: string): any[] {
  let index = 0;
  for (const item of items) {
    if (new Query(filter).test(item) === true) {
      if (target === "") {
        items[index] += $inc[key];
      } else {
        increment(item, target, $inc[key]);
      }
      break;
    }
    index += 1;
  }
  return items;
}

function increment(document: Document, key: string, value: number): Document {
  let currentValue = dot.getProperty(document, key) as unknown;
  if (typeof currentValue !== "number") {
    currentValue = 0;
  }
  return dot.setProperty(document, key, (currentValue as number) + value);
}
