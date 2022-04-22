import { RawObject } from "mingo/types";

export class DuplicateDocumentError extends Error {
  public readonly type = "DuplicateDocumentError";

  constructor(id: string) {
    super(`Collection Insert Violation: Document '${id}' already exists`);
  }
}

export class DocumentNotFoundError extends Error {
  public readonly type = "DocumentNotFoundError";

  constructor(public readonly criteria: RawObject) {
    super(`Collection Update Violation: Document matching criteria does not exists`);
  }
}
