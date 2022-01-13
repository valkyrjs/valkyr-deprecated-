---
id: event
title: Event
sidebar_label: Event
slug: /event
---

As eluded in the introduction an event is a record/transaction of something that has happened. When a user or system updates a value an event must be created before something reacts to it.

## Event Structure

```ts
interface Event {
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
```

## Creating Events

To create an event we usually want to go through something referred to as a command or action. A command is a preliminary operation checking to see if an event can be created. This can be anything from looking at the current aggregate state of an entity, checking the users access to performing the command or any number of things we want to verify before allowing an event to go through.

An quick example of what a command could look like:

```ts
async function updateAccountEmail(entityId: string, email: string) {
  const events = await ledger.events(entityId);

  const state = account.reduce(events);
  if (email === state.email) {
    throw new Error("Email has not changed.");
  }

  await ledger.append(accountEmailSet(entityId, { email }));
}
```
