import { EventEmitter } from "@valkyr/event-emitter";
import { Logger } from "@valkyr/logger";
import { getId } from "@valkyr/security";
import { RawObject } from "mingo/types";

import { Adapter, InstanceAdapter } from "../Adapters";
import { Insert, Operator, operators, Remove, Replace, Update } from "./Operators";
import { InsertException, InsertResult } from "./Operators/Insert";
import { RemoveOneException, RemoveOneResult } from "./Operators/Remove";
import { UpdateOneException, UpdateOneResult } from "./Operators/Update";

export class Storage<D extends Document = Document> extends EventEmitter<{
  loading: () => void;
  ready: () => void;
  working: () => void;
  change: (type: ChangeType, document: D) => void;
}> {
  readonly id = getId(6);

  readonly documents = new Map<string, D>();
  readonly operators: Operator<D>[] = [];
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
    return this.subscribe("change", cb);
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

  async update(
    id: string,
    criteria: RawObject,
    operators: Update["operators"]
  ): Promise<UpdateOneResult | UpdateOneException> {
    this.logger.debug(`${this.adapter.type} [${this.id}] Update`, id);
    return this.run({ type: "update", id, criteria, operators } as Update);
  }

  async replace(id: string, document: Document): Promise<UpdateOneResult | UpdateOneException> {
    this.logger.debug(`${this.adapter.type} [${this.id}] Replace`, id);
    return this.run({ type: "replace", id, document } as Replace<D>);
  }

  async remove(id: string): Promise<RemoveOneResult | RemoveOneException> {
    this.logger.debug(`${this.adapter.type} [${this.id}] Remove`, id);
    return this.run({ type: "remove", id } as Remove);
  }

  async run(operation: Omit<Operator<D>, "resolve" | "reject">): Promise<any> {
    return new Promise((resolve, reject) => {
      this.load().then(() => {
        this.operators.push({ ...operation, resolve, reject } as Operator<D>);
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

    const operation = this.operators.shift();
    if (!operation) {
      return this.#setStatus("ready");
    }

    try {
      operation.resolve(this.resolve(operation as any));
      this.save();
    } catch (error: any) {
      operation.reject(error);
    }

    this.#setStatus("ready").process();

    return this;
  }

  resolve(operator: Insert<D>): InsertResult | InsertException;
  resolve(
    operator: Operator<D>
  ): InsertResult | InsertException | UpdateOneResult | UpdateOneException | RemoveOneResult | RemoveOneException;
  resolve(
    operator: Operator<D>
  ): InsertResult | InsertException | UpdateOneResult | UpdateOneException | RemoveOneResult | RemoveOneException {
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
