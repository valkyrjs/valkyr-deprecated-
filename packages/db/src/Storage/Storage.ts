import { EventEmitter } from "@valkyr/event-emitter";
import { Logger } from "@valkyr/logger";
import { getId } from "@valkyr/security";
import { RawObject } from "mingo/types";

import { InstanceAdapter } from "../Adapters";
import { operations } from "./Operations";
import { InsertException, InsertResult } from "./Operations/Insert";
import { RemoveOneException, RemoveOneResult } from "./Operations/Remove";
import { UpdateOneException, UpdateOneResult } from "./Operations/Update";
import type {
  Adapter,
  ChangeType,
  Delete,
  Document,
  Insert,
  Operation,
  PartialDocument,
  Replace,
  Status,
  Update,
  UpdateActions
} from "./Types";

export class Storage<D extends Document = any> extends EventEmitter<{
  loading: () => void;
  ready: () => void;
  working: () => void;
  change: (type: ChangeType, document: D) => void;
}> {
  readonly id = getId(6);

  readonly documents = new Map<string, D>();
  readonly operations: Operation<D>[] = [];
  readonly logger = new Logger("Storage");
  readonly debounce: {
    save?: ReturnType<typeof setTimeout>;
  } = {
    save: undefined
  };

  status: Status = "loading";

  constructor(readonly name: string, readonly adapter: Adapter<D> = new InstanceAdapter<D>()) {
    super();
  }

  /*
   |--------------------------------------------------------------------------------
   | Accessors
   |--------------------------------------------------------------------------------
   */

  get data(): D[] {
    return Array.from(this.documents.values());
  }

  /*
   |--------------------------------------------------------------------------------
   | Lookup
   |--------------------------------------------------------------------------------
   */

  has(id: string): boolean {
    return this.documents.has(id);
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
   | Event Handler
   |--------------------------------------------------------------------------------
   */

  onChange(cb: (type: ChangeType, document: D) => void): () => void {
    this.addListener("change", cb);
    return () => {
      this.removeListener("change", cb);
    };
  }

  /*
   |--------------------------------------------------------------------------------
   | Persisters
   |--------------------------------------------------------------------------------
   */

  async load(): Promise<this> {
    if (!this.is("loading")) {
      return this;
    }
    const documents = await this.adapter.get(this.name);
    for (const document of documents) {
      this.documents.set(document.id, document);
    }
    return this.#setStatus("ready").process();
  }

  async save(): Promise<this> {
    if (this.debounce.save) {
      clearTimeout(this.debounce.save);
    }
    this.debounce.save = setTimeout(() => {
      this.adapter.set(this.name, this.data);
    }, 500);
    return this;
  }

  flush(): void {
    this.documents.clear();
    this.adapter.flush();
  }

  /*
   |--------------------------------------------------------------------------------
   | Mutations
   |--------------------------------------------------------------------------------
   */

  async insert(document: PartialDocument<D>): Promise<InsertResult | InsertException> {
    this.logger.debug(`${this.name} [${this.id}] Insert`, document.id);
    return this.run({ type: "insert", document } as Insert<D>);
  }

  async update(id: string, criteria: RawObject, actions: UpdateActions): Promise<UpdateOneResult | UpdateOneException> {
    this.logger.debug(`${this.adapter.type} [${this.id}] Update`, id);
    return this.run({ type: "update", id, criteria, actions } as Update);
  }

  async replace(id: string, document: Document): Promise<UpdateOneResult | UpdateOneException> {
    this.logger.debug(`${this.adapter.type} [${this.id}] Replace`, id);
    return this.run({ type: "replace", id, document } as Replace<D>);
  }

  async delete(id: string): Promise<RemoveOneResult | RemoveOneException> {
    this.logger.debug(`${this.adapter.type} [${this.id}] Delete`, id);
    return this.run({ type: "delete", id } as Delete);
  }

  async run(operation: Omit<Operation<D>, "resolve" | "reject">): Promise<any> {
    return new Promise((resolve, reject) => {
      this.load().then(() => {
        this.operations.push({ ...operation, resolve, reject } as Operation<D>);
        this.process();
      });
    });
  }

  /*
   |--------------------------------------------------------------------------------
   | Processor
   |--------------------------------------------------------------------------------
   */

  async process(): Promise<this> {
    if (this.is("loading") || this.is("working")) {
      return this;
    }

    this.#setStatus("working");

    const operation = this.operations.shift();
    if (!operation) {
      return this.#setStatus("ready");
    }

    try {
      operation.resolve(this.resolve(operation as any));
      this.save();
    } catch (error: any) {
      console.log("FAILED", error);
      operation.reject(error);
    }

    this.#setStatus("ready").process();

    return this;
  }

  resolve(operation: Insert<D>): InsertResult | InsertException;
  resolve(
    operation: Operation<D>
  ): InsertResult | InsertException | UpdateOneResult | UpdateOneException | RemoveOneResult | RemoveOneException;
  resolve(
    operation: Operation<D>
  ): InsertResult | InsertException | UpdateOneResult | UpdateOneException | RemoveOneResult | RemoveOneException {
    return operations[operation.type](this, operation as any);
  }
}
