import { EventRecord } from "@valkyr/ledger";
import { Worker } from "@valkyr/queue";

import { requests } from "../requests";

export class EventWorker extends Worker<EventRecord> {
  readonly type = "addEvent" as const;
  readonly retryLimit = 2;

  #id = 0;

  async process(_: string, payload: EventRecord) {
    try {
      const response = await requests.addEvent(payload, this.#id++);
      if ("error" in response) {
        return this.error(response.error);
      }
    } catch (err) {
      return this.error(err);
    }
    return this.success();
  }
}
