export class DuplicateDocumentError extends Error {
  public readonly type = "DuplicateDocumentError";

  constructor(id: string) {
    super(`Collection Insert Violation: Document '${id}' already exists`);
  }
}

export class DocumentNotFoundError extends Error {
  public readonly type = "DocumentNotFoundError";

  constructor(id: string) {
    super(`Collection Update Violation: Document '${id}' does not exists`);
  }
}
