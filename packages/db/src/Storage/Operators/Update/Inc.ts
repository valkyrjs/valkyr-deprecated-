import * as dot from "dot-prop";
import type { RawObject } from "mingo/types.js";

import { Document } from "../../Storage.js";
import type { UpdateOperators } from "./Update.js";
import { setPositionalData } from "./Utils.js";

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
      if (
        setPositionalData(document, criteria, key, {
          object: (data, key, target) => {
            if (typeof data === "number") {
              return data + ($inc[key] as number);
            }
            const value = dot.getProperty(data, target);
            if (typeof value !== "number") {
              return 0;
            }
            return value + $inc[key];
          },
          value: (data, key) => data + $inc[key]
        })
      ) {
        modified = true;
      }
    } else {
      document = increment(document, key, $inc[key]);
      modified = true;
    }
  }
  return modified;
}

function increment(document: Document, key: string, value: number): Document {
  let currentValue = dot.getProperty(document, key) as unknown;
  if (typeof currentValue !== "number") {
    currentValue = 0;
  }
  return dot.setProperty(document, key, (currentValue as number) + value);
}
