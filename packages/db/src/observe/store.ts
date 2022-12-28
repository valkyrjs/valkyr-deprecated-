import { getId } from "@valkyr/security";

import { ObserverStorage } from "../databases/observer.storage";
import { Document, Storage } from "../storage";
import { Criteria, isMatch } from "./is-match";

export class Store {
  private constructor(private storage: Storage) {}

  static create() {
    return new Store(new ObserverStorage(`observer[${getId()}]`));
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

  async insertMany(documents: Document[], criteria: Criteria): Promise<boolean> {
    let matched = false;
    for (const document of documents) {
      const changed = await this.insertOne(document, criteria);
      if (changed === true) {
        matched = true;
      }
    }
    return matched;
  }

  async insertOne(document: Document, criteria: Criteria): Promise<boolean> {
    if (isMatch(document, criteria)) {
      await this.storage.insertOne(document);
      return true;
    }
    return false;
  }

  async updateMany(documents: Document[], criteria: Criteria): Promise<boolean> {
    let matched = false;
    for (const document of documents) {
      const changed = await this.updateOne(document, criteria);
      if (changed === true) {
        matched = true;
      }
    }
    return matched;
  }

  async updateOne(document: Document, criteria: Criteria): Promise<boolean> {
    if (await this.storage.has(document.id)) {
      await this.#updateOrRemove(document, criteria);
      return true;
    } else if (isMatch(document, criteria)) {
      await this.storage.insertOne(document);
      return true;
    }
    return false;
  }

  async remove(documents: Document[]): Promise<boolean> {
    let matched = false;
    for (const document of documents) {
      if (isMatch(document, { id: document.id })) {
        await this.storage.remove({ id: document.id });
        matched = true;
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
