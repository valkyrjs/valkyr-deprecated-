export type EventFactory<E extends Event> = E["data"] extends never
  ? (entityId: string) => E
  : E["meta"] extends never
  ? (entityId: string, data: E["data"]) => E
  : (entityId: string, data: E["data"], meta: E["meta"]) => E;

export interface Event<EventType = unknown, EventData = unknown | never, EventMeta = unknown | never> {
  /**
   * A unique event identifier correlating its identity in the **event store**
   * _(database)_.
   */
  eventId: string;

  /**
   * Identifier representing the entity in which many individual events/transactions
   * belongs to and is used to generate a specific aggregate state representation of
   * that particular identity.
   */
  entityId: string;

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
   * key when performing reduction logic to generate aggregate state for the entity
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
