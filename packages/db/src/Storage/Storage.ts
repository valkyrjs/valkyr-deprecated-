import { EventEmitter, Logger, nanoid } from "@valkyr/utils";
import { RawObject } from "mingo/types";

import { InstanceAdapter } from "../Adapters";
import { operations } from "./Operations";
import type {
  Adapter,
  ChangeType,
  Delete,
  Document,
  Insert,
  Operation,
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
  public readonly id = nanoid(6);

  public readonly documents = new Map<string, D>();
  public readonly operations: Operation<D>[] = [];
  public readonly logger = new Logger("Storage");
  public readonly debounce: {
    save?: ReturnType<typeof setTimeout>;
  } = {
    save: undefined
  };

  public status: Status = "loading";

  constructor(public readonly name: string, public readonly adapter: Adapter<D> = new InstanceAdapter<D>()) {
    super();
  }

  /*
   |--------------------------------------------------------------------------------
   | Accessors
   |--------------------------------------------------------------------------------
   */

  public get data(): D[] {
    return Array.from(this.documents.values());
  }

  /*
   |--------------------------------------------------------------------------------
   | Lookup
   |--------------------------------------------------------------------------------
   */

  public has(id: string): boolean {
    return this.documents.has(id);
  }

  /*
   |--------------------------------------------------------------------------------
   | Status
   |--------------------------------------------------------------------------------
   */

  public is(status: Status): boolean {
    return this.status === status;
  }

  private setStatus(value: Status): this {
    this.status = value;
    this.emit(value);
    return this;
  }

  /*
   |--------------------------------------------------------------------------------
   | Event Handler
   |--------------------------------------------------------------------------------
   */

  public onChange(cb: (type: ChangeType, document: D) => void): () => void {
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

  public async load(): Promise<this> {
    if (!this.is("loading")) {
      return this;
    }
    const documents = await this.adapter.get(this.name);
    for (const document of documents) {
      this.documents.set(document.id, document);
    }
    return this.setStatus("ready").process();
  }

  public async save(): Promise<this> {
    if (this.debounce.save) {
      clearTimeout(this.debounce.save);
    }
    this.debounce.save = setTimeout(() => {
      this.adapter.set(this.name, this.data);
    }, 500);
    return this;
  }

  public flush(): void {
    this.documents.clear();
    this.adapter.flush();
  }

  /*
   |--------------------------------------------------------------------------------
   | Mutations
   |--------------------------------------------------------------------------------
   */

  public async insert(document: D): Promise<string> {
    this.logger.debug(`${this.name} [${this.id}] Insert`, document.id);
    return this.run({ type: "insert", document } as Insert<D>);
  }

  public async update(id: string, criteria: RawObject, actions: UpdateActions): Promise<boolean> {
    this.logger.debug(`${this.adapter.type} [${this.id}] Update`, id);
    return this.run({ type: "update", id, criteria, actions } as Update);
  }

  public async replace(id: string, document: Document): Promise<boolean> {
    this.logger.debug(`${this.adapter.type} [${this.id}] Replace`, id);
    return this.run({ type: "replace", id, document } as Replace<D>);
  }

  public async delete(id: string): Promise<boolean> {
    this.logger.debug(`${this.adapter.type} [${this.id}] Delete`, id);
    return this.run({ type: "delete", id } as Delete);
  }

  public async run(operation: Omit<Operation<D>, "resolve" | "reject">): Promise<any> {
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

  public async process(): Promise<this> {
    if (this.is("loading") || this.is("working")) {
      return this;
    }

    this.setStatus("working");

    const operation = this.operations.shift();
    if (!operation) {
      return this.setStatus("ready");
    }

    try {
      operation.resolve(this.resolve(operation as any));
      this.save();
    } catch (error: any) {
      operation.reject(error);
    }

    this.setStatus("ready").process();

    return this;
  }

  public resolve(operation: Insert<D>): string;
  public resolve(operation: Operation<D>): boolean;
  public resolve(operation: Operation<D>): string | boolean {
    return operations[operation.type](this, operation as any);
  }
}
