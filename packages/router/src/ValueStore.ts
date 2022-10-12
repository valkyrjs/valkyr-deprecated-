/*
 |--------------------------------------------------------------------------------
 | ValueStore
 |--------------------------------------------------------------------------------
 */

export class ValueStore {
  constructor(readonly store: Store = {}) {}

  has(key: string): boolean {
    return this.store[key] !== undefined;
  }

  get(): Store;
  get(key: string): string;
  get(key?: string): Store | string {
    if (key !== undefined) {
      return this.store[key];
    }
    return { ...this.store };
  }
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type Store = Record<string, any>;
