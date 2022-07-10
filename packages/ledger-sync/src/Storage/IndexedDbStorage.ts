import { del, get, set } from "idb-keyval";

import { EventStorage } from "./Storage";

export class IndexedDbStorage<Data = any> implements EventStorage<Data> {
  async set(streamId: string, data: Data) {
    await set(streamId, data);
  }

  async get(streamId: string) {
    return get(streamId);
  }

  async del(streamId: string) {
    await del(streamId);
  }

  async flush() {}
}
