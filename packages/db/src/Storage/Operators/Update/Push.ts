import * as dot from "dot-prop";
import { deepEqual } from "fast-equals";
import { Query } from "mingo";
import type { RawObject } from "mingo/types";

import { Document, UpdateFilter, WithId } from "../../../Types.js";

export function $push<TSchema extends Document = Document>(
  document: WithId<TSchema>,
  operator: UpdateFilter<TSchema>["$push"] = {}
): boolean {
  let modified = false;
  for (const key in operator) {
    const values = getPushValues(document, key);
    const result = getPushResult(operator, key, values);
    dot.setProperty(document, key, result);
    if (deepEqual(values, result) === false) {
      modified = true;
    }
  }
  return modified;
}

function getPushValues(document: any, key: string): any[] {
  const values = dot.getProperty(document, key);
  if (values === undefined) {
    return [];
  }
  return values;
}

function getPushResult(operator: RawObject, key: string, values: any[]): any[] {
  if (typeof operator[key] === "object") {
    return getPushFromModifiers(operator[key], values);
  }
  return [...values, operator[key]];
}

function getPushFromModifiers(obj: any, values: any[]): any[] {
  if (obj.$each === undefined) {
    return [...values, obj];
  }
  let items: any[];

  if (obj.$position !== undefined) {
    items = [...values.slice(0, obj.$position), ...obj.$each, ...values.slice(obj.$position)];
  } else {
    items = [...values, ...obj.$each];
  }

  if (obj.$sort !== undefined) {
    if (typeof obj.$sort === "object") {
      items = new Query({}).find(items).sort(obj.$sort).all();
    } else {
      items = items.sort((a, b) => {
        if (obj.$sort === 1) {
          return a < b ? -1 : 1;
        }
        return a < b ? 1 : -1;
      });
    }
  }

  if (obj.$slice !== undefined) {
    if (obj.$slice < 0) {
      return items.slice(obj.$slice);
    }
    return items.slice(0, obj.$slice);
  }

  return items;
}
