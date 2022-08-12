import { DocumentNotFoundError } from "../Errors";
import { Storage } from "../Storage";
import { Delete } from "../Types";

export function remove(storage: Storage, operation: Delete): RemoveOneResult | RemoveOneException {
  if (storage.documents.has(operation.id) === false) {
    return new RemoveOneException(new DocumentNotFoundError({ id: operation.id }));
  }
  storage.documents.delete(operation.id);
  storage.emit("change", "delete", { id: operation.id });
  return new RemoveOneResult();
}

/*
 |--------------------------------------------------------------------------------
 | Acknowledgements
 |--------------------------------------------------------------------------------
 */

export class RemoveResult {
  readonly deletedCount = 0;
  readonly exceptions: Error[] = [];

  constructor(results: (RemoveOneResult | RemoveOneException)[] = []) {
    for (const result of results) {
      if (result instanceof RemoveOneResult) {
        this.deletedCount += 1;
      }
      if (result instanceof RemoveOneException) {
        this.exceptions.push(result.exception);
      }
    }
  }

  get acknowledged(): boolean {
    return this.deletedCount === 0 && this.exceptions.length > 0 ? false : true;
  }
}

export class RemoveOneResult {
  readonly acknowledged = true;
}

export class RemoveOneException {
  readonly acknowledged = false;

  constructor(readonly exception: Error) {}
}
