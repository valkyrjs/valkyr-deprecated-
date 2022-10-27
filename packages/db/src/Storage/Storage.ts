import { EventEmitter } from "@valkyr/event-emitter";
import { getId } from "@valkyr/security";
import { Cursor } from "mingo/cursor";
import { RawObject } from "mingo/types";

import { BroadcastChannel } from "../BroadcastChannel";
import { InsertResult } from "./Operators/Insert";
import { RemoveResult } from "./Operators/Remove";
import { UpdateOperators, UpdateResult } from "./Operators/Update";

export abstract class Storage<D extends Document = Document> extends EventEmitter<{
  loading: () => void;
  ready: () => void;
  change: (type: ChangeType, document: D) => void;
}> {
  readonly id = getId(6);

  status: Status = "loading";

  readonly #channel = new BroadcastChannel(`valkyr:db:${this.name}`);

  constructor(readonly name: string) {
    super();
    this.#startBrowserListener();
    this.#load();
  }

  #load() {
    this.init().then(() => this.#setStatus("ready"));
  }

  #startBrowserListener() {
    this.#channel.onmessage = ({ data: { type, document } }: MessageEvent<StorageBroadcast>) =>
      this.emit("change", type, document);
  }

  /*
   |--------------------------------------------------------------------------------
   | Status
   |--------------------------------------------------------------------------------
   */

  is(status: Status): boolean {
    return this.status === status;
  }

  #setStatus(value: Status): this {
    this.status = value;
    this.emit(value);
    return this;
  }

  /*
   |--------------------------------------------------------------------------------
   | Bootstrap
   |--------------------------------------------------------------------------------
   */

  /**
   * Initialize the local storage instance and ensure that it is ready to process
   * document operations.
   */
  async init(): Promise<void> {}

  async waitForReady(): Promise<void> {
    if (this.is("loading") === false) {
      return;
    }
    return new Promise((resolve) => this.once("ready", resolve));
  }

  /*
   |--------------------------------------------------------------------------------
   | Broadcaster
   |--------------------------------------------------------------------------------
   |
   | Broadcast local changes with any change listeners in the current and other
   | browser tabs and window.
   |
   */

  broadcast(type: ChangeType, document: D): void {
    this.emit("change", type, document);
    this.#channel.postMessage({ type, document });
  }

  /*
   |--------------------------------------------------------------------------------
   | Event Handler
   |--------------------------------------------------------------------------------
   */

  onChange(callback: (type: ChangeType, document: D) => void): () => void {
    return this.subscribe("change", callback);
  }

  /*
   |--------------------------------------------------------------------------------
   | Operations
   |--------------------------------------------------------------------------------
   */

  abstract has(id: string): Promise<boolean>;

  abstract insertOne(document: PartialDocument<D>): Promise<InsertResult>;

  abstract insertMany(documents: PartialDocument<D>[]): Promise<InsertResult>;

  abstract findByIndex(index: string, value: any): Promise<D[]>;

  abstract find(criteria?: RawObject, options?: Options): Promise<D[]>;

  abstract update(
    criteria: RawObject,
    operators: UpdateOperators,
    options?: { justOne: boolean }
  ): Promise<UpdateResult>;

  abstract replace(criteria: RawObject, document: Document): Promise<UpdateResult>;

  abstract remove(criteria: RawObject): Promise<RemoveResult>;

  abstract count(criteria?: RawObject): Promise<number>;

  abstract flush(): Promise<void>;
}

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

export function addOptions(cursor: Cursor, options: Options): Cursor {
  if (options.sort) {
    cursor.sort(options.sort);
  }
  if (options.skip !== undefined) {
    cursor.skip(options.skip);
  }
  if (options.limit !== undefined) {
    cursor.limit(options.limit);
  }
  return cursor;
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type Document<Properties extends RawObject = RawObject> = {
  id: string;
} & Properties;

export type PartialDocument<D extends Document> = Omit<D, "id"> & {
  id?: string;
};

type Status = "loading" | "ready";

type ChangeType = "insert" | "update" | "remove";

type StorageBroadcast = {
  type: "insert" | "update" | "remove";
  document: Document<any>;
};

export type Options = {
  sort?: {
    [key: string]: 1 | -1;
  };
  skip?: number;
  limit?: number;
};
