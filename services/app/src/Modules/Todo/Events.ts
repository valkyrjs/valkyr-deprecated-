import { Event, EventAuditor, makeEvent } from "@valkyr/ledger";

/*
 |--------------------------------------------------------------------------------
 | Event Factories
 |--------------------------------------------------------------------------------
 */

export const todoItemAdded = makeEvent<TodoItemAdded>("TodoItemAdded");

/*
 |--------------------------------------------------------------------------------
 | Events
 |--------------------------------------------------------------------------------
 */

export type TodoItemAdded = Event<
  "TodoItemAdded",
  {
    description: string;
  },
  EventAuditor
>;

/*
 |--------------------------------------------------------------------------------
 | Event Records
 |--------------------------------------------------------------------------------
 */

export type TodoEvent = TodoItemAdded;
