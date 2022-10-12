import { InsertException } from "./Exceptions";

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
