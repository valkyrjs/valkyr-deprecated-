import { MemoryStorage } from "../databases/memory.storage";
import { Document, Storage } from "../storage";
import { Criteria, isMatch } from "./is-match";

export type OnChangeFn = (documents: Document[]) => void;

export class Store {
  private constructor(private storage: Storage) {}

  static create(name = "observer") {
    return new Store(new MemoryStorage(name));
  }

  async resolve(documents: Document[]): Promise<Document[]> {
    await this.storage.insertMany(documents);
    return this.getDocuments();
  }

  async getDocuments(): Promise<Document[]> {
    return this.storage.find();
  }

  async insert(document: Document, criteria: Criteria): Promise<boolean> {
    if (isMatch(document, criteria)) {
      await this.storage.insertOne(document);
      return true;
    }
    return false;
  }

  async update(document: Document, criteria: Criteria): Promise<boolean> {
    if (await this.storage.has(document.id)) {
      await this.#updateOrRemove(document, criteria);
      return true;
    } else if (isMatch(document, criteria)) {
      await this.storage.insertOne(document);
      return true;
    }
    return false;
  }

  async remove(document: Document): Promise<boolean> {
    if (isMatch(document, { id: document.id })) {
      await this.storage.remove({ id: document.id });
      return true;
    }
    return false;
  }

  async #updateOrRemove(document: Document, criteria: Criteria): Promise<void> {
    if (isMatch(document, criteria)) {
      await this.storage.replace({ id: document.id }, document);
    } else {
      await this.storage.remove({ id: document.id });
    }
  }
}
