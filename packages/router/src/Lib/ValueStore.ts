import type { Store } from "../Types/Store";

export class ValueStore {
  private readonly store: Store;

  constructor(state?: any) {
    this.store = Object.freeze(state || {});
  }

  public has(key: string): boolean {
    return this.store[key] !== undefined;
  }

  public get(): Store;
  public get(key: string): string;
  public get(key?: string): Store | string {
    if (key !== undefined) {
      return this.store[key];
    }
    return this.store || "";
  }
}
