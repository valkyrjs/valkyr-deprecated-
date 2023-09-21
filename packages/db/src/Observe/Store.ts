import { nanoid } from "nanoid";

import { ObserverStorage } from "../Databases/Observer.Storage.js";
import { Storage } from "../Storage/mod.js";
import { Document, Filter, WithId } from "../Types.js";
import { isMatch } from "./IsMatch.js";

export class Store<TSchema extends Document = Document> {
  private constructor(private storage: Storage<TSchema>) {}

  static create<TSchema extends Document = Document>() {
    return new Store<TSchema>(new ObserverStorage<TSchema>(`observer[${nanoid()}]`));
  }

  get destroy() {
    return this.storage.destroy.bind(this.storage);
  }

  async resolve(documents: WithId<TSchema>[]): Promise<WithId<TSchema>[]> {
    await this.storage.insertMany(documents);
    return this.getDocuments();
  }

  async getDocuments(): Promise<WithId<TSchema>[]> {
    return this.storage.find();
  }

  async insertMany(documents: WithId<TSchema>[], filter: Filter<WithId<TSchema>>): Promise<WithId<TSchema>[]> {
    const matched = [];
    for (const document of documents) {
      matched.push(...(await this.insertOne(document, filter)));
    }
    return matched;
  }

  async insertOne(document: WithId<TSchema>, filter: Filter<WithId<TSchema>>): Promise<WithId<TSchema>[]> {
    if (isMatch<TSchema>(document, filter)) {
      await this.storage.insertOne(document);
      return [document];
    }
    return [];
  }

  async updateMany(documents: WithId<TSchema>[], filter: Filter<WithId<TSchema>>): Promise<WithId<TSchema>[]> {
    const matched = [];
    for (const document of documents) {
      matched.push(...(await this.updateOne(document, filter)));
    }
    return matched;
  }

  async updateOne(document: WithId<TSchema>, filter: Filter<WithId<TSchema>>): Promise<WithId<TSchema>[]> {
    if (await this.storage.has(document.id)) {
      await this.#updateOrRemove(document, filter);
      return [document];
    } else if (isMatch<TSchema>(document, filter)) {
      await this.storage.insertOne(document);
      return [document];
    }
    return [];
  }

  async remove(documents: WithId<TSchema>[]): Promise<WithId<TSchema>[]> {
    const matched = [];
    for (const document of documents) {
      if (isMatch<TSchema>(document, { id: document.id } as WithId<TSchema>)) {
        await this.storage.remove({ id: document.id } as WithId<TSchema>);
        matched.push(document);
      }
    }
    return matched;
  }

  async #updateOrRemove(document: WithId<TSchema>, filter: Filter<WithId<TSchema>>): Promise<void> {
    if (isMatch<TSchema>(document, filter)) {
      await this.storage.replace({ id: document.id } as WithId<TSchema>, document);
    } else {
      await this.storage.remove({ id: document.id } as WithId<TSchema>);
    }
  }

  flush() {
    this.storage.flush();
  }
}
