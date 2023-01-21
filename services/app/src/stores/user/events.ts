import { Event, EventToRecord, makeEvent } from "@valkyr/app";

import { StreamContainer } from "~stores/meta";

/*
 |--------------------------------------------------------------------------------
 | Event Factories
 |--------------------------------------------------------------------------------
 */

export const user = {
  created: makeEvent<UserCreated>("UserCreated")
};

/*
 |--------------------------------------------------------------------------------
 | Events
 |--------------------------------------------------------------------------------
 */

export type UserCreated = Event<"UserCreated", { name: string; email: string }, StreamContainer>;

/*
 |--------------------------------------------------------------------------------
 | Event Records
 |--------------------------------------------------------------------------------
 */

export type UserEvent = EventToRecord<UserCreated>;
