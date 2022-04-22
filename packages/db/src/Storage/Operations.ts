import { nanoid } from "@valkyr/utils";
import * as NotationDefault from "notation";

import { DuplicateDocumentError } from "./Errors";
import { Storage } from "./Storage";
import type { Operation } from "./Types";

const notate = NotationDefault.Notation.create;

/**
 * Insert document within the given operation to the provided storage instance.
 *
 * @param storage   - Storage to insert document to.
 * @param operation - Operation being executed.
 * @param attempts  - Number of insert attempts, this relates to potential id duplication conflicts.
 *
 * @returns Created document.
 */
function insert(storage: Storage, operation: Operation, attempts: number): string {
  if (operation.type !== "insert") {
    throw new Error(`Storage Violation: Invalid operation provided, expected 'insert', got '${operation.type}'`);
  }
  const { id = nanoid(), ...data } = operation.document;
  if (storage.documents.has(id)) {
    if (operation.document.id === undefined && attempts < 3) {
      return storage.resolve(operation, attempts + 1);
    }
    throw new DuplicateDocumentError(id);
  }
  const document = { id, ...data };
  storage.documents.set(id, document);
  storage.emit("change", "insert", document);
  return id;
}

function update(storage: Storage, operation: Operation): boolean {
  if (operation.type !== "update") {
    throw new Error(`Storage Violation: Invalid operation provided, expected 'update', got '${operation.type}'`);
  }

  const {
    id,
    actions: { $set = {}, $unset = {}, $push = {} }
  } = operation;

  const currentDocument = storage.documents.get(id);

  if (currentDocument === undefined) {
    return false;
  }

  const notation = notate(currentDocument);

  for (const key in $set) {
    notation.set(key, $set[key]);
  }

  for (const key in $unset) {
    notation.remove(key);
  }

  for (const key in $push) {
    const value = notation.get(key);
    if (Array.isArray(value)) {
      notation.set(key, [...value, $push[key]]);
    }
  }

  const nextDocument = notation.value;

  storage.documents.set(id, nextDocument);
  storage.emit("change", "update", nextDocument);

  return true;
}

function replace(storage: Storage, operation: Operation): boolean {
  if (operation.type !== "replace") {
    throw new Error(`Storage Violation: Invalid operation provided, expected 'replace', got '${operation.type}'`);
  }
  storage.documents.set(operation.document.id, operation.document);
  storage.emit("change", "update", operation.document);
  return true;
}

function del(storage: Storage, operation: Operation): boolean {
  if (operation.type !== "delete" || storage.documents.has(operation.id) === false) {
    return false;
  }
  storage.documents.delete(operation.id);
  storage.emit("change", "delete", { id: operation.id });
  return true;
}

export const operations = {
  insert,
  update,
  replace,
  delete: del
};
