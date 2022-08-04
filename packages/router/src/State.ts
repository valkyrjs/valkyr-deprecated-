import type { Store } from "./ValueStore";

export class State {
  private store: Store;

  constructor(store: any = {}) {
    this.store = store;
  }

  public set(key: string, value: any): void {
    this.store[key] = value;
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
