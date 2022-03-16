import { createEvent, Event } from "@valkyr/ledger";

import type { Auditor } from "../Member";
import type { Todo } from "./Aggregate";

export type TodoCreated = Event<"TodoCreated", Pick<Todo, "workspaceId" | "name">, Auditor>;
export type TodoRemoved = Event<"TodoRemoved", never, Auditor>;

export const events = {
  created: createEvent<TodoCreated>("TodoCreated"),
  removed: createEvent<TodoRemoved>("TodoRemoved")
};
