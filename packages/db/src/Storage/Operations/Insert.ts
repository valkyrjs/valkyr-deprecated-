import { getId } from "@valkyr/security";

import { DuplicateDocumentError } from "../Errors";
import { Storage } from "../Storage";
import { Insert } from "../Types";
import { clone } from "./Utils/Clone";

/**
 * Insert document within the given operation to the provided storage instance.
 *
 * @param storage   - Storage to insert document to.
 * @param operation - Operation being executed.
 * @param attempts  - Number of insert attempts, this relates to potential id duplication conflicts.
 *
 * @returns Created document.
 */
export function insert(storage: Storage, operation: Insert): InsertResult | InsertException {
  const document = clone(operation.document);
  if (document.id === undefined) {
    document.id = getId();
  }
  if (storage.documents.has(document.id)) {
    return new InsertException(new DuplicateDocumentError(document, storage));
  }
  storage.documents.set(document.id, document);
  storage.emit("change", "insert", document);
  return new InsertResult(document.id);
}

/*
 |--------------------------------------------------------------------------------
 | Acknowledgements
 |--------------------------------------------------------------------------------
 */

export class InsertManyResult {
  readonly insertedIds: string[] = [];
  readonly exceptions: Error[] = [];

  constructor(results: (InsertResult | InsertException)[]) {
    for (const result of results) {
      if (result instanceof InsertResult) {
        this.insertedIds.push(result.insertedId);
      }
      if (result instanceof InsertException) {
        this.exceptions.push(result.exception);
      }
    }
  }

  get acknowledged(): boolean {
    return this.insertedIds.length > 0;
  }
}

export class InsertResult {
  readonly acknowledged = true;

  constructor(readonly insertedId: string) {}
}

export class InsertException {
  readonly acknowledged = false;

  constructor(readonly exception: Error) {}
}
