import { Db } from "mongodb";

import { container } from "./Container";
import { db } from "./Database";
import { insert, reduce } from "./EventStore";

export * from "@valkyr/ledger";

async function setup(database: Db) {
  container.set("Database", database);
}

export async function loadCollections() {
  await loadEventsIndexes();
}

async function loadEventsIndexes() {
  await db.events.createIndexes([
    { name: "id", key: { eventId: 1 }, unique: true },
    { name: "subscription", key: { streamId: 1, recorded: 1 }, unique: true },
    { name: "outdated", key: { streamId: 1, type: 1, created: 1 } }
  ]);
}

export const ledger = {
  setup,
  insert,
  reduce,
  events: db.getEvents,
  stream: db.getStream,
  pull: db.getRecorded
};
