import { Query } from "mingo";
import { nanoid } from "nanoid";

import {
  addOptions,
  DuplicateDocumentError,
  getInsertManyResult,
  getInsertOneResult,
  InsertManyResult,
  InsertOneResult,
  Options,
  RemoveResult,
  Storage,
  update,
  UpdateResult
} from "../Storage/mod.js";
import { Document, Filter, UpdateFilter, WithId } from "../Types.js";

export class ObserverStorage<TSchema extends Document = Document> extends Storage<TSchema> {
  readonly #documents = new Map<string, WithId<TSchema>>();

  async resolve() {
    return this;
  }

  async has(id: string): Promise<boolean> {
    return this.#documents.has(id);
  }

  async insertOne(data: Partial<TSchema>): Promise<InsertOneResult> {
    const document = { ...data, id: data.id ?? nanoid() } as WithId<TSchema>;
    if (await this.has(document.id)) {
      throw new DuplicateDocumentError(document, this as any);
    }
    this.#documents.set(document.id, document);
    return getInsertOneResult(document);
  }

  async insertMany(documents: Partial<TSchema>[]): Promise<InsertManyResult> {
    const result: TSchema[] = [];
    for (const data of documents) {
      const document = { ...data, id: data.id ?? nanoid() } as WithId<TSchema>;
      result.push(document);
      this.#documents.set(document.id, document);
    }
    return getInsertManyResult(result);
  }

  async findById(id: string): Promise<WithId<TSchema> | undefined> {
    return this.#documents.get(id);
  }

  async find(filter?: Filter<WithId<TSchema>>, options?: Options): Promise<WithId<TSchema>[]> {
    let cursor = new Query(filter ?? {}).find(Array.from(this.#documents.values()));
    if (options !== undefined) {
      cursor = addOptions(cursor, options);
    }
    return cursor.all() as WithId<TSchema>[];
  }

  async updateOne(filter: Filter<WithId<TSchema>>, operators: UpdateFilter<TSchema>): Promise<UpdateResult> {
    const query = new Query(filter);
    for (const current of Array.from(this.#documents.values())) {
      if (query.test(current) === true) {
        const { modified, document } = update<TSchema>(filter, operators, current);
        if (modified === true) {
          this.#documents.set(document.id, document);
          return new UpdateResult(1, 1);
        }
        return new UpdateResult(1, 0);
      }
    }
    return new UpdateResult(0, 0);
  }

  async updateMany(filter: Filter<WithId<TSchema>>, operators: UpdateFilter<TSchema>): Promise<UpdateResult> {
    const query = new Query(filter);

    const documents: WithId<TSchema>[] = [];

    let matchedCount = 0;
    let modifiedCount = 0;

    for (const current of Array.from(this.#documents.values())) {
      if (query.test(current) === true) {
        matchedCount += 1;
        const { modified, document } = update<TSchema>(filter, operators, current);
        if (modified === true) {
          modifiedCount += 1;
          documents.push(document);
          this.#documents.set(document.id, document);
        }
      }
    }

    return new UpdateResult(matchedCount, modifiedCount);
  }

  async replace(filter: Filter<WithId<TSchema>>, document: WithId<TSchema>): Promise<UpdateResult> {
    const query = new Query(filter);

    const documents: WithId<TSchema>[] = [];

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

    return new UpdateResult(matchedCount, modifiedCount);
  }

  async remove(filter: Filter<WithId<TSchema>>): Promise<RemoveResult> {
    const documents = Array.from(this.#documents.values());
    const query = new Query(filter);
    let count = 0;
    for (const document of documents) {
      if (query.test(document) === true) {
        this.#documents.delete(document.id);
        count += 1;
      }
    }
    return new RemoveResult(count);
  }

  async count(filter?: Filter<WithId<TSchema>>): Promise<number> {
    return new Query(filter ?? {}).find(Array.from(this.#documents.values())).count();
  }

  async flush(): Promise<void> {
    this.#documents.clear();
  }
}
