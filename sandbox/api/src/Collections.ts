import { RoleData } from "@valkyr/access";
import type { EventRecord } from "@valkyr/event-store";
import type { Account } from "stores";

import { mongo } from "./Lib/Mongo";

export const collection = {
  accounts: mongo.collection<Account>("accounts"),
  events: mongo.collection<EventRecord>("events"),
  roles: mongo.collection<RoleData>("roles")
};

export async function loadCollections() {
  await loadEventsIndexes();
}

async function loadEventsIndexes() {
  await collection.events.createIndexes([
    { name: "id", key: { id: 1 }, unique: true },
    { name: "stream", key: { entityId: 1, recorded: 1 }, unique: true },
    { name: "outdated", key: { entityId: 1, type: 1, created: 1 } }
  ]);
}
