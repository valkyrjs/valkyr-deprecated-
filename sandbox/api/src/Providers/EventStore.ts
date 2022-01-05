import { createEventRecord, EventRecord, publisher, ReduceHandler } from "@valkyr/event-store";
import type { Event } from "stores";

import { collection } from "../Collections";

async function insert(entityId: string, event: Event) {
  const record = createEventRecord(entityId, event);
  await collection.events.insertOne(record);
  await publisher.project(record, { hydrated: false, outdated: false });
}

async function reduce<LeftFold extends ReduceHandler>(entityId: string, leftFold: LeftFold) {
  const events = await findByEntityId(entityId);
  if (events.length) {
    return leftFold(events) as ReturnType<LeftFold>;
  }
}

async function outdated({ entityId, type, created }: EventRecord): Promise<boolean> {
  return collection.events.count({ entityId, type, created: { $gt: created } }).then((count) => count > 0);
}

async function findByEntityId(entityId: string, created?: string, direction?: 1 | -1) {
  const filter: any = { entityId };
  if (created) {
    filter.created = {
      [direction === 1 ? "$gt" : "$lt"]: created
    };
  }
  return collection.events.find(filter).sort("created").toArray();
}

export const store = {
  insert,
  reduce,
  outdated,
  findByEntityId
};