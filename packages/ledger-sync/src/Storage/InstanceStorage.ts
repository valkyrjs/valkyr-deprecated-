import { EventStorage } from "./Storage";

export class InstanceStorage<Data = any> implements EventStorage<Data> {
  readonly #map = new Map<string, Data>();

  constructor(readonly name: string) {}

  /*
   |--------------------------------------------------------------------------------
   | Storage Utilities
   |--------------------------------------------------------------------------------
   */

  async has(key: string): Promise<boolean> {
    return this.#map.has(key);
  }

  async set(key: string, data: Data): Promise<void> {
    this.#map.set(key, data);
  }

  async get(key: string): Promise<Data | undefined> {
    return this.#map.get(key);
  }

  async del(key: string): Promise<void> {
    this.#map.delete(key);
  }

  async flush(): Promise<void> {
    this.#map.clear();
  }
}
