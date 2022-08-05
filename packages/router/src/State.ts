import type { Store } from "./ValueStore";

export class State {
  private store: Store;

  constructor(store: any = {}) {
    this.store = store;
  }

  set(key: string, value: any): void {
    this.store[key] = value;
  }

  get(): Store;
  get(key: string): string;
  get(key?: string): Store | string {
    if (key !== undefined) {
      return this.store[key];
    }
    return this.store || "";
  }
}
