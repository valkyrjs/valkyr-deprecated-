import { crypto } from "../Crypto";
import { ObserverStorage } from "../Databases/Observer.Storage";
import { Document, Storage } from "../Storage";
import { Criteria, isMatch } from "./IsMatch";

export class Store {
  private constructor(private storage: Storage) {}

  static create() {
    return new Store(new ObserverStorage(`observer[${crypto.randomUUID()}]`));
  }

  get destroy() {
    return this.storage.destroy.bind(this.storage);
  }

  async resolve(documents: Document[]): Promise<Document[]> {
    await this.storage.insertMany(documents);
    return this.getDocuments();
  }

  async getDocuments(): Promise<Document[]> {
    return this.storage.find();
  }

  async insertMany(documents: Document[], criteria: Criteria): Promise<Document[]> {
    const matched = [];
    for (const document of documents) {
      matched.push(...(await this.insertOne(document, criteria)));
    }
    return matched;
  }

  async insertOne(document: Document, criteria: Criteria): Promise<Document[]> {
    if (isMatch(document, criteria)) {
      await this.storage.insertOne(document);
      return [document];
    }
    return [];
  }

  async updateMany(documents: Document[], criteria: Criteria): Promise<Document[]> {
    const matched = [];
    for (const document of documents) {
      matched.push(...(await this.updateOne(document, criteria)));
    }
    return matched;
  }

  async updateOne(document: Document, criteria: Criteria): Promise<Document[]> {
    if (await this.storage.has(document.id)) {
      await this.#updateOrRemove(document, criteria);
      return [document];
    } else if (isMatch(document, criteria)) {
      await this.storage.insertOne(document);
      return [document];
    }
    return [];
  }

  async remove(documents: Document[]): Promise<Document[]> {
    const matched = [];
    for (const document of documents) {
      if (isMatch(document, { id: document.id })) {
        await this.storage.remove({ id: document.id });
        matched.push(document);
      }
    }
    return matched;
  }

  async #updateOrRemove(document: Document, criteria: Criteria): Promise<void> {
    if (isMatch(document, criteria)) {
      await this.storage.replace({ id: document.id }, document);
    } else {
      await this.storage.remove({ id: document.id });
    }
  }

  flush() {
    this.storage.flush();
  }
}

export type OnChangeFn = (documents: Document[]) => void;
