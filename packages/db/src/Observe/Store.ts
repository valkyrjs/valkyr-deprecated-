import { Document, MemoryStorage, Storage } from "../Storage";
import { Criteria, isMatch } from "./IsMatch";

export type OnChangeFn = (documents: Document[]) => void;

export class Store {
  private constructor(private storage: Storage) {}

  static create(name = "observer") {
    return new Store(new MemoryStorage(name));
  }

  async resolve(documents: Document[]): Promise<Document[]> {
    for (const document of documents) {
      if ((await this.storage.hasDocument(document.id)) === false) {
        await this.storage.insert(document);
      }
    }
    return this.getDocuments();
  }

  async getDocuments(): Promise<Document[]> {
    return this.storage.getDocuments();
  }

  async insert(document: Document, criteria: Criteria): Promise<boolean> {
    if (isMatch(document, criteria)) {
      await this.storage.replace(document.id, document);
      return true;
    }
    return false;
  }

  async update(document: Document, criteria: Criteria): Promise<boolean> {
    if (await this.storage.hasDocument(document.id)) {
      await this.#updateOrRemove(document, criteria);
      return true;
    } else if (isMatch(document, criteria)) {
      await this.storage.insert(document);
      return true;
    }
    return false;
  }

  async remove(document: Document): Promise<boolean> {
    if (isMatch(document, { id: document.id })) {
      await this.storage.remove(document.id);
      return true;
    }
    return false;
  }

  async #updateOrRemove(document: Document, criteria: Criteria): Promise<void> {
    if (isMatch(document, criteria)) {
      await this.storage.replace(document.id, document);
    } else {
      await this.storage.remove(document.id);
    }
  }
}
