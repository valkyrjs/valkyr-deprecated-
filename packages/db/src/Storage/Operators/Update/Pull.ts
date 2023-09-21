import * as dot from "dot-prop";
import { Query } from "mingo";
import { RawObject } from "mingo/types";

import { Document, UpdateFilter, WithId } from "../../../Types.js";
import { PullUpdateArrayError } from "../../Errors.js";

export function $pull<TSchema extends Document>(
  document: WithId<TSchema>,
  operator: UpdateFilter<TSchema>["$pull"] = {}
): boolean {
  let modified = false;
  for (const key in operator) {
    const values = getPullValues(document, key);
    const result = getPullResult(operator, key, values);
    dot.setProperty(document, key, result);
    if (result.length !== values.length) {
      modified = true;
    }
  }
  return modified;
}

function getPullValues(document: Document, key: string): any[] {
  const values: any[] | undefined = dot.getProperty(document, key);
  if (values === undefined || Array.isArray(values) === false) {
    throw new PullUpdateArrayError(document.id, key);
  }
  return values;
}

function getPullResult(operator: RawObject, key: string, values: any[]): any[] {
  if (typeof operator[key] === "object") {
    return new Query(getPullCriteria(operator, key)).remove(values);
  }
  return values.filter((value) => value !== operator[key]);
}

/**
 * Criteria used during pull depends on the structure of the query under the pulled
 * key. If the object has a mongodb filter key with a $ prefix we need to provide
 * the query with the array key as the query wrapper. If a $ prefix is not present
 * we want the value under the key being the criteria.
 *
 * @param operator - Object under operator action.
 * @param key   - Specific key being resolved to a criteria.
 */
function getPullCriteria(operator: any, key: string): RawObject {
  let hasFilters = false;
  for (const left in operator[key]) {
    if (left.includes("$")) {
      hasFilters = true;
      break;
    }
  }
  if (hasFilters === true) {
    return { [key]: dot.getProperty(operator, key) };
  }
  return dot.getProperty(operator, key) as RawObject;
}
