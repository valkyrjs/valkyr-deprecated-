import { Event, EventAuditor, makeEvent } from "@valkyr/ledger";

/*
 |--------------------------------------------------------------------------------
 | Event Factories
 |--------------------------------------------------------------------------------
 */

export const todoItemAdded = makeEvent<TodoItemAdded>("TodoItemAdded");
export const todoItemCompleted = makeEvent<TodoItemCompleted>("TodoItemCompleted");
export const todoItemUncompleted = makeEvent<TodoItemUncompleted>("TodoItemUncompleted");
export const todoItemArchived = makeEvent<TodoItemArchived>("TodoItemArchived");

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

export type TodoItemCompleted = Event<"TodoItemCompleted", {}, EventAuditor>;
export type TodoItemUncompleted = Event<"TodoItemUncompleted", {}, EventAuditor>;
export type TodoItemArchived = Event<"TodoItemArchived", {}, EventAuditor>;

/*
 |--------------------------------------------------------------------------------
 | Event Records
 |--------------------------------------------------------------------------------
 */

export type TodoEvent = TodoItemAdded | TodoItemCompleted | TodoItemUncompleted | TodoItemArchived;
