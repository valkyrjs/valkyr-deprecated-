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
    this.broadcast("insertOne", document);
    return new InsertResult([document.id]);
  }

  async insertMany(documents: PartialDocument<D>[]): Promise<InsertResult> {
    const result: D[] = [];
    for (const data of documents) {
      const document = { ...data, id: data.id ?? getId() } as D;
      result.push(document);
      this.#documents.set(document.id, document);
    }

    this.broadcast("insertMany", result);

    return new InsertResult(result);
  }

  async findById(id: string): Promise<D | undefined> {
    return this.#documents.get(id);
  }

  async find(criteria?: RawObject, options?: Options): Promise<D[]> {
    let cursor = new Query(criteria ?? {}).find(Array.from(this.#documents.values()));
    if (options !== undefined) {
      cursor = addOptions(cursor, options);
    }
    return cursor.all() as D[];
  }

  async updateOne(criteria: RawObject, operators: UpdateOperators): Promise<UpdateResult> {
    const query = new Query(criteria);
    for (const current of Array.from(this.#documents.values())) {
      if (query.test(current) === true) {
        const { modified, document } = update<D>(criteria, operators, current);
        if (modified === true) {
          this.#documents.set(document.id, document);
          this.broadcast("updateOne", document);
          return new UpdateResult(1, 1);
        }
        return new UpdateResult(1, 0);
      }
    }
    return new UpdateResult(0, 0);
  }

  async updateMany(criteria: RawObject, operators: UpdateOperators): Promise<UpdateResult> {
    const query = new Query(criteria);

    const documents: D[] = [];

    let matchedCount = 0;
    let modifiedCount = 0;

    for (const current of Array.from(this.#documents.values())) {
      if (query.test(current) === true) {
        matchedCount += 1;
        const { modified, document } = update<D>(criteria, operators, current);
        if (modified === true) {
          modifiedCount += 1;
          documents.push(document);
          this.#documents.set(document.id, document);
        }
      }
    }

    this.broadcast("updateMany", documents);

    return new UpdateResult(matchedCount, modifiedCount);
  }

  async replace(criteria: RawObject, document: D): Promise<UpdateResult> {
    const query = new Query(criteria);

    const documents: D[] = [];

    let matchedCount = 0;
    let modifiedCount = 0;

    for (const current of Array.from(this.#documents.values())) {
      if (query.test(current) === true) {
        matchedCount += 1;
        modifiedCount += 1;
        documents.push(document);
        this.#documents.set(document.id, document);
      }
    }

    this.broadcast("updateMany", documents);

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
