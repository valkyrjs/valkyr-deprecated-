import { ErrorResponse, SuccessResponse } from "@valkyr/jsonrpc";
import { EventRecord } from "@valkyr/ledger";

import { cursor } from "./cursor";
import { requests } from "./requests";
import { store } from "./store";

export const pull = {
  _id: 0,

  get id(): string {
    return `ledger-${this._id++}`;
  },

  async container(container: string): Promise<void> {
    await pushEventResult(
      container,
      await requests.getEventStreamContainer({ container, cursor: await cursor.get(container) }, this.id)
    );
  },

  async stream(stream: string): Promise<void> {
    await pushEventResult(stream, await requests.getEventStream({ stream, cursor: await cursor.get(stream) }, this.id));
  }
};

async function pushEventResult(id: string, response: SuccessResponse<EventRecord[]> | ErrorResponse): Promise<void> {
  if ("result" in response && response.result.length > 0) {
    for (const event of response.result) {
      await store.insert(event);
    }
    await cursor.set(id, cursor.timestamp(response.result));
  }
}
