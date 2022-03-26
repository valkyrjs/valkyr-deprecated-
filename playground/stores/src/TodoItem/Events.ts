import { createEvent, Event } from "@valkyr/ledger";

import type { Auditor } from "../Workspace";
import type { TodoItem } from "./Aggregate";

export type TodoItemAdded = Event<"TodoItemAdded", Pick<TodoItem, "data">, Auditor>;
export type TodoItemDataSet = Event<"TodoItemDataSet", Pick<TodoItem, "id" | "data">, Auditor>;
export type TodoItemDone = Event<"TodoItemDone", Pick<TodoItem, "id">, Auditor>;
export type TodoItemUndone = Event<"TodoItemUndone", Pick<TodoItem, "id">, Auditor>;

export const events = {
  added: createEvent<TodoItemAdded>("TodoItemAdded"),
  dataSet: createEvent<TodoItemDataSet>("TodoItemDataSet"),
  done: createEvent<TodoItemDone>("TodoItemDone"),
  undone: createEvent<TodoItemUndone>("TodoItemUndone")
};
