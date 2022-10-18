import { getId } from "@valkyr/security";

import { clone } from "../../../Clone";
import { DuplicateDocumentError } from "../../Errors";
import { Storage } from "../../Storage";
import { Insert } from "../Operators";
import { InsertException } from "./Exceptions";
import { InsertResult } from "./Result";

/**
 * Insert document within the given operation to the provided storage instance.
 *
 * @param storage   - Storage to insert document to.
 * @param operation - Operation being executed.
 * @param attempts  - Number of insert attempts, this relates to potential id duplication conflicts.
 *
 * @returns Created document.
 */
export function insert(storage: Storage, operator: Insert): InsertResult | InsertException {
  const document = clone(operator.document);
  if (document.id === undefined) {
    document.id = getId();
  }
  if (storage.documents.has(document.id)) {
    return new InsertException(new DuplicateDocumentError(document, storage));
  }
  storage.commit("insert", document);
  return new InsertResult(document.id);
}
