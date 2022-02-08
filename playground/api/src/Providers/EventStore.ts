import { createEventRecord, publisher, ReduceHandler } from "@valkyr/ledger";
import type { Event } from "stores";

import { collection } from "../Collections";

async function insert(event: Event) {
  const record = createEventRecord(event);
  await collection.events.insertOne(record);
  await publisher.project(record, { hydrated: false, outdated: false });
}

async function reduce<LeftFold extends ReduceHandler>(streamId: string, leftFold: LeftFold) {
  const events = await findByStreamId(streamId);
  if (events.length) {
    return leftFold(events) as ReturnType<LeftFold>;
  }
}

async function outdated({ streamId, type, created }: Event): Promise<boolean> {
  return collection.events.count({ streamId, type, created: { $gt: created } }).then((count) => count > 0);
}

async function findByStreamId(streamId: string, created?: string, direction?: 1 | -1) {
  const filter: any = { streamId };
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
  findByStreamId
};
