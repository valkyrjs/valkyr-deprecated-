import { Collection } from "../collection";
import { Document } from "../storage";
import { MemoryStorage } from "./memory.storage";
import { Registrars } from "./registrars";

export class MemoryDatabase<T extends Record<string, Document>> {
  readonly #collections = new Map<keyof T, Collection<T[keyof T]>>();

  register(registrars: Registrars[]): void {
    for (const { name } of registrars) {
      this.#collections.set(name, new Collection(name, new MemoryStorage(name)));
    }
  }

  /*
   |--------------------------------------------------------------------------------
   | Fetchers
   |--------------------------------------------------------------------------------
   */

  collection<Name extends keyof T>(name: Name): Collection<T[Name]> {
    const collection = this.#collections.get(name);
    if (collection === undefined) {
      throw new Error(`Collection '${name as string}' not found`);
    }
    return collection as Collection<T[Name]>;
  }

  /*
   |--------------------------------------------------------------------------------
   | Utilities
   |--------------------------------------------------------------------------------
   */

  async flush() {
    for (const collection of this.#collections.values()) {
      collection.flush();
    }
  }
}
