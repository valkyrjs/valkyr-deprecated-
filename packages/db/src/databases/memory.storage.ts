import { getId } from "@valkyr/security";
import { Query } from "mingo";
import { RawObject } from "mingo/types";

import {
  addOptions,
  Document,
  DuplicateDocumentError,
  InsertResult,
  Options,
  PartialDocument,
  RemoveResult,
  Storage,
  update,
  UpdateOperators,
  UpdateResult
} from "../storage";

export class MemoryStorage<D extends Document = Document> extends Storage<D> {
  readonly #documents = new Map<string, D>();

  async has(id: string): Promise<boolean> {
    return this.#documents.has(id);
  }

  async insertOne(data: PartialDocument<D>): Promise<InsertResult> {
    const document = { ...data, id: data.id ?? getId() } as D;
    if (await this.has(document.id)) {
      throw new DuplicateDocumentError(document, this);
    }
    this.#documents.set(document.id, document);
    this.broadcast("insert", document);
    return new InsertResult([document.id]);
  }

  async insertMany(documents: PartialDocument<D>[]): Promise<InsertResult> {
    const ids: string[] = [];
    for (const data of documents) {
      const document = { ...data, id: data.id ?? getId() } as D;
      this.#documents.set(document.id, document);
      this.broadcast("insert", document);
      ids.push(document.id);
    }
    return new InsertResult(ids);
  }

  async findByIndex(index: string, value: any): Promise<D[]> {
    if (index === "id") {
      const document = this.#documents.get(value);
      if (document !== undefined) {
        return [document];
      }
    }
    return [];
  }

  async find(criteria?: RawObject, options?: Options): Promise<D[]> {
    let cursor = new Query(criteria ?? {}).find(Array.from(this.#documents.values()));
    if (options !== undefined) {
      cursor = addOptions(cursor, options);
    }
    return cursor.all() as D[];
  }

  async update(criteria: RawObject, operators: UpdateOperators, options?: { justOne: boolean }): Promise<UpdateResult> {
    const query = new Query(criteria);

    let matchedCount = 0;
    let modifiedCount = 0;

    const documents = Array.from(this.#documents.values());
    for (const data of documents) {
      if (query.test(data) === true) {
        matchedCount += 1;
        const { modified, document } = update<D>(criteria, operators, data);
        if (modified === true) {
          modifiedCount += 1;
          this.#documents.set(document.id, document);
          this.broadcast("update", document);
        }
        if (options?.justOne === true) {
          break;
        }
      }
    }

    return new UpdateResult(matchedCount, modifiedCount);
  }

  async replace(criteria: RawObject, document: D): Promise<UpdateResult> {
    const query = new Query(criteria);

    let matchedCount = 0;
    let modifiedCount = 0;

    const documents = Array.from(this.#documents.values());
    for (const data of documents) {
      if (query.test(data) === true) {
        matchedCount += 1;
        modifiedCount += 1;
        this.#documents.set(document.id, document);
        this.broadcast("update", document);
      }
    }

    return new UpdateResult(matchedCount, modifiedCount);
  }

  async remove(criteria: RawObject): Promise<RemoveResult> {
    const documents = Array.from(this.#documents.values());
    const query = new Query(criteria);
    let count = 0;
    for (const document of documents) {
      if (query.test(document) === true) {
        this.#documents.delete(document.id);
        this.broadcast("remove", document);
        count += 1;
      }
    }
    return new RemoveResult(count);
  }

  async count(criteria?: RawObject): Promise<number> {
    return new Query(criteria ?? {}).find(Array.from(this.#documents.values())).count();
  }

  async flush(): Promise<void> {
    this.#documents.clear();
  }
}
