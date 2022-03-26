import { AggregateRootClass, createEventRecord, Event, publisher } from "@valkyr/ledger";

import { db } from "./Database";

/**
 * Insert event into the local ledger.
 *
 * Events are inserted by updating the recorded value of the event before
 * it is added to the ledger. This is a distributed reference point and
 * each distributed service using a ledger will have its own recorded
 * date of each event it has seen.
 *
 * @param event - Event to insert into the local ledger.
 */
export async function insert(event: Event) {
  const record = createEventRecord(event);
  await db.collection.insertOne(record);
  await publisher.project(record, { hydrated: false, outdated: false });
}

/**
 * Reduce an event stream down to its final aggregate state representation.
 *
 * We do this by left folding all events in a stream down to a single
 * representation of the entire stream.
 *
 * @param streamId - Stream to pull events from.
 * @param reducer  - Reducer method used to fold the stream events.
 *
 * @returns Aggregate state of the stream
 */
export async function reduce<AggregateRoot extends AggregateRootClass>(
  streamId: string,
  aggregate: AggregateRoot
): Promise<InstanceType<AggregateRoot> | undefined> {
  const events = await db.getStream(streamId);
  if (events.length === 0) {
    return undefined;
  }
  const instance = new aggregate();
  for (const event of events) {
    instance.apply(event);
  }
  return instance as InstanceType<AggregateRoot>;
}

/**
 * Enable the ability to check if an incoming even is outdated within its
 * stream or not. This is used to avoid overwriting newer events that may
 * arrive later in distributed environments.
 *
 * Outdated checks works by checking the actual creation date of the event
 * when it was created for the first time. If another event of the same
 * type in the same stream exists and is newer the event is considered
 * outdated.
 *
 * @param event - Event to check against the local ledger.
 *
 * @returns Outdated state of the event
 */
export async function outdated({ streamId, type, created }: Event): Promise<boolean> {
  return db.collection.count({ streamId, type, created: { $gt: created } }).then((count) => count > 0);
}
