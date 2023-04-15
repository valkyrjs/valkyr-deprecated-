import type { RawObject } from "mingo/types";

import { hashCodeQuery } from "../Hash.js";
import { Document, Options } from "../Storage/mod.js";

export class IndexedDbCache<D extends Document = Document> {
  readonly #cache = new Map<number, string[]>();
  readonly #documents = new Map<string, RawObject>();

  hash(criteria: RawObject, options: Options): number {
    return hashCodeQuery(criteria, options);
  }

  set(hashCode: number, documents: D[]) {
    this.#cache.set(
      hashCode,
      documents.map((document) => document.id)
    );
    for (const document of documents) {
      this.#documents.set(document.id, document);
    }
  }

  get(hashCode: number): D[] | undefined {
    const ids = this.#cache.get(hashCode);
    if (ids !== undefined) {
      return ids.map((id) => this.#documents.get(id) as D);
    }
  }

  flush() {
    this.#cache.clear();
    this.#documents.clear();
  }
}
