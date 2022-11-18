import { EventEmitter } from "@valkyr/event-emitter";
import { getId } from "@valkyr/security";
import { Cursor } from "mingo/cursor";
import { RawObject } from "mingo/types";

import { BroadcastChannel } from "../broadcast";
import { InsertResult } from "./operators/insert";
import { RemoveResult } from "./operators/remove";
import { UpdateOperators, UpdateResult } from "./operators/update";

export abstract class Storage<D extends Document = Document> extends EventEmitter<{
  loading: () => void;
  ready: () => void;
  change: (type: ChangeType, data: D | D[]) => void;
}> {
  readonly id = getId(6);

  status: Status = "loading";

  readonly #channel = new BroadcastChannel(`valkyr:db:${this.name}`);

  constructor(readonly name: string) {
    super();
    this.#startBrowserListener();
  }

  #startBrowserListener() {
    this.#channel.onmessage = ({ data: { type, data } }: MessageEvent<StorageBroadcast>) =>
      this.emit("change", type, data);
  }

  /*
   |--------------------------------------------------------------------------------
   | Status
   |--------------------------------------------------------------------------------
   */

  is(status: Status): boolean {
    return this.status === status;
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

  broadcast(type: ChangeType, data: D | D[]): void {
    this.emit("change", type, data);
    this.#channel.postMessage({ type, data });
  }

  /*
   |--------------------------------------------------------------------------------
   | Event Handler
   |--------------------------------------------------------------------------------
   */

  onChange(callback: (type: ChangeType, data: D | D[]) => void): () => void {
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

  abstract findById(id: string): Promise<D | undefined>;

  abstract find(criteria?: RawObject, options?: Options): Promise<D[]>;

  abstract updateOne(criteria: RawObject, operators: UpdateOperators): Promise<UpdateResult>;

  abstract updateMany(criteria: RawObject, operators: UpdateOperators): Promise<UpdateResult>;

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

type StorageBroadcast =
  | {
      type: "insertOne" | "updateOne";
      data: Document<any>;
    }
  | {
      type: "insertMany" | "updateMany" | "remove";
      data: Document<any>[];
    };

type ChangeType = "insertOne" | "insertMany" | "updateOne" | "updateMany" | "remove";

export type Options = {
  sort?: {
    [key: string]: 1 | -1;
  };
  skip?: number;
  range?: {
    from: string;
    to: string;
  };
  offset?: {
    value: string;
    direction: 1 | -1;
  };
  limit?: number;
  index?: Index;
};

export type Index = {
  [index: string]: any;
};
