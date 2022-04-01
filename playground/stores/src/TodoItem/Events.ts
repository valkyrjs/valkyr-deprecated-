import { createEvent, Event } from "@valkyr/ledger";

import type { Auditor } from "../Workspace";
import type { TodoItemState } from "./Aggregate";

/*
 |--------------------------------------------------------------------------------
 | Events
 |--------------------------------------------------------------------------------
 */

export const events = {
  added: createEvent<TodoItemAdded>("TodoItemAdded"),
  dataSet: createEvent<TodoItemDataSet>("TodoItemDataSet"),
  done: createEvent<TodoItemDone>("TodoItemDone"),
  undone: createEvent<TodoItemUndone>("TodoItemUndone")
};

/*
 |--------------------------------------------------------------------------------
 | Events Types
 |--------------------------------------------------------------------------------
 */

export type TodoItemAdded = Event<"TodoItemAdded", Pick<TodoItemState, "data">, Auditor>;
export type TodoItemDataSet = Event<"TodoItemDataSet", Pick<TodoItemState, "id" | "data">, Auditor>;
export type TodoItemDone = Event<"TodoItemDone", Pick<TodoItemState, "id">, Auditor>;
export type TodoItemUndone = Event<"TodoItemUndone", Pick<TodoItemState, "id">, Auditor>;

/*
 |--------------------------------------------------------------------------------
 | Events Union
 |--------------------------------------------------------------------------------
 */

export type TodoItemEvent = TodoItemAdded | TodoItemDataSet | TodoItemDone | TodoItemUndone;
