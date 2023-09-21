import * as dot from "dot-prop";

import { Document, Filter, UpdateFilter, WithId } from "../../../Types.js";
import { setPositionalData } from "./Utils.js";

/**
 * Execute a $set based operators.
 *
 * Supports positional array operator $(update)
 *
 * @see https://www.mongodb.com/docs/manual/reference/operator/update/positional
 *
 * @param document - Document being updated.
 * @param filter   - Search filter provided with the operation. Eg. updateOne({ id: "1" })
 * @param $set     - $set action being executed.
 */
export function $set<TSchema extends Document = Document>(
  document: WithId<WithId<TSchema>>,
  filter: Filter<WithId<TSchema>>,
  $set: UpdateFilter<TSchema>["$set"] = {} as any
): boolean {
  let modified = false;
  for (const key in $set) {
    if (key.includes("$")) {
      if (
        setPositionalData(document, filter, key, {
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

function getSetValue(data: any, key: string, $set: UpdateFilter<Document>["$set"] = {}) {
  const value = $set[key];
  if (typeof value === "function") {
    return value(dot.getProperty(data, key), data);
  }
  return value;
}
