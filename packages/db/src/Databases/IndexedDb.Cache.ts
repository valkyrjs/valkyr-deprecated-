import { hashCodeQuery } from "../Hash.js";
import { Options } from "../Storage/mod.js";
import type { Document, Filter, WithId } from "../Types.js";

export class IndexedDbCache<TSchema extends Document = Document> {
  readonly #cache = new Map<number, string[]>();
  readonly #documents = new Map<string, WithId<TSchema>>();

  hash(filter: Filter<WithId<TSchema>>, options: Options): number {
    return hashCodeQuery(filter, options);
  }

  set(hashCode: number, documents: WithId<TSchema>[]) {
    this.#cache.set(
      hashCode,
      documents.map((document) => document.id)
    );
    for (const document of documents) {
      this.#documents.set(document.id, document);
    }
  }

  get(hashCode: number): WithId<TSchema>[] | undefined {
    const ids = this.#cache.get(hashCode);
    if (ids !== undefined) {
      return ids.map((id) => this.#documents.get(id) as WithId<TSchema>);
    }
  }

  flush() {
    this.#cache.clear();
    this.#documents.clear();
  }
}
