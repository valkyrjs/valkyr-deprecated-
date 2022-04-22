import { InstanceAdapter } from "../Adapters";
import { Document, Storage } from "../Storage";
import { Criteria, isMatch } from "./Utils";

export type OnChangeFn = (documents: Document[]) => void;

export class Store {
  private constructor(private storage: Storage) {}

  public get data(): Document[] {
    return this.storage.data;
  }

  public static create() {
    return new Store(new Storage("observer", new InstanceAdapter()));
  }

  public async resolve(documents: Document[]): Promise<Document[]> {
    for (const document of documents) {
      await this.storage.insert(document);
    }
    return this.data;
  }

  public async insert(document: Document, criteria: Criteria): Promise<boolean> {
    if (isMatch(document, criteria)) {
      await this.storage.insert(document);
      return true;
    }
    return false;
  }

  public async update(document: Document, criteria: Criteria): Promise<boolean> {
    if (this.storage.has(document.id)) {
      await this.updateOrRemove(document, criteria);
      return true;
    } else if (isMatch(document, criteria)) {
      await this.storage.insert(document);
      return true;
    }
    return false;
  }

  public async delete(document: Document, criteria: Criteria): Promise<boolean> {
    if (isMatch(document, criteria)) {
      await this.storage.delete(document.id);
      return true;
    }
    return false;
  }

  private async updateOrRemove(document: Document, criteria: Criteria): Promise<void> {
    if (isMatch(document, criteria)) {
      await this.storage.replace(document.id, document);
    } else {
      await this.storage.delete(document.id);
    }
  }
}
