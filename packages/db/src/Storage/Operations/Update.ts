import { clone, dot } from "@valkyr/utils";
import { Query } from "mingo";
import { RawObject } from "mingo/types";

import { Storage } from "../Storage";
import type { Document, UpdateActions } from "../Types";
import { Update } from "../Types";

/*
 |--------------------------------------------------------------------------------
 | Update
 |--------------------------------------------------------------------------------
 */

export function update(storage: Storage, operation: Update): boolean {
  try {
    const { id, criteria, actions } = operation;

    const currentDocument = storage.documents.get(id);
    if (currentDocument === undefined) {
      return false;
    }

    const nextDocument = runActions(criteria, actions, clone(currentDocument));

    storage.documents.set(id, nextDocument);
    storage.emit("change", "update", nextDocument);

    return true;
  } catch (err) {
    console.log("ERROR", err);
    return false;
  }
}

/*
 |--------------------------------------------------------------------------------
 | Actions
 |--------------------------------------------------------------------------------
 */

function runActions(criteria: RawObject, { $set, $unset, $push }: UpdateActions, document: Document) {
  const updatedDocument = clone(document);

  runSet(updatedDocument, criteria, $set);
  runUnset(updatedDocument, $unset);
  runPush(updatedDocument, $push);
  // runPull(notation, $pull);

  return updatedDocument;
}

/*
 |--------------------------------------------------------------------------------
 | Action $set
 |--------------------------------------------------------------------------------
 */

function runSet(document: Document, criteria: RawObject, $set: UpdateActions["$set"] = {}) {
  for (const key in $set) {
    if (key.includes("$")) {
      runSetArray(document, criteria, $set, key);
    } else {
      document = dot.setProperty(document, key, $set[key]);
    }
  }
}

function runSetArray(document: Document, criteria: RawObject, $set: RawObject, key: string) {
  const [path, filter, target] = getArrayCriteria(criteria, key);

  const current = dot.getProperty(document, path) as any[];
  const updates = new Query(filter).find(current).all();

  document = dot.setProperty(
    document,
    path,
    current.map((entry: any) => {
      if (updates.find((update) => update === entry)) {
        return dot.setProperty(entry, target, $set[key]);
      }
      return entry;
    })
  );
}

/*
 |--------------------------------------------------------------------------------
 | Action $unset
 |--------------------------------------------------------------------------------
 */

function runUnset(document: Document, $unset: UpdateActions["$unset"] = {}) {
  for (const key in $unset) {
    dot.deleteProperty(document, key);
  }
}

/*
 |--------------------------------------------------------------------------------
 | Action $push
 |--------------------------------------------------------------------------------
 */

function runPush(notation: any, $push: UpdateActions["$push"] = {}) {
  for (const key in $push) {
    const value = notation.get(key);
    if (Array.isArray(value)) {
      notation.set(key, [...value, $push[key]]);
    }
  }
}

/*
 |--------------------------------------------------------------------------------
 | Action $pull
 |--------------------------------------------------------------------------------
 */

// function runPull(notation: any, $pull: UpdateActions["$pull"] = {}) {
//   //coming soon
// }

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

function getArrayCriteria(criteria: RawObject, key: string): [string, RawObject, string] {
  const [left, right] = key.split("$");
  const result: RawObject = {};
  for (const key in criteria) {
    if (key.includes(left)) {
      result[key.replace(left, "")] = criteria[key];
    }
  }
  return [trimSeparators(left), result, trimSeparators(right)];
}

function trimSeparators(value: string): string {
  return value.replace(/^\.+|\.+$/gm, "");
}
