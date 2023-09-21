import { Cursor } from "mingo/cursor";
import { nanoid } from "nanoid";
import { Subject } from "rxjs";

import { BroadcastChannel, StorageBroadcast } from "../Broadcast.js";
import { Document, Filter, UpdateFilter, WithId } from "../Types.js";
import { InsertManyResult, InsertOneResult } from "./Operators/Insert/mod.js";
import { RemoveResult } from "./Operators/Remove/mod.js";
import { UpdateResult } from "./Operators/Update/mod.js";

export abstract class Storage<TSchema extends Document = Document> {
  readonly observable = {
    change: new Subject<ChangeEvent<TSchema>>(),
    flush: new Subject<void>()
  };

  status: Status = "loading";

  readonly #channel: BroadcastChannel;

  constructor(readonly name: string, readonly id = nanoid()) {
    this.#channel = new BroadcastChannel(`valkyr:db:${name}`);
    this.#channel.onmessage = ({ data }: MessageEvent<StorageBroadcast<TSchema>>) => {
      if (data.name !== this.name) {
        return;
      }
      switch (data.type) {
        case "flush": {
          this.observable.flush.next();
          break;
        }
        default: {
          this.observable.change.next(data);
          break;
        }
      }
    };
  }

  /*
   |--------------------------------------------------------------------------------
   | Resolver
   |--------------------------------------------------------------------------------
   */

  abstract resolve(): Promise<this>;

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

  broadcast(type: StorageBroadcast<TSchema>["type"], data?: TSchema | TSchema[]): void {
    switch (type) {
      case "flush": {
        this.observable.flush.next();
        break;
      }
      default: {
        this.observable.change.next({ type, data: data as any });
        break;
      }
    }
    this.#channel.postMessage({ name: this.name, type, data });
  }

  /*
   |--------------------------------------------------------------------------------
   | Operations
   |--------------------------------------------------------------------------------
   */

  abstract has(id: string): Promise<boolean>;

  abstract insertOne(document: Partial<WithId<TSchema>>): Promise<InsertOneResult>;

  abstract insertMany(documents: Partial<WithId<TSchema>>[]): Promise<InsertManyResult>;

  abstract findById(id: string): Promise<WithId<TSchema> | undefined>;

  abstract find(filter?: Filter<WithId<TSchema>>, options?: Options): Promise<WithId<TSchema>[]>;

  abstract updateOne(filter: Filter<WithId<TSchema>>, operators: UpdateFilter<TSchema>): Promise<UpdateResult>;

  abstract updateMany(filter: Filter<WithId<TSchema>>, operators: UpdateFilter<TSchema>): Promise<UpdateResult>;

  abstract replace(filter: Filter<WithId<TSchema>>, document: TSchema): Promise<UpdateResult>;

  abstract remove(filter: Filter<WithId<TSchema>>): Promise<RemoveResult>;

  abstract count(filter?: Filter<WithId<TSchema>>): Promise<number>;

  abstract flush(): Promise<void>;

  /*
   |--------------------------------------------------------------------------------
   | Destructor
   |--------------------------------------------------------------------------------
   */

  destroy() {
    this.#channel.close();
  }
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

type Status = "loading" | "ready";

export type ChangeEvent<TSchema extends Document = Document> =
  | {
      type: "insertOne" | "updateOne";
      data: WithId<TSchema>;
    }
  | {
      type: "insertMany" | "updateMany" | "remove";
      data: WithId<TSchema>[];
    };

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
