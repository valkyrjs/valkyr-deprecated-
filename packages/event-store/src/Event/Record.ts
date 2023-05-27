import { nanoid } from "nanoid";

import type { Event } from "./Event.js";

/**
 * Creates an event record by combining the given event with additional metadata.
 * The resulting record can be stored in an event store (database).
 *
 * @param tenant - Identifier for the tenant in which the event stream belongs.
 * @param stream - Identifier for the event stream to which the event belongs.
 * @param event  - The event to record.
 *
 * @returns An event record containing the event and additional metadata.
 */
export function createEventRecord<E extends Event>(tenant: string, stream: string, event: E): EventRecord<E> {
  const timestamp = getTimestamp();
  return {
    id: nanoid(11),
    tenant,
    stream,
    ...event,
    created: timestamp,
    recorded: timestamp
  };
}

export function getTimestamp(): string {
  return new Date().toISOString();
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type EventRecord<E extends Event = Event> = {
  /**
   * A unique event identifier correlating its identity in the **event store**
   * _(database)_.
   */
  id: string;

  /**
   * Identifier representing the tenant in which many individual streams belongs
   * and is used for grouping streams together for easier management.
   */
  tenant: string;

  /**
   * Identifier representing the stream in which many individual events/transactions
   * belongs to and is used to generate a specific aggregate state representation of
   * that particular identity.
   */
  stream: string;

  /**
   * Event identifier describing the intent of the event in a past tense format.
   */
  type: E["type"];

  /**
   * Stores the recorded partial piece of data that makes up a larger aggregate
   * state.
   */
  data: E["data"];

  /**
   * Stores additional meta data about the event that is not directly related
   * to the aggregate state.
   */
  meta: E["meta"];

  /**
   * An immutable iso timestamp representing the wall time when the event was created.
   *
   * This value is used to identify the date of its creation as well as a sorting
   * key when performing reduction logic to generate aggregate state for the stream
   * in which the event belongs.
   */
  created: string;

  /**
   * A mutable iso timestamps representing the wall time when the event was recorded to
   * the local **event ledger** _(database)_ as opposed to when the event was actually
   * created.
   *
   * This value is used when performing event synchronization between two different
   * event ledgers.
   */
  recorded: string;
};

export type EventToRecord<E> = E extends Event ? EventRecord<E> : never;
