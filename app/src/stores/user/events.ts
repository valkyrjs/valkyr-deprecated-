import { Event, EventToRecord, makeEventFactory } from "@valkyr/ledger";

/*
 |--------------------------------------------------------------------------------
 | Event Factories
 |--------------------------------------------------------------------------------
 */

export const user = {
  created: makeEventFactory<UserCreated>("UserCreated")
};

/*
 |--------------------------------------------------------------------------------
 | Events
 |--------------------------------------------------------------------------------
 */

export type UserCreated = Event<"UserCreated", { name: string; email: string }, { auditor: string }>;

/*
 |--------------------------------------------------------------------------------
 | Event Records
 |--------------------------------------------------------------------------------
 */

export type UserEvent = EventToRecord<UserCreated>;
