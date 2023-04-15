import * as dot from "dot-prop";
import type { RawObject } from "mingo/types";

import { Document } from "../../Storage.js";
import type { UpdateOperators } from "./Update.js";
import { setPositionalData } from "./Utils.js";

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
export function $set(document: Document, criteria: RawObject, $set: UpdateOperators["$set"] = {}): boolean {
  let modified = false;
  for (const key in $set) {
    if (key.includes("$")) {
      if (
        setPositionalData(document, criteria, key, {
          object: (data, key) => getSetValue(data, key, $set),
          value: (_, key) => $set[key]
        })
      ) {
        modified = true;
      }
    } else {
      document = dot.setProperty(document, key, getSetValue(document, key, $set));
      modified = true;
    }
  }
  return modified;
}

function getSetValue(data: any, key: string, $set: UpdateOperators["$set"] = {}) {
  const value = $set[key];
  if (typeof value === "function") {
    return value(dot.getProperty(data, key), data);
  }
  return value;
}
