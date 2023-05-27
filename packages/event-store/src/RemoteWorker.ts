import { Worker } from "@valkyr/queue";

import { EventRecord } from "./Event/mod.js";
import type { RemoteAdapter } from "./Remote.js";

export class EventWorker extends Worker<EventRecord> {
  readonly type = "events" as const;
  readonly retryLimit = 2;

  constructor(readonly remote: RemoteAdapter) {
    super();
  }

  async process(_: string, payload: EventRecord) {
    try {
      await this.remote.push(payload);
    } catch (error) {
      return this.error(error.message, payload);
    }
    return this.success();
  }
}
