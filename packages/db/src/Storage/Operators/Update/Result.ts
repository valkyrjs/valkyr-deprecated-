import { UpdateOneException } from "./Exceptions";

export class UpdateResult {
  readonly matchedCount = 0;
  readonly modifiedCount = 0;
  readonly exceptions: Error[] = [];

  constructor(results: (UpdateOneResult | UpdateOneException)[] = []) {
    for (const result of results) {
      if (result.matched) {
        this.matchedCount += 1;
      }
      if (result instanceof UpdateOneResult) {
        if (result.modified === true) {
          this.modifiedCount += 1;
        }
      }
      if (result instanceof UpdateOneException) {
        this.exceptions.push(result.exception);
      }
    }
  }

  get acknowledged(): boolean {
    return this.modifiedCount === 0 && this.exceptions.length > 0 ? false : true;
  }
}

export class UpdateOneResult {
  constructor(readonly matched: boolean, readonly modified: boolean) {}
}
