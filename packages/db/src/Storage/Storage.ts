import { EventEmitter } from "@valkyr/event-emitter";
import { Logger } from "@valkyr/logger";
import { getId } from "@valkyr/security";
import { RawObject } from "mingo/types";

import { BroadcastChannel } from "../BroadcastChannel";
import { Insert, Operator, operators, Remove, Replace, Update } from "./Operators";
import { InsertException, InsertResult } from "./Operators/Insert";
import { RemoveOneException, RemoveOneResult } from "./Operators/Remove";
import { UpdateOneException, UpdateOneResult } from "./Operators/Update";

export abstract class Storage<D extends Document = Document> extends EventEmitter<{
  loading: () => void;
  ready: () => void;
  working: () => void;
  change: (type: ChangeType, document: D) => void;
}> {
  readonly id = getId(6);

  status: Status = "loading";

  readonly #operators: Operator<D>[] = [];
  readonly #logger = new Logger("Storage");
  readonly #channel = new BroadcastChannel(`valkyr:db:${this.name}`);

  constructor(readonly name: string) {
    super();
    this.#startBrowserListener();
    this.#load();
  }

  #load() {
    this.init().then(() => {
      this.#setStatus("ready").process();
    });
  }

  #startBrowserListener() {
    this.#channel.onmessage = ({ data: { type, document } }: MessageEvent<StorageBroadcast>) =>
      this.emit("change", type, document);
  }

  /*
   |--------------------------------------------------------------------------------
   | Bootstrap
   |--------------------------------------------------------------------------------
   */

  async waitForReady(): Promise<void> {
    if (this.is("loading") === false) {
      return;
    }
    return new Promise((resolve) => this.once("ready", resolve));
  }

  /**
   * Initialize the local storage instance and ensure that it is ready to process
   * document operations.
   */
  async init(): Promise<void> {}

  /*
   |--------------------------------------------------------------------------------
   | Abstracted
   |--------------------------------------------------------------------------------
   */

  abstract hasDocument(id: string): Promise<boolean>;

  abstract getDocument(id: string): Promise<D | undefined>;

  abstract getDocuments(): Promise<D[]>;

  abstract setDocument(document: D): Promise<void>;

  abstract delDocument(id: string): Promise<void>;

  abstract count(): Promise<number>;

  abstract flush(): Promise<void>;

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
   | Committer
   |--------------------------------------------------------------------------------
   |
   | To support multiple tabs and windows we need to broadcast in memory updates
   | across all instances to keep changes in sync.
   |
   */

  commit(type: ChangeType, document: D): void {
    switch (type) {
      case "insert":
      case "update": {
        this.setDocument(document);
        this.emit("change", type, document);
        break;
      }
      case "remove": {
        this.delDocument(document.id);
        this.emit("change", "remove", { id: document.id } as D);
        break;
      }
    }
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
   | Mutations
   |--------------------------------------------------------------------------------
   */

  async insert(document: PartialDocument<D>): Promise<InsertResult | InsertException> {
    this.#logger.debug(`${this.name} [${this.id}] Insert`, document.id);
    return this.run({ type: "insert", document } as Insert<D>);
  }

  async update(
    id: string,
    criteria: RawObject,
    operators: Update["operators"]
  ): Promise<UpdateOneResult | UpdateOneException> {
    this.#logger.debug(`${this.name} [${this.id}] Update`, id);
    return this.run({ type: "update", id, criteria, operators } as Update);
  }

  async replace(id: string, document: Document): Promise<UpdateOneResult | UpdateOneException> {
    this.#logger.debug(`${this.name} [${this.id}] Replace`, id);
    return this.run({ type: "replace", id, document } as Replace<D>);
  }

  async remove(id: string): Promise<RemoveOneResult | RemoveOneException> {
    this.#logger.debug(`${this.name} [${this.id}] Remove`, id);
    return this.run({ type: "remove", id } as Remove);
  }

  async run(operation: Omit<Operator<D>, "resolve" | "reject">): Promise<any> {
    return new Promise((resolve, reject) => {
      this.#operators.push({ ...operation, resolve, reject } as Operator<D>);
      this.process();
    });
  }

  /*
   |--------------------------------------------------------------------------------
   | Processor
   |--------------------------------------------------------------------------------
   */

  process(): this {
    if (this.is("loading") || this.is("working")) {
      return this;
    }

    this.#setStatus("working");

    const operation = this.#operators.shift();
    if (operation === undefined) {
      return this.#setStatus("ready");
    }

    this.resolve(operation as any)
      .then(operation.resolve)
      .catch(operation.reject);

    return this.#setStatus("ready").process();
  }

  resolve(operator: Insert<D>): Promise<InsertResult | InsertException>;
  resolve(
    operator: Operator<D>
  ): Promise<
    InsertResult | InsertException | UpdateOneResult | UpdateOneException | RemoveOneResult | RemoveOneException
  >;
  resolve(
    operator: Operator<D>
  ): Promise<
    InsertResult | InsertException | UpdateOneResult | UpdateOneException | RemoveOneResult | RemoveOneException
  > {
    return operators[operator.type](this, operator as any);
  }
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

type Status = "loading" | "ready" | "working";

type ChangeType = "insert" | "update" | "remove";

type StorageBroadcast = {
  type: "insert" | "update" | "remove";
  document: Document<any>;
};
