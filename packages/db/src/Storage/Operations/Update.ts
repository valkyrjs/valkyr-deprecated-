import { Query } from "mingo";
import { RawObject } from "mingo/types";

import { DocumentNotFoundError, PullUpdateArrayError } from "../Errors";
import { Storage } from "../Storage";
import type { Document, UpdateOperations } from "../Types";
import { Update } from "../Types";
import { clone } from "./Utils/Clone";
import * as dot from "./Utils/Dot";

/*
 |--------------------------------------------------------------------------------
 | Update
 |--------------------------------------------------------------------------------
 */

export function update(storage: Storage, operation: Update): UpdateOneResult | UpdateOneException {
  try {
    const { id, criteria, actions } = operation;

    const currentDocument = storage.documents.get(id);
    if (currentDocument === undefined) {
      return new UpdateOneException(false, new DocumentNotFoundError(criteria));
    }

    const { modified, document } = runActions(criteria, actions, clone(currentDocument));

    storage.documents.set(id, document);
    storage.emit("change", "update", document);

    return new UpdateOneResult(true, modified);
  } catch (error) {
    return new UpdateOneException(true, error);
  }
}

/*
 |--------------------------------------------------------------------------------
 | Actions
 |--------------------------------------------------------------------------------
 */

function runActions(criteria: RawObject, { $set, $unset, $push, $pull }: UpdateOperations, document: Document) {
  const updatedDocument = clone(document);

  const setModified = runSet(updatedDocument, criteria, $set);
  const runModified = runUnset(updatedDocument, $unset);
  const pushModified = runPush(updatedDocument, $push);
  const pullModified = runPull(updatedDocument, $pull);

  return {
    modified: setModified || runModified || pushModified || pullModified,
    document: updatedDocument
  };
}

/*
 |--------------------------------------------------------------------------------
 | Action $set
 |--------------------------------------------------------------------------------
 */

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
function runSet(document: Document, criteria: RawObject, $set: UpdateOperations["$set"] = {}): boolean {
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
 */
function setPositionalData(document: Document, criteria: RawObject, $set: RawObject, key: string): boolean {
  const { filter, path, target } = getPositionalFilter(criteria, key);

  const values = dot.getProperty(document, path);
  if (values === undefined) {
    throw new Error("NOT ARRAY");
  }

  let modified = false;

  let items: any[];
  if (typeof filter === "object") {
    items = getPositionalUpdateQuery(clone(values), $set, key, filter, target);
  } else {
    items = getPositionalUpdate(clone(values), $set, key, filter);
  }

  dot.setProperty(document, path, items);

  if (JSON.stringify(values) !== JSON.stringify(items)) {
    modified = true;
  }

  return modified;
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

/*
 |--------------------------------------------------------------------------------
 | Action $unset
 |--------------------------------------------------------------------------------
 */

function runUnset(document: Document, $unset: UpdateOperations["$unset"] = {}): boolean {
  let modified = false;
  for (const key in $unset) {
    if (dot.deleteProperty(document, key)) {
      modified = true;
    }
  }
  return modified;
}

/*
 |--------------------------------------------------------------------------------
 | Action $push
 |--------------------------------------------------------------------------------
 */

function runPush(document: Document, $push: UpdateOperations["$push"] = {}): boolean {
  let modified = false;
  for (const key in $push) {
    const values = getPushValues(document, key);
    const result = getPushResult($push, key, values);
    dot.setProperty(document, key, result);
    if (JSON.stringify(values) !== JSON.stringify(result)) {
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

function getPushResult($push: RawObject, key: string, values: any[]): any[] {
  if (typeof $push[key] === "object") {
    return getPushFromModifiers($push[key], values);
  }
  return [...values, $push[key]];
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

/*
 |--------------------------------------------------------------------------------
 | Action $pull
 |--------------------------------------------------------------------------------
 */

function runPull(document: any, $pull: UpdateOperations["$pull"] = {}): boolean {
  let modified = false;
  for (const key in $pull) {
    const values = getPullValues(document, key);
    const result = getPullResult($pull, key, values);
    dot.setProperty(document, key, result);
    if (result.length !== values.length) {
      modified = true;
    }
  }
  return modified;
}

function getPullValues(document: any, key: string): any[] {
  const values: any[] | undefined = dot.getProperty(document, key);
  if (values === undefined || Array.isArray(values) === false) {
    throw new PullUpdateArrayError(document.id, key);
  }
  return values;
}

function getPullResult($pull: RawObject, key: string, values: any[]): any[] {
  if (typeof $pull[key] === "object") {
    return new Query(getPullCriteria($pull, key)).remove(values);
  }
  return values.filter((value) => value !== $pull[key]);
}

/**
 * Criteria used during pull depends on the structure of the query under the pulled
 * key. If the object has a mongodb filter key with a $ prefix we need to provide
 * the query with the array key as the query wrapper. If a $ prefix is not present
 * we want the value under the key being the criteria.
 *
 * @param $pull - Object under $pull action.
 * @param key   - Specific key being resolved to a criteria.
 */
function getPullCriteria($pull: any, key: string): RawObject {
  let hasFilters = false;
  for (const left in $pull[key]) {
    if (left.includes("$")) {
      hasFilters = true;
      break;
    }
  }
  if (hasFilters === true) {
    return { [key]: dot.getProperty($pull, key) };
  }
  return dot.getProperty($pull, key) as RawObject;
}

/*
 |--------------------------------------------------------------------------------
 | Acknowledgements
 |--------------------------------------------------------------------------------
 */

export class UpdateResult {
  readonly matchedCount = 0;
  readonly modifiedCount = 0;
  readonly exceptions: Error[] = [];

  constructor(results: (UpdateOneResult | UpdateOneException)[] = []) {
    for (const result of results) {
      if (result.matched) {
        this.matchedCount += 1;
      }
      if (result instanceof UpdateOneResult) {
        if (result.modified === true) {
          this.modifiedCount += 1;
        }
      }
      if (result instanceof UpdateOneException) {
        this.exceptions.push(result.exception);
      }
    }
  }

  get acknowledged(): boolean {
    return this.modifiedCount === 0 && this.exceptions.length > 0 ? false : true;
  }
}

export class UpdateOneResult {
  constructor(readonly matched: boolean, readonly modified: boolean) {}
}

export class UpdateOneException {
  constructor(readonly matched: boolean, readonly exception: Error) {}
}
