import { EventStore } from "@valkyr/event-store";

import { db } from "./database";
import { queue } from "./queue";

export const store = new EventStore<"client">(db.collection("events"));

store.subscribe(async ({ record, hydrated }) => {
  if (hydrated === false) {
    queue.requests.push({
      type: "addEvent",
      payload: record
    });
  }
});
