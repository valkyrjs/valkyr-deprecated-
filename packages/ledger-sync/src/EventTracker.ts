import { Storage } from "./Storage/Storage";

export const tracker = new (class Tracker extends Storage<string> {
  async track(streamId: string, type: string, at: string): Promise<void> {
    const id = this.#getPointer(streamId, type);
    const ts = await this.get(this.#getPointer(streamId, type));
    if (ts === undefined || at > ts) {
      await this.set(id, at);
    }
  }

  async getTimestamp(streamId: string, type: string): Promise<string> {
    return (await this.get(this.#getPointer(streamId, type))) ?? "";
  }

  async isOutdated(streamId: string, type: string, at: string): Promise<boolean> {
    return (await this.getTimestamp(streamId, type)) > at;
  }

  #getPointer(streamId: string, type: string): string {
    return `${streamId}:${type}`;
  }
})();
