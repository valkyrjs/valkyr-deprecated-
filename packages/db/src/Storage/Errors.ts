import { RawObject } from "mingo/types";

import type { Storage } from "./Storage";
import type { Document } from "./Types";

export class DuplicateDocumentError extends Error {
  readonly type = "DuplicateDocumentError";

  constructor(readonly document: Document, storage: Storage) {
    super(
      `Collection Insert Violation: Document '${document.id}' already exists in ${storage.name} ${storage.adapter.type} ${storage.id}`
    );
  }
}

export class DocumentNotFoundError extends Error {
  readonly type = "DocumentNotFoundError";

  constructor(readonly criteria: RawObject) {
    super(`Collection Update Violation: Document matching criteria does not exists`);
  }
}
