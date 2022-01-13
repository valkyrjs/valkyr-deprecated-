import { RoleData } from "@valkyr/access";
import type { Account, Event } from "stores";

import { mongo } from "./Lib/Mongo";

export const collection = {
  accounts: mongo.collection<Account>("accounts"),
  events: mongo.collection<Event>("events"),
  roles: mongo.collection<RoleData>("roles")
};

export async function loadCollections() {
  await loadEventsIndexes();
}

async function loadEventsIndexes() {
  await collection.events.createIndexes([
    { name: "id", key: { eventId: 1 }, unique: true },
    { name: "subscription", key: { entityId: 1, recorded: 1 }, unique: true },
    { name: "outdated", key: { entityId: 1, type: 1, created: 1 } }
  ]);
}
