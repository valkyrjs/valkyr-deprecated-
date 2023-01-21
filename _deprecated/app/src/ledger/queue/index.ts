import { IndexedStorage, Queue } from "@valkyr/queue";

import { EventWorker } from "./worker";

export const queue = {
  async start() {
    await Promise.all([queue.requests.start()]);
  },
  requests: new Queue([new EventWorker()], {
    storage: new IndexedStorage("ledger:event-queue")
  })
};

export type Worker = EventWorker;
