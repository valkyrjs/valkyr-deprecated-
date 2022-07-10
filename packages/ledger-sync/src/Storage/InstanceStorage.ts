import { EventStorage } from "./Storage";

export class InstanceStorage<Data = any> implements EventStorage<Data> {
  readonly #cache = new Map<string, Data>();

  async set(streamId: string, data: Data) {
    this.#cache.set(streamId, data);
  }

  async get(streamId: string) {
    return this.#cache.get(streamId);
  }

  async del(streamId: string) {
    this.#cache.delete(streamId);
  }

  async flush() {
    this.#cache.clear();
  }
}
