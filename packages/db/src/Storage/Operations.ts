import { nanoid } from "@valkyr/utils";

import { DocumentNotFoundError, DuplicateDocumentError } from "./Errors";
import { Storage } from "./Storage";
import type { Document, Operation } from "./Types";

/**
 * Insert document within the given operation to the provided storage instance.
 *
 * @param storage   - Storage to insert document to.
 * @param operation - Operation being executed.
 * @param attempts  - Number of insert attempts, this relates to potential id duplication conflicts.
 *
 * @returns Created document.
 */
function insert(storage: Storage, operation: Operation, attempts: number): Document {
  if (operation.type !== "insert") {
    throw new Error("Storage Violation: Invalid operation provided, expected 'insert', got '${operation.type}'.");
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
  return document;
}

function update(storage: Storage, operation: Operation): Document {
  if (operation.type !== "update") {
    throw new Error("Storage Violation: Invalid operation provided, expected 'update', got '${operation.type}'.");
  }
  const data = operation.document;
  if (!storage.documents.has(data.id)) {
    throw new DocumentNotFoundError(data.id);
  }
  const document = { ...storage.documents.get(data.id), ...data };
  storage.documents.set(data.id, document);
  storage.emit("change", "update", document);
  return document;
}

function upsert(storage: Storage, operation: Operation): Document {
  if (operation.type !== "upsert") {
    throw new Error("Storage Violation: Invalid operation provided, expected 'upsert', got '${operation.type}'.");
  }
  const data = operation.document;
  let document: Document;
  if (storage.documents.has(data.id)) {
    document = { ...storage.documents.get(data.id), ...data };
    storage.documents.set(data.id, document);
    storage.emit("change", "update", document);
  } else {
    document = data;
    storage.documents.set(document.id, document);
    storage.emit("change", "insert", document);
  }
  return document;
}

function del(storage: Storage, operation: Operation): undefined {
  if (operation.type !== "delete") {
    throw new Error("Storage Violation: Invalid operation provided, expected 'delete', got '${operation.type}'.");
  }
  storage.documents.delete(operation.id);
  storage.emit("change", "delete", { id: operation.id });
  return undefined;
}

export const operations = {
  insert,
  update,
  upsert,
  delete: del
};
