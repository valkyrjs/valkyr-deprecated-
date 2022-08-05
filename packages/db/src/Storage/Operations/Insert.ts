import { getId } from "@valkyr/security";

import { DuplicateDocumentError } from "../Errors";
import { Storage } from "../Storage";
import { Insert } from "../Types";
import { clone } from "./Clone";

/**
 * Insert document within the given operation to the provided storage instance.
 *
 * @param storage   - Storage to insert document to.
 * @param operation - Operation being executed.
 * @param attempts  - Number of insert attempts, this relates to potential id duplication conflicts.
 *
 * @returns Created document.
 */
export function insert(storage: Storage, operation: Insert): string {
  const document = clone(operation.document);
  if (document.id === undefined) {
    document.id = getId();
  }
  if (storage.documents.has(document.id)) {
    throw new DuplicateDocumentError(document, storage);
  }
  storage.documents.set(document.id, document);
  storage.emit("change", "insert", document);
  return document.id;
}
