import { del, get, set } from "idb-keyval";

export type EventStorageClass<Data = any> = {
  new (name: string): EventStorage<Data>;
};

export type EventStorage<Data = any> = {
  readonly name: string;
  has(key: string): Promise<boolean>;
  set(key: string, data: Data): Promise<void>;
  get(key: string): Promise<Data | undefined>;
  del(key: string): Promise<void>;
  flush(): Promise<void>;
};

export class Storage<Data = any> implements EventStorage<Data> {
  #map?: Map<string, Data>;

  #timeout: any;

  constructor(readonly name: string) {}

  /*
   |--------------------------------------------------------------------------------
   | Accessors
   |--------------------------------------------------------------------------------
   */

  get map() {
    if (this.#map === undefined) {
      throw new Error("IndexedDbStorage Violation: Map has not been resolved");
    }
    return this.#map;
  }

  /*
   |--------------------------------------------------------------------------------
   | Storage Utilities
   |--------------------------------------------------------------------------------
   */

  async has(key: string): Promise<boolean> {
    await this.#resolve();
    return this.map.has(key);
  }

  async set(key: string, data: Data) {
    await this.#resolve();
    this.map.set(key, data);
    this.#persist();
  }

  async get(key: string) {
    await this.#resolve();
    return this.map.get(key);
  }

  async del(key: string) {
    await this.#resolve();
    this.map.delete(key);
    this.#persist();
  }

  async flush() {
    await del(this.name);
  }

  /*
   |--------------------------------------------------------------------------------
   | Persistence Utilities
   |--------------------------------------------------------------------------------
   */

  async #persist() {
    clearTimeout(this.#timeout);
    this.#timeout = setTimeout(() => {
      set(this.name, JSON.stringify(Array.from(this.map.entries())));
    });
  }

  async #resolve() {
    if (this.#map === undefined) {
      const cached = await get(this.name);
      if (cached) {
        this.#map = new Map(JSON.parse(cached));
      } else {
        this.#map = new Map();
      }
    }
  }
}
