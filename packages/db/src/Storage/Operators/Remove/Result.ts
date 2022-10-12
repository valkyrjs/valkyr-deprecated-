import { RemoveOneException } from "./Exceptions";

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
