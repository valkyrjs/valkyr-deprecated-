import { Document, Storage } from "../Storage";

export class MemoryStorage<D extends Document = Document> extends Storage<D> {
  readonly #documents = new Map<string, D>();

  async hasDocument(id: string): Promise<boolean> {
    return this.#documents.has(id);
  }

  async getDocument(id: string): Promise<D | undefined> {
    return this.#documents.get(id);
  }

  async getDocuments(): Promise<D[]> {
    return Array.from(this.#documents.values());
  }

  async setDocument(id: string, document: D): Promise<void> {
    this.#documents.set(id, document);
  }

  async delDocument(id: string): Promise<void> {
    this.#documents.delete(id);
  }

  async count(): Promise<number> {
    return this.#documents.size;
  }

  async flush(): Promise<void> {
    this.#documents.clear();
  }
}
