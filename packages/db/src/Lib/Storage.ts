import { EventEmitter } from "eventemitter3";
import { nanoid } from "nanoid";

import { InstanceAdapter } from "../Adapters/InstanceAdapter";
import { DocumentNotFoundError, DuplicateDocumentError } from "../Errors/Storage";
import type { Adapter, ChangeType, Delete, Document, Operation, Status } from "../Types/Storage";

export class Storage extends EventEmitter<{
  loading: () => void;
  ready: () => void;
  working: () => void;
  change: (type: ChangeType, document: Document) => void;
}> {
  public static DuplicateDocumentError = DuplicateDocumentError;
  public static DocumentNotFoundError = DocumentNotFoundError;

  public readonly name: string;
  public readonly adapter: Adapter;
  public readonly documents: Map<string, Document>;
  public readonly operations: Operation[];
  public readonly debounce: {
    save?: NodeJS.Timeout;
  } = {
    save: undefined
  };

  public status: Status;

  constructor(name: string, adapter: Adapter = new InstanceAdapter()) {
    super();
    this.name = name;
    this.adapter = adapter;
    this.documents = new Map();
    this.operations = [];
    this.status = "loading";
  }

  /*
   |--------------------------------------------------------------------------------
   | Accessors
   |--------------------------------------------------------------------------------
   */

  public get data(): Document[] {
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

  public onChange(cb: (type: ChangeType, document: Document) => void): () => void {
    this.addListener("change", cb);
    return () => {
      this.removeListener("change", cb);
    };
  }

  /*
   |--------------------------------------------------------------------------------
   | Persistors
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

  /*
   |--------------------------------------------------------------------------------
   | Mutators
   |--------------------------------------------------------------------------------
   */

  public async insert(document: Document): Promise<Document> {
    return new Promise((resolve, reject) => {
      this.load().then(() => {
        this.operations.push({ type: "insert", document, resolve, reject });
        this.process();
      });
    });
  }

  public async update(document: Document): Promise<Document> {
    return new Promise((resolve, reject) => {
      this.load().then(() => {
        this.operations.push({ type: "update", document, resolve, reject });
        this.process();
      });
    });
  }

  public async upsert(document: Document): Promise<Document> {
    return new Promise((resolve, reject) => {
      this.load().then(() => {
        this.operations.push({ type: "upsert", document, resolve, reject });
        this.process();
      });
    });
  }

  public async delete(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.load().then(() => {
        this.operations.push({ type: "delete", id, resolve, reject });
        this.process();
      });
    });
  }

  /*
   |--------------------------------------------------------------------------------
   | Processor
   |--------------------------------------------------------------------------------
   */

  private async process(): Promise<this> {
    if (this.is("loading") || this.is("working")) {
      return this;
    }

    this.setStatus("working");

    const operation = this.operations.shift();
    if (!operation) {
      return this.setStatus("ready");
    }

    try {
      operation.resolve(this.resolve(operation));
      this.save();
    } catch (error: any) {
      operation.reject(error);
    }

    this.setStatus("ready").process();

    return this;
  }

  private resolve(operation: Delete, attempts?: number): undefined;
  private resolve(operation: Operation, attempts?: number): Document;
  private resolve(operation: Operation, attempts = 0): Document | undefined {
    switch (operation.type) {
      case "insert": {
        const { id = nanoid(), ...data } = operation.document;
        if (this.documents.has(id)) {
          if (operation.document.id === undefined && attempts < 3) {
            return this.resolve(operation, attempts + 1);
          }
          throw new Storage.DuplicateDocumentError(id);
        }
        const document = { id, ...data };
        this.documents.set(id, document);
        this.emit("change", "insert", document);
        return document;
      }
      case "update": {
        const data = operation.document;
        if (!this.documents.has(data.id)) {
          throw new Storage.DocumentNotFoundError(data.id);
        }
        const document = { ...this.documents.get(data.id), ...data };
        this.documents.set(data.id, document);
        this.emit("change", "update", document);
        return document;
      }
      case "upsert": {
        const data = operation.document;
        let document: Document;
        if (this.documents.has(data.id)) {
          document = { ...this.documents.get(data.id), ...data };
          this.documents.set(data.id, document);
          this.emit("change", "update", document);
        } else {
          document = data;
          this.documents.set(document.id, document);
          this.emit("change", "insert", document);
        }
        return document;
      }
      case "delete": {
        this.documents.delete(operation.id);
        this.emit("change", "delete", { id: operation.id });
        break;
      }
    }
  }
}
