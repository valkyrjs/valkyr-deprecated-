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

export class Storage<Data = any> {
  #storage?: EventStorage<Data>;

  /*
   |--------------------------------------------------------------------------------
   | Accessors
   |--------------------------------------------------------------------------------
   */

  set storage(storage: EventStorage<Data>) {
    this.#storage = storage;
  }

  get storage(): EventStorage<Data> {
    if (this.#storage === undefined) {
      throw new Error("EventStorage Violation: Storage has not been instantiated");
    }
    return this.#storage;
  }

  /*
   |--------------------------------------------------------------------------------
   | Storage Method Passthrough
   |--------------------------------------------------------------------------------
   */

  get has() {
    return this.storage.has.bind(this.storage);
  }

  get set() {
    return this.storage.set.bind(this.storage);
  }

  get get() {
    return this.storage.get.bind(this.storage);
  }

  get del() {
    return this.storage.del.bind(this.storage);
  }

  get flush() {
    return this.storage.flush.bind(this.storage);
  }
}
