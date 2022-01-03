import { nanoid } from "@valkyr/utils";

import { getLogicalTimestamp } from "./Time";

/*
 |--------------------------------------------------------------------------------
 | Event
 |--------------------------------------------------------------------------------
 */

/**
 * Allows us to define a specific event definition and provide a method that
 * enforces this definition upon creating new events.
 *
 * @param type - Type of event being created by the factory.
 *
 * @returns Event factory
 */
export function createEvent<E extends Event>(type: E["type"]): EventFactory<E> {
  return function (streamId: string, data: E["data"] = {}, meta: E["meta"] = {}) {
    const timestamp = getLogicalTimestamp();
    return {
      id: nanoid(),
      streamId,
      type,
      data,
      meta,
      created: timestamp,
      recorded: timestamp
    } as E;
  };
}

/**
 * Allows us to create a local version of the given event. A local version
 * refers to the recorded timestamp of the given event. This is used to assign
 * cursor values based on the originating central authority use in stream
 * synchronization logic.
 *
 * @param event - Event to create a new recorded timestamp for.
 *
 * @returns Event with new local recorded timestamp.
 */
export function createEventRecord<E extends Event>(event: E): E {
  return {
    ...event,
    recorded: getLogicalTimestamp()
  };
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type EventFactory<E extends Event> = E["data"] extends never
  ? (streamId: string) => E
  : E["meta"] extends never
  ? (streamId: string, data: E["data"]) => E
  : (streamId: string, data: E["data"], meta: E["meta"]) => E;

export interface Event<EventType = string, EventData = unknown | never, EventMeta = unknown | never> {
  /**
   * A unique event identifier correlating its identity in the **event store**
   * _(database)_.
   */
  id: string;

  /**
   * Identifier representing the stream in which many individual events/transactions
   * belongs to and is used to generate a specific aggregate state representation of
   * that particular identity.
   */
  streamId: string;

  /**
   * Event identifier describing the intent of the event in a past tense format.
   */
  type: EventType;

  /**
   * Stores the recorded partial piece of data that makes up a larger aggregate
   * state.
   */
  data: EventData;

  /**
   * Stores additional meta data about the event that is not directly related
   * to the aggregate state.
   */
  meta: EventMeta;

  /**
   * An immutable logical hybrid clock timestamp representing the wall time when
   * the event was created.
   *
   * This value is used to identify the date of its creation as well as a sorting
   * key when performing reduction logic to generate aggregate state for the stream
   * in which the event belongs.
   */
  created: string;

  /**
   * A mutable logical hybrid clock timestamps representing the wall time when the
   * event was recorded to the local **event ledger** _(database)_ as opposed to
   * when the event was actually created.
   *
   * This value is used when performing event synchronization between two different
   * event ledgers.
   */
  recorded: string;
}
